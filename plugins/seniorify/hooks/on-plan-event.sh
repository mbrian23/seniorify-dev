#!/usr/bin/env bash
set -euo pipefail

input=$(cat)

tool=$(printf '%s' "$input" | sed -n 's/.*"tool_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)
[ -z "$tool" ] && tool="seniorify"

target_dir="${CLAUDE_PROJECT_DIR:-$PWD}"
mkdir -p "$target_dir/.seniorify"
log="$target_dir/.seniorify/audit.log"

ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
{
  printf '\n--- %s  %s ---\n' "$ts" "$tool"
  printf '%s\n' "$input"
} >> "$log"

case "$tool" in
  *submit_plan) msg="Plan submitted — audit ready" ;;
  *sign_plan)   msg="Plan signed" ;;
  *)            msg="$tool" ;;
esac

if [[ "$(uname)" == "Darwin" ]] && command -v osascript >/dev/null 2>&1; then
  osascript -e "display notification \"$msg\" with title \"Seniorify\"" >/dev/null 2>&1 || true
elif command -v notify-send >/dev/null 2>&1; then
  notify-send "Seniorify" "$msg" || true
fi

exit 0
