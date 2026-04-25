"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Finding } from "@seniorify/core";

type Turn = { role: "junior" | "senior"; text: string };

type EvaluateResult =
  | { verdict: "probe"; followup: string }
  | { verdict: "reject"; followup: string }
  | { verdict: "accept"; recordedDefense: string };

const SYSTEM_PROMPT = `You are the voice interface for Seniorify. Your job is to LISTEN to a junior engineer defend a single finding on their plan, and to RELAY their words to the senior brain via the evaluate_defense tool. You do not form opinions about whether their defense is good — the brain decides.

Behavior:
- Greet briefly. Read the active finding aloud once (title + a short paraphrase of the detail). Then ask them to defend it.
- After the junior speaks any substantive answer (more than ~5 words), CALL evaluate_defense. Do not respond with your own analysis first.
- The tool returns either a "followup" string (probe or reject) or a "recordedDefense" string (accept).
  - If followup: voice it verbatim, then wait for the junior's next answer. Followups will be "Why X and not Y?" questions — deliver them in a curious, not adversarial, tone.
  - If recordedDefense (accept): say "got it — recorded as: <recordedDefense>." Then voice the active finding's "learn" line verbatim as the takeaway, prefixed with "and the takeaway here is:". Then close politely.
- Never give the junior the answer. Never invent risks beyond the active finding. Never accept a defense yourself — only the tool can.
- Keep your spoken turns short. You are a relay, not a coach.`;

