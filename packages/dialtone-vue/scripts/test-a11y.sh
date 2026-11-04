#!/usr/bin/env bash
set -euo pipefail

node ../../node_modules/http-server/bin/http-server ./storybook-static --port 9011 --silent &
server_pid=$!
trap 'kill "$server_pid" 2>/dev/null || true' EXIT

pnpm exec wait-on --timeout 30000 tcp:9011
kill -0 "$server_pid"
pnpm exec test-storybook --url http://localhost:9011
