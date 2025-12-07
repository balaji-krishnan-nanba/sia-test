#!/usr/bin/env node

/**
 * SIA Exam Questions Parser
 *
 * This script parses all SIA exam question files from the Questions/ folder
 * and converts them to structured JSON format for the web application.
 *
 * Supports two formats:
 * - Format 1 (DS): "Q1 | Difficulty: Easy" with "---" separators
 * - Format 2 (SG/CCTV/CP): "Question 1 [Easy]" without separators
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_DIR = path.join(__dirname, '..');
const QUESTIONS_DIR = path.join(BASE_DIR, 'Questions');
const OUTPUT_DIR = path.join(BASE_DIR, 'data', 'questions');

const EXAM_CONFIGS = [
  {
    name: 'door-supervisor',
    code: 'DS',
    folder: 'SIA-DS-MCQs-Refined',
    title: 'Door Supervisor',
    format: 1 // Format 1: "Q1 | Difficulty: Easy"
  },
  {
    name: 'security-guard',
    code: 'SG',
    folder: 'SIA-SG-MCQs-Refined',
    title: 'Security Guard',
    format: 2 // Format 2: "Question 1 [Easy]"
  },
  {
    name: 'cctv-operator',
    code: 'CCTV',
    folder: 'SIA-CCTV-MCQs-Refined',
    title: 'CCTV Operator',
    format: 2
  },
  {
    name: 'close-protection',
    code: 'CP',
    folder: 'SIA-CP-MCQs-Refined',
    title: 'Close Protection',
    format: 2
  }
];

// Statistics tracking
const stats = {
  totalQuestions: 0,
  byExam: {},
  byDifficulty: { easy: 0, medium: 0, hard: 0 },
  errors: [],
  warnings: []
};

/**
 * Parse filename to extract unit and chapter information
 */
function parseFilename(filename) {
  // Examples:
  // SIA_Unit2_Chapter2.1-role-objectives.txt
  // SIA_Unit2_Chapter2.10-queue-management.txt
  // unit1-chapter-1.1-private-security-industry.txt

  const match = filename.match(/unit(\d+).*?chapter[_-]?(\d+\.\d+)[_-](.+)\.txt/i);

  if (match) {
    return {
      unit: parseInt(match[1]),
      chapter: match[2], // Keep as string to preserve "2.10" vs "2.1"
      chapterSlug: match[3]
    };
  }

  // Fallback pattern
  const simpleMatch = filename.match(/unit(\d+)/i);
  if (simpleMatch) {
    return {
      unit: parseInt(simpleMatch[1]),
      chapter: '1.0',
      chapterSlug: 'unknown'
    };
  }

  return { unit: 0, chapter: '0.0', chapterSlug: 'unknown' };
}

/**
 * Extract chapter title from file content
 */
function extractChapterTitle(content) {
  const lines = content.split('\n');
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    // Look for patterns like "UNIT 2, CHAPTER 2.1: ROLE AND OBJECTIVES"
    const match = line.match(/UNIT\s+\d+,\s+CHAPTER\s+[\d.]+:\s*(.+)/i);
    if (match) {
      return match[1].trim();
    }
  }
  return '';
}

/**
 * Extract unit title from content or generate from chapter title
 */
function extractUnitTitle(content, unit) {
  // Common unit titles based on SIA structure
  const commonUnitTitles = {
    1: 'Working in the Private Security Industry',
    2: 'Specialist Role and Responsibilities',
    3: 'Conflict Management',
    4: 'Physical Intervention',
    5: 'Advanced Operations',
    6: 'Operational Planning and Tactics'
  };

  return commonUnitTitles[unit] || `Unit ${unit}`;
}

/**
 * Parse questions using Format 1 (DS style: "Q1 | Difficulty: Easy")
 */
