#!/bin/bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
pnpm setup
source /home/node/.bashrc
pnpm -g add nx
