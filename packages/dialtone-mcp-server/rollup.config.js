import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.ts',
  output: {
    file: 'build/index.js',
    format: 'es',
    banner: '#!/usr/bin/env node',
  },
  external: ['@modelcontextprotocol/sdk/server/mcp.js', '@modelcontextprotocol/sdk/server/stdio.js'],
  plugins: [
    nodeResolve(),
    json(),
    typescript(),
  ],
};
