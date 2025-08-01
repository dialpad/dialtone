#!/bin/bash
# Script to extract coverage data from HTML reports and create a JSON file

set -e

# Check if the coverage file exists
if [ ! -f "packages/dialtone-vue3/coverage/index.html" ]; then
  echo "Error: Coverage file not found. Run 'pnpm nx run dialtone-vue3:test:coverage' first."
  exit 1
fi

# Create coverage stats JSON file
echo '{' > coverage-stats.json

# Extract Vue3 coverage stats directly from HTML report
echo '  "vue3": {' >> coverage-stats.json

# Extract statement coverage
STATEMENTS=$(grep -B 1 "Statements" packages/dialtone-vue3/coverage/index.html | grep "strong" | sed 's/.*>\([0-9.]*\)%.*/\1/')

# Extract branch coverage
BRANCHES=$(grep -B 1 "Branches" packages/dialtone-vue3/coverage/index.html | grep "strong" | sed 's/.*>\([0-9.]*\)%.*/\1/')

# Extract function coverage
FUNCTIONS=$(grep -B 1 "Functions" packages/dialtone-vue3/coverage/index.html | grep "strong" | sed 's/.*>\([0-9.]*\)%.*/\1/')

# Extract line coverage
LINES=$(grep -B 1 "Lines" packages/dialtone-vue3/coverage/index.html | grep "strong" | sed 's/.*>\([0-9.]*\)%.*/\1/')

# Write to JSON
echo '    "statements": {' >> coverage-stats.json
echo "      \"pct\": $STATEMENTS" >> coverage-stats.json
echo '    },' >> coverage-stats.json
echo '    "branches": {' >> coverage-stats.json
echo "      \"pct\": $BRANCHES" >> coverage-stats.json
echo '    },' >> coverage-stats.json
echo '    "functions": {' >> coverage-stats.json
echo "      \"pct\": $FUNCTIONS" >> coverage-stats.json
echo '    },' >> coverage-stats.json
echo '    "lines": {' >> coverage-stats.json
echo "      \"pct\": $LINES" >> coverage-stats.json
echo '    }' >> coverage-stats.json

echo '  },' >> coverage-stats.json

# Add timestamp
TIMESTAMP=$(date -u +'%Y-%m-%dT%H-%M')
echo '  "timestamp": "'$TIMESTAMP'"' >> coverage-stats.json
echo '}' >> coverage-stats.json

# Format the JSON file properly
if command -v jq &> /dev/null; then
  jq '.' coverage-stats.json > coverage-stats-formatted.json
  mv coverage-stats-formatted.json coverage-stats.json
fi

echo "Coverage statistics extracted to coverage-stats.json"
