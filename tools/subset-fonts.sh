#!/usr/bin/env bash
# subset-fonts.sh — turn a full .ttf/.otf into a small latin-subset .woff2.
# Fills the gap the tooling inventory found: TVA/TradeBridge ship pre-made
# woff2 with no documented subsetting step. Run when re-branding a fork with
# a new typeface.
#
# Requires fonttools (brotli included):  pip install "fonttools[woff]" brotli
# Usage:  tools/subset-fonts.sh <input.ttf> <output-name>
#         tools/subset-fonts.sh ~/Downloads/Barlow-SemiBold.ttf barlow-condensed-600
# Output: public/fonts/<output-name>.woff2
set -euo pipefail

IN="${1:?usage: subset-fonts.sh <input.ttf|otf> <output-name>}"
NAME="${2:?usage: subset-fonts.sh <input.ttf|otf> <output-name>}"
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/fonts"
mkdir -p "$OUT_DIR"

# Latin + Latin-1 Supplement + common punctuation/symbols. Widen for other
# scripts (e.g. add CJK ranges) per client — TVA pins CJK by unicode-range.
UNICODES="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,\
U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"

pyftsubset "$IN" \
  --unicodes="$UNICODES" \
  --layout-features='kern,liga,clig,calt' \
  --flavor=woff2 \
  --output-file="$OUT_DIR/$NAME.woff2"

echo "✓ wrote $OUT_DIR/$NAME.woff2"
echo "  → add/update the @font-face src in src/styles/global.css to /fonts/$NAME.woff2"
