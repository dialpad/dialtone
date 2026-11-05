#!/usr/bin/env node
// Exits non-zero when any of the three Storybook ports is already taken, so
// `storybook:all` doesn't frame another checkout's Storybook by mistake (the
// comparison only checks that something answers on Vue's port).
import { readFile } from 'node:fs/promises';
import { createConnection, createServer } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ports = JSON.parse(await readFile(join(here, 'ports.json'), 'utf8'));

// Something accepts connections on this host and port.
const answers = (port, host) => new Promise((resolve) => {
  const socket = createConnection({ port, host });
  socket.once('connect', () => { socket.destroy(); resolve(true); });
  socket.once('error', () => resolve(false));
});

// Binding fails, whoever holds the port.
const bindable = port => new Promise((resolve) => {
  const server = createServer();
  server.once('error', () => resolve(false));
  server.listen(port, () => server.close(() => resolve(true)));
});

const taken = [];
for (const [name, port] of Object.entries(ports)) {
  const inUse = await answers(port, '127.0.0.1') || await answers(port, '::1') || !await bindable(port);
  if (inUse) taken.push(`  ${port} (${name})`);
}

if (taken.length) {
  console.error([
    'storybook:all: these ports are already in use:',
    ...taken,
    'Another Storybook (maybe from another checkout) is running. Stop it first;',
    `\`lsof -nP -iTCP:<port> -sTCP:LISTEN\` shows which process holds a port.`,
  ].join('\n'));
  process.exit(1);
}
