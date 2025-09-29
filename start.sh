#! /bin/bash
set -euo pipefail

SESSION="blueprint"

tmux new-session -d -s "$SESSION" -n "cli"
tmux split-window -h -t "${SESSION}:cli"
tmux new-window -t "$SESSION:" -n "docker"
tmux split-window -h -t "${SESSION}:docker"
tmux send-keys -t "${SESSION}:docker" "docker compose up" C-m
tmux attach -t "$SESSION"
