#!/bin/bash
# ChartNap AI — הפעלה בדאבל-קליק (Mac)
cd "$(dirname "$0")"

if ! command -v npm >/dev/null 2>&1; then
  echo "Node.js is not installed. Please install it from https://nodejs.org and run again."
  echo "Node.js לא מותקן. התקינו מ-nodejs.org והריצו שוב."
  read -r -p "Press Enter to close..."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "First run — installing (one time, ~1 minute)..."
  npm install --no-audit --no-fund || { read -r -p "Install failed. Press Enter..."; exit 1; }
fi

echo "Starting ChartNap AI..."
( sleep 3 && open "http://localhost:5173" ) &
npm run dev
