#!/usr/bin/env bash
# Exports the live D1 database to a dated SQL file. Run from the project folder:  bash scripts/backup-d1.sh
set -euo pipefail
mkdir -p backups
OUT="backups/helens-varieties-$(date +%Y-%m-%d-%H%M).sql"
npx wrangler d1 export helens-varieties-db --remote --output "$OUT"
echo "Saved $OUT  (keep it somewhere private: it contains customer details)"