const TOOLS = [
  {
    type: "function" as const,
    name: "evaluate_defense",
    description:
      "Send the junior's defense to the senior brain for evaluation. Call this after every substantive junior turn. The system injects the transcript and latest utterance automatically — pass no arguments.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];

export function VoiceDefend({
  planId,
  finding,
}: {
  planId: string;
  finding: Finding;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "connecting" | "live" | "ending" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<Turn[]>([]);
  const [verdict, setVerdict] = useState<EvaluateResult | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transcriptRef = useRef<Turn[]>([]);
  const latestUtteranceRef = useRef<string>("");

  // Keep ref in sync with state for use inside async tool handlers.
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const sendEvent = useCallback((event: Record<string, unknown>) => {
    const dc = dcRef.current;
    if (!dc || dc.readyState !== "open") return;
    dc.send(JSON.stringify(event));
  }, []);

  const handleEvaluateCall = useCallback(
    async (callId: string) => {
      const latestUtterance = latestUtteranceRef.current.trim();
      if (!latestUtterance) {
        sendEvent({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: callId,
            output: JSON.stringify({
              verdict: "probe",
              followup:
                "I didn't catch that. Can you say a bit more about how you'd handle it?",
            }),
          },
        });
        sendEvent({ type: "response.create" });
        return;
      }

      try {
        const res = await fetch("/api/realtime/evaluate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            planId,
            findingId: finding.id,
            latestUtterance,
            transcript: transcriptRef.current,
          }),
          cache: "no-store",
        });
        const json = (await res.json()) as
          | { ok: true; result: EvaluateResult }
          | { ok: false; error: string };
        if (!json.ok) throw new Error(json.error);

        setVerdict(json.result);

        sendEvent({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: callId,
            output: JSON.stringify(json.result),
          },
        });
        sendEvent({ type: "response.create" });

        if (json.result.verdict === "accept") {
          const recordRes = await fetch("/api/mcp", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              tool: "defend",
              params: {
                planId,
                findingId: finding.id,
                defense: json.result.recordedDefense,
              },
            }),
            cache: "no-store",
          });
          if (!recordRes.ok) {
            throw new Error(`defend failed: ${recordRes.status}`);
          }
          setStatus("ending");
          // Refresh after a beat so the model finishes speaking the close.
          setTimeout(() => {
            router.refresh();
          }, 2500);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "evaluate failed";
        setError(message);
        sendEvent({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: callId,
            output: JSON.stringify({
              verdict: "probe",
              followup:
                "Something went wrong on my side. Can you say that one more time?",
            }),
          },
        });
        sendEvent({ type: "response.create" });
      }
    },
    [planId, finding.id, router, sendEvent],
  );

  const stop = useCallback(() => {
    dcRef.current?.close();
    pcRef.current?.getSenders().forEach((s) => s.track?.stop());
    pcRef.current?.close();
    dcRef.current = null;
    pcRef.current = null;
    setStatus("idle");
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setVerdict(null);
    setTranscript([]);
    transcriptRef.current = [];
    latestUtteranceRef.current = "";
    setStatus("connecting");

    try {
      const sessionRes = await fetch("/api/realtime/session", {
        method: "POST",
      });
      const sessionJson = (await sessionRes.json()) as
        | {
            ok: true;
            result: { clientSecret: string; model: string };
          }
        | { ok: false; error: string };
      if (!sessionJson.ok) throw new Error(sessionJson.error);
      const { clientSecret, model } = sessionJson.result;

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const audioEl = audioRef.current ?? new Audio();
      audioEl.autoplay = true;
      audioRef.current = audioEl;
      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
      };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.addEventListener("open", () => {
        setStatus("live");
        sendEvent({
          type: "session.update",
          session: {
            instructions: [
              SYSTEM_PROMPT,
              ``,
              `Active finding under defense:`,
              `- severity: ${finding.severity}`,
              `- category: ${finding.category}`,
              `- title: ${finding.title}`,
              `- detail: ${finding.detail}`,
              `- learn: ${finding.learn ?? "(not provided — skip the takeaway line)"}`,
            ].join("\n"),
            tools: TOOLS,
            tool_choice: "auto",
          },
        });
        sendEvent({ type: "response.create" });
      });

      dc.addEventListener("message", (event) => {
        let msg: { type: string; [k: string]: unknown };
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }

        if (msg.type === "conversation.item.input_audio_transcription.completed") {
          const text = String(msg.transcript ?? "").trim();
          if (text) {
            latestUtteranceRef.current = text;
            setTranscript((prev) => [...prev, { role: "junior", text }]);
          }
          return;
        }

        if (msg.type === "response.audio_transcript.done") {
          const text = String(msg.transcript ?? "").trim();
          if (text) {
            setTranscript((prev) => [...prev, { role: "senior", text }]);
          }
          return;
        }

        if (msg.type === "response.function_call_arguments.done") {
          const name = String(msg.name ?? "");
          const callId = String(msg.call_id ?? "");
          if (name === "evaluate_defense" && callId) {
            void handleEvaluateCall(callId);
          }
          return;
        }

        if (msg.type === "error") {
          const errMsg =
            (msg.error as { message?: string } | undefined)?.message ??
            "realtime error";
          setError(errMsg);
        }
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch(
        `https://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${clientSecret}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp ?? "",
        },
      );
      if (!sdpRes.ok) {
        throw new Error(`sdp exchange failed: ${sdpRes.status}`);
      }
      const answerSdp = await sdpRes.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
    } catch (e) {
      const message = e instanceof Error ? e.message : "voice session failed";
      setError(message);
      setStatus("error");
      stop();
    }
  }, [finding, sendEvent, handleEvaluateCall, stop]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const isLive = status === "live" || status === "ending";

  return (
    <div className="rounded-[4px] border border-zinc-300 bg-zinc-50 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500">defend your demo · voice</span>
          <p className="text-sm font-semibold text-zinc-900">{finding.title}</p>
        </div>
        <div className="flex items-center gap-2">
          {!isLive ? (
            <button
              type="button"
              onClick={start}
              disabled={status === "connecting"}
              className="rounded-[4px] border border-zinc-900 bg-zinc-900 px-3 py-1.5 text-xs text-white hover:bg-zinc-800 disabled:opacity-40"
            >
              {status === "connecting" ? "connecting..." : "Start voice defense"}
            </button>
          ) : (
            <button
              type="button"
              onClick={stop}
              className="rounded-[4px] border border-zinc-200 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50"
            >
              End
            </button>
          )}
        </div>
      </div>

      {transcript.length > 0 ? (
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto rounded-[4px] border border-zinc-200 bg-white p-3">
          {transcript.map((t, i) => (
            <div key={i} className="text-sm leading-relaxed">
              <span
                className={
                  t.role === "junior"
                    ? "font-mono text-[11px] uppercase tracking-wide text-zinc-500 mr-2"
                    : "font-mono text-[11px] uppercase tracking-wide text-[#15803D] mr-2"
                }
              >
                {t.role}
              </span>
              <span className="text-zinc-900">{t.text}</span>
            </div>
          ))}
        </div>
      ) : isLive ? (
        <p className="text-xs text-zinc-500 italic">
          listening — start speaking when you&apos;re ready.
        </p>
      ) : null}

      {verdict ? (
        <div className="rounded-[4px] border border-zinc-200 bg-white p-3 text-sm">
          <span className="font-mono text-[11px] uppercase tracking-wide text-zinc-500 mr-2">
            verdict
          </span>
          <span className="text-zinc-900">
            {verdict.verdict === "accept"
              ? `accepted — recorded as: "${verdict.recordedDefense}"`
              : `${verdict.verdict} — ${verdict.followup}`}
          </span>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[4px] border border-[#B91C1C]/30 bg-red-50 p-3 text-xs text-[#B91C1C] font-mono">
          {error}
        </div>
      ) : null}

      <audio ref={audioRef} hidden />
    </div>
  );
}
