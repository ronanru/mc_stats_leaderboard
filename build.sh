#!/bin/sh
if ! command -v pnpm &> /dev/null
then
    echo "pnpm could not be found"
    exit
fi
if ! command -v cargo &> /dev/null
then
    echo "cargo could not be found"
    exit
fi
cd ./frontend
pnpm install
pnpm run build
cd ..
cargo build --release
