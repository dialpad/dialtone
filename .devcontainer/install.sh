#!/bin/bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
pnpm setup
pnpm config set store-dir /workspaces/.pnpm-store
source /home/node/.bashrc
pnpm -g add nx