function parseFormat1(content, examCode, fileInfo) {
  const questions = [];
  const lines = content.split('\n');

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    // Look for question header like "Q1 | Difficulty: Easy"
    const headerMatch = line.match(/^Q(\d+)\s*\|\s*Difficulty:\s*(Easy|Medium|Hard)/i);

    if (headerMatch) {
      const questionNumber = parseInt(headerMatch[1]);
      const difficulty = headerMatch[2].toLowerCase();

      // Find the next separator line (---) and then look for "Question:"
      i++;
      while (i < lines.length && !lines[i].trim().match(/^---+$/)) {
        i++;
      }
      i++; // Skip the --- line

      // Now find the question text
      let questionText = '';
      let questionLineIdx = -1;

      while (i < lines.length) {
        const currentLine = lines[i].trim();

        if (currentLine.startsWith('Question:')) {
          questionText = currentLine.substring('Question:'.length).trim();
          questionLineIdx = i;
          i++;
          break;
        }
        i++;
      }

      if (!questionText) {
        stats.warnings.push(`No question text found in ${fileInfo.filename} Q${questionNumber}`);
        continue;
      }

      // Skip blank line after question
      while (i < lines.length && !lines[i].trim()) {
        i++;
      }

      // Extract options (A, B, C, D)
      const options = {};

      while (i < lines.length) {
        const currentLine = lines[i].trim();

        const optMatch = currentLine.match(/^([A-D])\)\s*(.+)/);
        if (optMatch) {
          options[optMatch[1]] = optMatch[2].trim();
          i++;
        } else if (currentLine.startsWith('Answer:')) {
          break;
        } else {
          i++;
        }
      }

      // Extract answer
      let correctAnswer = '';
      if (i < lines.length && lines[i].trim().startsWith('Answer:')) {
        correctAnswer = lines[i].trim().substring('Answer:'.length).trim();
        i++;
      }

      // Extract explanation
      let explanation = '';
      if (i < lines.length && lines[i].trim().startsWith('Explanation:')) {
        explanation = lines[i].trim().substring('Explanation:'.length).trim();
        i++;

        // Continue collecting explanation until we hit --- or end
        while (i < lines.length) {
          const currentLine = lines[i].trim();
          if (currentLine.match(/^---+$/) || currentLine.match(/^={3,}$/)) {
            break;
          }
          if (currentLine) {
            explanation += ' ' + currentLine;
          }
          i++;
        }
      }

      // Validate
      if (!correctAnswer || Object.keys(options).length < 4) {
        stats.warnings.push(`Incomplete question data in ${fileInfo.filename} Q${questionNumber}`);
        continue;
      }

      // Generate unique ID
      const chapterStr = fileInfo.chapter.toString().replace('.', '_');
      const id = `${examCode}-U${fileInfo.unit}-C${chapterStr}-${String(questionNumber).padStart(3, '0')}`;

      questions.push({
        id,
        exam: examCode.toLowerCase(),
        unit: fileInfo.unit,
        unitTitle: fileInfo.unitTitle,
        chapter: fileInfo.chapter,
        chapterTitle: fileInfo.chapterTitle,
        question: questionText,
        options,
        correctAnswer,
        explanation: explanation.trim(),
        difficulty,
        tags: generateTags(questionText, fileInfo.chapterTitle)
      });
    } else {
      i++;
    }
  }

  return questions;
}

/**
 * Parse questions using Format 2 (SG/CCTV/CP style: "Question 1 [Easy]")
 */
function parseFormat2(content, examCode, fileInfo) {
  const questions = [];
  const lines = content.split('\n');

  let currentQuestion = null;
  let currentSection = null; // 'question', 'options', 'answer', 'explanation'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Match question header: "Question 1 [Easy]"
    const qMatch = line.match(/^Question\s+(\d+)\s+\[(Easy|Medium|Hard)\]/i);
    if (qMatch) {
      // Save previous question
      if (currentQuestion && currentQuestion.question) {
        questions.push(currentQuestion);
      }

      const questionNum = parseInt(qMatch[1]);
      const difficulty = qMatch[2].toLowerCase();
      const chapterStr = fileInfo.chapter.toString().replace('.', '_');
      const id = `${examCode}-U${fileInfo.unit}-C${chapterStr}-${String(questionNum).padStart(3, '0')}`;

      currentQuestion = {
        id,
        exam: examCode.toLowerCase(),
        unit: fileInfo.unit,
        unitTitle: fileInfo.unitTitle,
        chapter: fileInfo.chapter,
        chapterTitle: fileInfo.chapterTitle,
        question: '',
        options: {},
        correctAnswer: '',
        explanation: '',
        difficulty,
        tags: []
      };
      currentSection = 'question';
      continue;
    }

    if (!currentQuestion) continue;

    // Match options: "A) Option text"
    const optMatch = line.match(/^([A-D])\)\s*(.+)/);
    if (optMatch) {
      currentQuestion.options[optMatch[1]] = optMatch[2].trim();
      currentSection = 'options';
      continue;
    }

    // Match correct answer: "Correct Answer: B"
    const ansMatch = line.match(/^Correct\s+Answer:\s*([A-D])/i);
    if (ansMatch) {
      currentQuestion.correctAnswer = ansMatch[1];
      currentSection = 'answer';
      continue;
    }

    // Match explanation header
    if (line.match(/^Explanation:/i)) {
      currentSection = 'explanation';
      const expText = line.substring(line.indexOf(':') + 1).trim();
      if (expText) {
        currentQuestion.explanation = expText;
      }
      continue;
    }

    // Accumulate text based on current section
    if (line && !line.match(/^={3,}/) && !line.match(/^Total Questions:/i)) {
      if (currentSection === 'question' && !currentQuestion.question) {
        currentQuestion.question = line;
      } else if (currentSection === 'question' && currentQuestion.question && !Object.keys(currentQuestion.options).length) {
        currentQuestion.question += ' ' + line;
      } else if (currentSection === 'explanation' && line) {
        // Skip source citations and metadata
        if (!line.match(/^(Wikipedia|GOV\.UK|Legislation\.gov\.uk|equalityhumanrights\.com|FRA|LawTeacher\.net)/i) &&
            !line.match(/^\+\d+$/)) {
          currentQuestion.explanation += (currentQuestion.explanation ? ' ' : '') + line;
        }
      }
    }
  }

  // Save last question
  if (currentQuestion && currentQuestion.question) {
    questions.push(currentQuestion);
  }

  // Generate tags for all questions
  questions.forEach(q => {
    q.tags = generateTags(q.question, fileInfo.chapterTitle);
  });

  return questions;
}

