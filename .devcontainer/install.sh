#!/bin/bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
pnpm bin -g
pnpm setup
source /home/node/.bashrc
pnpm bin -g
pnpm -g add nx
