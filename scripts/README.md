# SIA Questions Parser

This directory contains the parser script that converts SIA exam questions from text format to structured JSON.

## Quick Start

```bash
node parse-questions.js
```

## What It Does

The parser:

1. Reads all `.txt` files from `Questions/` folders
2. Parses two different question formats:
   - **Format 1** (Door Supervisor): `Q1 | Difficulty: Easy` with `---` separators
   - **Format 2** (Security Guard/CCTV/Close Protection): `Question 1 [Easy]`
3. Extracts metadata (unit, chapter, titles)
4. Generates unique IDs for each question
5. Auto-generates topic tags
6. Validates all data
7. Outputs JSON files to `data/questions/`

## Output

### Question Files
- `data/questions/door-supervisor.json` - 692 questions
- `data/questions/security-guard.json` - 299 questions
- `data/questions/cctv-operator.json` - 296 questions
- `data/questions/close-protection.json` - 852 questions

### Metadata File
- `data/exams-metadata.json` - Exam statistics

### Report
- `data/PARSER_REPORT.md` - Detailed analysis and validation report

## Question Structure

```json
{
  "id": "DS-U1-C1_1-001",
  "exam": "door-supervisor",
  "unit": 1,
  "unitTitle": "Working in the Private Security Industry",
  "chapter": "1.1",
  "chapterTitle": "THE PRIVATE SECURITY INDUSTRY",
  "question": "Under which Act was the SIA established?",
  "options": {
    "A": "Private Security Industry Act 2001",
    "B": "Security Industry Act 1999",
    "C": "Security Services Act 2003",
    "D": "Home Office Security Act 2001"
  },
  "correctAnswer": "A",
  "explanation": "The SIA was created by the Private Security Industry Act 2001...",
  "difficulty": "easy",
  "tags": ["sia", "legislation"]
}
```

## Features

- Handles 93 source files across 4 exams
- Parses 2,139 questions total
- Validates all questions have:
  - Unique IDs
  - All 4 options (A-D)
  - Correct answer
  - Explanation
  - Valid difficulty level
- Auto-generates topic tags
- Pretty-prints JSON output

## Re-running the Parser

If question files are updated:

```bash
# Re-run the parser
node scripts/parse-questions.js

# Check the output
cat data/PARSER_REPORT.md
```

## Troubleshooting

**Issue:** Parser shows warnings about missing questions

**Solution:** Check that the source .txt files follow the correct format

**Issue:** Duplicate ID warnings

**Solution:** Ensure chapter numbers are correctly formatted (e.g., 2.10 not 2.1)

**Issue:** JSON syntax errors

**Solution:** Re-run the parser - it always generates valid JSON

## Dependencies

- Node.js (built-in modules only)
- No external packages required

## Notes

- The parser does NOT modify source files in `Questions/`
- All output goes to `data/` directory
- JSON files are pretty-printed for readability
- Chapter numbers are stored as strings to preserve "2.10" vs "2.1"