/**
 * Generate tags based on question content and chapter
 */
function generateTags(questionText, chapterTitle) {
  const tags = [];
  const text = (questionText + ' ' + chapterTitle).toLowerCase();

  // Common topics
  const topicMap = {
    'sia': ['sia', 'security industry authority'],
    'legislation': ['act', 'law', 'legislation', 'statute'],
    'arrest': ['arrest', 'detain', 'detention'],
    'cctv': ['cctv', 'camera', 'surveillance'],
    'fire-safety': ['fire', 'evacuation', 'emergency exit'],
    'first-aid': ['first aid', 'medical', 'casualty'],
    'conflict': ['conflict', 'de-escalation', 'aggression'],
    'communication': ['communication', 'radio', 'report'],
    'rights': ['human rights', 'article', 'echr'],
    'discrimination': ['equality', 'discrimination', 'protected characteristic'],
    'theft': ['theft', 'shoplifting', 'steal'],
    'assault': ['assault', 'violence', 'attack'],
    'drugs': ['drugs', 'alcohol', 'intoxication'],
    'search': ['search', 'searching'],
    'licensing': ['licence', 'licensing', 'premises']
  };

  for (const [tag, keywords] of Object.entries(topicMap)) {
    if (keywords.some(kw => text.includes(kw))) {
      tags.push(tag);
    }
  }

  return tags.length > 0 ? tags : ['general'];
}

/**
 * Process a single question file
 */
function processFile(filepath, examConfig) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const filename = path.basename(filepath);
    const fileInfo = parseFilename(filename);

    fileInfo.filename = filename;
    fileInfo.chapterTitle = extractChapterTitle(content);
    fileInfo.unitTitle = extractUnitTitle(content, fileInfo.unit);

    let questions;
    if (examConfig.format === 1) {
      questions = parseFormat1(content, examConfig.code, fileInfo);
    } else {
      questions = parseFormat2(content, examConfig.code, fileInfo);
    }

    return questions;
  } catch (error) {
    stats.errors.push(`Error processing ${filepath}: ${error.message}`);
    return [];
  }
}

/**
 * Get all .txt files from a directory recursively
 */
function getQuestionFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.txt')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

/**
 * Process all questions for an exam
 */
function processExam(examConfig) {
  console.log(`\nProcessing ${examConfig.title} (${examConfig.code})...`);

  const examDir = path.join(QUESTIONS_DIR, examConfig.folder);

  if (!fs.existsSync(examDir)) {
    console.error(`  Error: Directory not found: ${examDir}`);
    return [];
  }

  const files = getQuestionFiles(examDir);
  console.log(`  Found ${files.length} question files`);

  const allQuestions = [];

  for (const file of files) {
    const questions = processFile(file, examConfig);
    allQuestions.push(...questions);
  }

  console.log(`  Parsed ${allQuestions.length} questions`);

  // Track statistics
  stats.byExam[examConfig.code] = {
    total: allQuestions.length,
    easy: allQuestions.filter(q => q.difficulty === 'easy').length,
    medium: allQuestions.filter(q => q.difficulty === 'medium').length,
    hard: allQuestions.filter(q => q.difficulty === 'hard').length
  };

  stats.totalQuestions += allQuestions.length;
  stats.byDifficulty.easy += stats.byExam[examConfig.code].easy;
  stats.byDifficulty.medium += stats.byExam[examConfig.code].medium;
  stats.byDifficulty.hard += stats.byExam[examConfig.code].hard;

  return allQuestions;
}

