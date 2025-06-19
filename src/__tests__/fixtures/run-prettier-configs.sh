#!/bin/bash

# Check if input file is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <input-file>"
  exit 1
fi

INPUT_FILE=$1
FILENAME=$(basename "$INPUT_FILE")
DIRNAME=$(dirname "$INPUT_FILE")
BASENAME="${FILENAME%.*}"
EXTENSION="${FILENAME##*.}"

# Configuration 1: Default (no multiline, no sort)
echo "Running prettier with default configuration..."
npx prettier --plugin=./dist/index.js --parser=typescript "$INPUT_FILE" > "$DIRNAME/${BASENAME}-default.$EXTENSION"

# Configuration 2: With multiline imports
echo "Running prettier with multiline imports..."
npx prettier --plugin=./dist/index.js --parser=typescript --multiline-imports=true "$INPUT_FILE" > "$DIRNAME/${BASENAME}-multiline.$EXTENSION"

# Configuration 3: With sort imports
echo "Running prettier with sort imports..."
npx prettier --plugin=./dist/index.js --parser=typescript --sort-imports=true "$INPUT_FILE" > "$DIRNAME/${BASENAME}-sorted.$EXTENSION"

# Configuration 4: With both multiline and sort imports
echo "Running prettier with multiline and sort imports..."
npx prettier --plugin=./dist/index.js --parser=typescript --multiline-imports=true --sort-imports=true "$INPUT_FILE" > "$DIRNAME/${BASENAME}-multiline-sorted.$EXTENSION"

echo "Done! Output files created in $DIRNAME"