#!/bin/bash

# Create content directory structure for a new year
# Usage: ./scripts/new-year.sh [year]
# Example: ./scripts/new-year.sh 2027

YEAR=${1:-$(date +%Y)}
BASE_DIR="src/content/posts"

CATEGORIES=(
  "projects"
  "recipes"
  "notes"
  "reviews"
  "personal"
)

echo "Creating directory structure for $YEAR..."

for category in "${CATEGORIES[@]}"; do
  dir="$BASE_DIR/$YEAR/$category"
  if [ -d "$dir" ]; then
    echo "  ⚠ $dir already exists"
  else
    mkdir -p "$dir"
    echo "  ✓ Created $dir"
  fi
done

echo ""
echo "Done! New year structure ready at $BASE_DIR/$YEAR/"
echo ""
echo "Categories:"
for category in "${CATEGORIES[@]}"; do
  echo "  - $category"
done
