import { NextResponse } from "next/server";

const REALTIME_MODEL =
  process.env.OPENAI_REALTIME_MODEL ?? "gpt-4o-realtime-preview";

export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Voice defense is disabled in this public demo. The audit pipeline is real — DM Martin on LinkedIn for a live pilot.",
        demo: true,
      },
      { status: 503 },
    );
  }

  const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: REALTIME_MODEL,
      voice: "alloy",
      modalities: ["audio", "text"],
      input_audio_transcription: { model: "whisper-1" },
      turn_detection: { type: "server_vad" },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json(
      { ok: false, error: `realtime session failed: ${res.status} ${text}` },
      { status: 502 },
    );
  }

  const data = (await res.json()) as {
    client_secret: { value: string; expires_at: number };
  };

  return NextResponse.json({
    ok: true,
    result: {
      clientSecret: data.client_secret.value,
      expiresAt: data.client_secret.expires_at,
      model: REALTIME_MODEL,
    },
  });
}
