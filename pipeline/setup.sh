#!/usr/bin/env bash
# One-time setup for dashboard pipeline. Run from project root.
set -e
echo "Installing pipeline dependencies (pandas, openpyxl)..."
if command -v pip &>/dev/null; then
  pip install -r requirements-pipeline.txt
elif command -v pip3 &>/dev/null; then
  pip3 install -r requirements-pipeline.txt
elif python3 -m pip --version &>/dev/null; then
  python3 -m pip install -r requirements-pipeline.txt
else
  echo "Could not find pip. Install Python with pip, or run:"
  echo "  apt install python3-pip   # Linux"
  echo "  brew install python       # macOS"
  exit 1
fi
echo "Done. Run: npm run refresh-dashboard"
