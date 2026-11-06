#!/usr/bin/env bash
set -euo pipefail

server_directory=$(mktemp -d)
node - "$server_directory/url" <<'NODE' &
const { writeFileSync } = require('node:fs');
const server = require('../../node_modules/http-server').createServer({ root: './storybook-static' });
server.listen(0, '127.0.0.1', () => {
  writeFileSync(process.argv[2], `http://127.0.0.1:${server.server.address().port}`);
});
NODE
server_pid=$!
trap 'kill "$server_pid" 2>/dev/null || true; wait "$server_pid" 2>/dev/null || true; rm -rf "$server_directory"' EXIT

pnpm exec wait-on --timeout 30000 "$server_directory/url"
kill -0 "$server_pid"
pnpm exec test-storybook --url "$(cat "$server_directory/url")" "$@"