/**
 * Validate questions
 */
function validateQuestions(questions, examCode) {
  const issues = [];
  const ids = new Set();

  for (const q of questions) {
    // Check for duplicate IDs
    if (ids.has(q.id)) {
      issues.push(`Duplicate ID: ${q.id}`);
    }
    ids.add(q.id);

    // Check required fields
    if (!q.question) issues.push(`${q.id}: Missing question text`);
    if (!q.correctAnswer) issues.push(`${q.id}: Missing correct answer`);
    if (!q.explanation) issues.push(`${q.id}: Missing explanation`);
    if (Object.keys(q.options).length < 4) issues.push(`${q.id}: Less than 4 options`);
    if (!['easy', 'medium', 'hard'].includes(q.difficulty)) {
      issues.push(`${q.id}: Invalid difficulty: ${q.difficulty}`);
    }
    if (!q.options[q.correctAnswer]) {
      issues.push(`${q.id}: Correct answer ${q.correctAnswer} not in options`);
    }
  }

  if (issues.length > 0) {
    console.log(`  Validation issues for ${examCode}:`);
    issues.forEach(issue => console.log(`    - ${issue}`));
    stats.warnings.push(...issues);
  } else {
    console.log(`  Validation passed: All questions valid`);
  }

  return issues.length === 0;
}

/**
 * Generate metadata file
 */
function generateMetadata() {
  const metadata = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    exams: EXAM_CONFIGS.map(config => {
      const examStats = stats.byExam[config.code] || {};

      return {
        id: config.name,
        code: config.code,
        title: config.title,
        totalQuestions: examStats.total || 0,
        difficulty: {
          easy: examStats.easy || 0,
          medium: examStats.medium || 0,
          hard: examStats.hard || 0
        }
      };
    }),
    totalQuestions: stats.totalQuestions,
    overallDifficulty: stats.byDifficulty
  };

  return metadata;
}

/**
 * Main execution
 */
function main() {
  console.log('='.repeat(80));
  console.log('SIA Exam Questions Parser');
  console.log('='.repeat(80));

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }

  // Process each exam
  for (const examConfig of EXAM_CONFIGS) {
    const questions = processExam(examConfig);

    // Validate
    validateQuestions(questions, examConfig.code);

    // Write to file
    const outputFile = path.join(OUTPUT_DIR, `${examConfig.name}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(questions, null, 2), 'utf8');
    console.log(`  Written to: ${outputFile}`);
  }

  // Generate and write metadata
  console.log('\nGenerating metadata...');
  const metadata = generateMetadata();
  const metadataFile = path.join(BASE_DIR, 'data', 'exams-metadata.json');
  fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2), 'utf8');
  console.log(`  Written to: ${metadataFile}`);

  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total questions parsed: ${stats.totalQuestions}`);
  console.log(`\nBy exam:`);
  for (const [code, examStats] of Object.entries(stats.byExam)) {
    console.log(`  ${code}: ${examStats.total} (Easy: ${examStats.easy}, Medium: ${examStats.medium}, Hard: ${examStats.hard})`);
  }
  console.log(`\nOverall difficulty:`);
  console.log(`  Easy: ${stats.byDifficulty.easy}`);
  console.log(`  Medium: ${stats.byDifficulty.medium}`);
  console.log(`  Hard: ${stats.byDifficulty.hard}`);

  if (stats.warnings.length > 0) {
    console.log(`\nWarnings: ${stats.warnings.length}`);
    if (stats.warnings.length <= 10) {
      stats.warnings.forEach(w => console.log(`  - ${w}`));
    } else {
      console.log(`  (First 10 shown)`);
      stats.warnings.slice(0, 10).forEach(w => console.log(`  - ${w}`));
    }
  }

  if (stats.errors.length > 0) {
    console.log(`\nErrors: ${stats.errors.length}`);
    stats.errors.forEach(e => console.log(`  - ${e}`));
  }

  console.log('\n' + '='.repeat(80));
  console.log('Parse complete!');
  console.log('='.repeat(80));
}

// Run the parser
main();
