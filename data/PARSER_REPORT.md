# SIA Exam Questions Parser - Final Report

**Date:** 2025-12-07  
**Total Questions Parsed:** 2,139

---

## Executive Summary

Successfully parsed and converted all SIA exam questions from text format to structured JSON. The parser handles two distinct file formats and generates unique IDs for each question while extracting metadata, difficulty levels, and generating relevant tags.

## File Structure

### Output Files

All output files are located in `/data/questions/`:

- **door-supervisor.json** (670 KB) - 692 questions
- **security-guard.json** (301 KB) - 299 questions
- **cctv-operator.json** (319 KB) - 296 questions
- **close-protection.json** (931 KB) - 852 questions

### Metadata File

- **data/exams-metadata.json** - Contains exam statistics and difficulty breakdown

---

## Exam Breakdown

### Door Supervisor (DS)
- **Total Questions:** 692
- **Source Files:** 25 files
- **Difficulty Distribution:**
  - Easy: 279 (40.3%)
  - Medium: 267 (38.6%)
  - Hard: 146 (21.1%)
- **Units:** 4 units (1-4)
- **Chapters:** 25 chapters

### Security Guard (SG)
- **Total Questions:** 299
- **Source Files:** 17 files
- **Difficulty Distribution:**
  - Easy: 120 (40.1%)
  - Medium: 120 (40.1%)
  - Hard: 59 (19.7%)
- **Units:** 3 units (1-3)
- **Chapters:** 17 chapters

### CCTV Operator (CCTV)
- **Total Questions:** 296
- **Source Files:** 12 files
- **Difficulty Distribution:**
  - Easy: 119 (40.2%)
  - Medium: 119 (40.2%)
  - Hard: 58 (19.6%)
- **Units:** 2 units (1-2)
- **Chapters:** 12 chapters

### Close Protection (CP)
- **Total Questions:** 852
- **Source Files:** 39 files
- **Difficulty Distribution:**
  - Easy: 342 (40.1%)
  - Medium: 345 (40.5%)
  - Hard: 165 (19.4%)
- **Units:** 6 units (1-6)
- **Chapters:** 39 chapters

---

## Overall Statistics

### Total Distribution
- **Total Questions:** 2,139
- **Total Source Files:** 93
- **Average Questions per File:** ~23

### Overall Difficulty Breakdown
- **Easy:** 860 (40.2%)
- **Medium:** 851 (39.8%)
- **Hard:** 428 (20.0%)

### File Format Distribution
- **Format 1 (DS style):** 692 questions (32.4%)
  - Uses "Q1 | Difficulty: Easy" with "---" separators
- **Format 2 (SG/CCTV/CP style):** 1,447 questions (67.6%)
  - Uses "Question 1 [Easy]" without separators

---

## JSON Structure

Each question follows this structure:

```json
{
  "id": "DS-U1-C1_1-001",
  "exam": "door-supervisor",
  "unit": 1,
  "unitTitle": "Working in the Private Security Industry",
  "chapter": "1.1",
  "chapterTitle": "THE PRIVATE SECURITY INDUSTRY",
  "question": "Under which Act was the Security Industry Authority established?",
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

### ID Format
- Pattern: `{EXAM}-U{UNIT}-C{CHAPTER}-{NUMBER}`
- Example: `DS-U2-C2_10-015`
  - DS = Door Supervisor
  - U2 = Unit 2
  - C2_10 = Chapter 2.10
  - 015 = Question 15 (zero-padded)

---

## Validation Results

### Data Integrity
✅ **All IDs are unique** - No duplicates across all exams  
✅ **All questions have explanations** - 0 missing explanations  
✅ **All questions have correct answers** - 0 missing answers  
✅ **All questions have 4 options** - Complete A-D option sets  
✅ **All difficulty levels valid** - Only easy/medium/hard values  

### JSON Validation
✅ All files are valid JSON  
✅ All files are properly formatted (pretty-printed with 2-space indentation)  
✅ All string fields properly escaped  
✅ All numeric fields correctly typed  

---

## Tag Analysis

Questions are automatically tagged based on content:
- **sia** - Questions about SIA and licensing
- **legislation** - Questions about laws and acts
- **arrest** - Questions about arrest procedures
- **cctv** - CCTV-related questions
- **fire-safety** - Fire safety and emergency procedures
- **first-aid** - Medical and first aid questions
- **conflict** - Conflict management topics
- **communication** - Communication and reporting
- **rights** - Human rights and ECHR
- **discrimination** - Equality and discrimination
- **theft** - Theft-related offenses
- **assault** - Assault and violence
- **drugs** - Drugs and alcohol awareness
- **search** - Search procedures
- **licensing** - Licensing and premises
- **general** - General security topics

---

## Issues Resolved

### Challenge 1: Two Different File Formats
**Solution:** Created separate parsers (Format 1 and Format 2) that handle different question structures.

### Challenge 2: Duplicate IDs with Chapter Numbers
**Issue:** parseFloat('2.10') equals 2.1, causing ID collisions  
**Solution:** Changed chapter storage from number to string to preserve "2.10" vs "2.1"

### Challenge 3: Multi-line Explanations
**Solution:** Parser accumulates explanation text across multiple lines until hitting separator

### Challenge 4: Source Citations in Explanations
**Solution:** Filter out Wikipedia, GOV.UK, and other citation lines from explanations

---

## How to Use

### Running the Parser

```bash
node scripts/parse-questions.js
```

### Accessing the Data

```javascript
// Load questions for an exam
import ds_questions from './data/questions/door-supervisor.json';

// Load metadata
import metadata from './data/exams-metadata.json';

// Example: Get all easy questions for DS
const easyQuestions = ds_questions.filter(q => q.difficulty === 'easy');

// Example: Get all questions for Unit 2
const unit2Questions = ds_questions.filter(q => q.unit === 2);

// Example: Get question by ID
const question = ds_questions.find(q => q.id === 'DS-U1-C1_1-001');
```

---

## Parser Script Details

**Location:** `/scripts/parse-questions.js`  
**Language:** JavaScript (ES Modules)  
**Dependencies:** Node.js (built-in fs, path modules only)

### Key Functions
- `parseFilename()` - Extracts unit/chapter from filename
- `parseFormat1()` - Parses DS-style questions
- `parseFormat2()` - Parses SG/CCTV/CP-style questions
- `generateTags()` - Auto-generates topic tags
- `validateQuestions()` - Ensures data integrity

---

## Recommendations

1. **Question Review** - All questions parsed successfully, but manual review recommended for quality
2. **Tag Enhancement** - Consider adding more specific tags based on learning objectives
3. **Difficulty Calibration** - Verify difficulty levels align with actual exam difficulty
4. **Chapter Titles** - Some auto-generated unit titles may need manual adjustment
5. **Regular Updates** - Re-run parser if source question files are updated

---

## Summary

✅ Successfully parsed 2,139 questions from 93 source files  
✅ Generated unique IDs for all questions  
✅ Extracted metadata (units, chapters, titles)  
✅ Validated all output - no errors or duplicates  
✅ Created comprehensive metadata file  
✅ Pretty-printed JSON for easy reading/editing  

The question bank is now ready for integration into the web application.
