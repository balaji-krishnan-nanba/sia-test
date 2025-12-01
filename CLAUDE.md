# CLAUDE.md - AI Assistant Guide for SIA Test Prep

This document provides comprehensive guidance for AI assistants working on this codebase.

## Project Overview

**SIA Test Prep** is a React Native (Expo) mobile application designed to help UK adults prepare for the SIA (Security Industry Authority) Door Supervisor licence exam. The app features 250 practice questions covering all 11 Learning Outcomes required for the exam.

### Key Features
- Practice mode with topic selection
- Mock exam mode (72 questions, 110-minute timer)
- Flashcards for quick revision
- Progress tracking by Learning Outcome
- Dark/light mode support
- Freemium model with premium upgrade path
- Offline-first architecture

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React Native | Cross-platform mobile framework |
| Expo SDK 50 | Development tooling and native APIs |
| React Navigation 6 | Screen navigation (stack + tabs) |
| AsyncStorage | Local data persistence |
| React Context | Global state management |
| GitHub Actions | CI/CD deployment to GitHub Pages |

## Project Structure

```
sia-test/
├── CLAUDE.md              # This file
├── README.md              # Project documentation
├── .gitignore             # Git ignore rules
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Pages deployment
└── SIATestPrep/           # Main Expo app
    ├── App.js             # Entry point, navigation setup
    ├── app.json           # Expo configuration
    ├── package.json       # Dependencies and scripts
    ├── babel.config.js    # Babel configuration
    ├── assets/            # Icons, splash screens
    └── src/
        ├── context/
        │   └── AppContext.js    # Global state (theme, progress, premium)
        ├── data/
        │   ├── questions.js     # Question loader utility
        │   └── questions_lo*.json   # Question data (LO1-LO11)
        └── screens/
            ├── HomeScreen.js        # Dashboard with stats
            ├── PracticeScreen.js    # Topic selection
            ├── QuizScreen.js        # Question answering
            ├── MockExamScreen.js    # Timed exam mode
            ├── ResultsScreen.js     # Score breakdown
            ├── ReviewScreen.js      # Answer review
            ├── FlashcardsScreen.js  # Flashcard study
            ├── ProgressScreen.js    # Progress tracking
            └── SettingsScreen.js    # App settings
```

## Development Setup

### Prerequisites
- Node.js v16+
- npm or yarn
- Expo Go app on mobile device (for testing)

### Commands

```bash
# Navigate to app directory
cd SIATestPrep

# Install dependencies
npm install

# Start development server
npm start

# Platform-specific
npm run android    # Android
npm run ios        # iOS
npm run web        # Web browser

# Build for web deployment
npm run build:web
```

## Architecture Patterns

### State Management
The app uses React Context (`AppContext.js`) for global state:

```javascript
// Key state values
isDarkMode      // Theme preference
isPremium       // Premium subscription status
progress        // Question-by-question results
mockExamsCompleted
currentStreak   // Daily study streak
questionsAnswered
```

### Navigation Structure
```
Stack Navigator (root)
├── Tab Navigator (Main)
│   ├── Home
│   ├── Progress
│   ├── Flashcards
│   └── Settings
├── Practice
├── Quiz
├── MockExam
├── Results
└── Review
```

### Data Model - Questions
Each question in `questions_lo*.json` follows this structure:

```json
{
  "id": 1,
  "lo": "LO1",
  "difficulty": "Easy|Medium|Hard",
  "question": "Question text",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "answer": "A|B|C|D",
  "explanation": "Why this answer is correct",
  "memory_aid": "Mnemonic to remember",
  "flashcard_front": "Short question",
  "flashcard_back": "Short answer"
}
```

### Learning Outcomes
```
LO1  - Private Security Industry (20 questions)
LO2  - UK Legislation (30 questions)
LO3  - Communication & Customer Service (20 questions)
LO4  - Safe Working Practices (25 questions)
LO5  - Fire Procedures (22 questions)
LO6  - Emergencies & First Aid (18 questions)
LO7  - Health & Wellbeing (15 questions)
LO8  - Recognising Terrorist Activity (25 questions)
LO9  - Suspicious Behaviour (20 questions)
LO10 - Counter-terrorism (25 questions)
LO11 - Post-incident Management (30 questions)
```

## Coding Conventions

### Component Structure
```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

export default function ScreenName({ navigation }) {
  const { isDarkMode, ...otherContext } = useApp();
  const colors = getColors(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Content */}
    </View>
  );
}

function getColors(isDarkMode) {
  return {
    background: isDarkMode ? '#121212' : '#F5F5F5',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#1F2937',
    textSecondary: isDarkMode ? '#9CA3AF' : '#6B7280',
    primary: isDarkMode ? '#4A90D9' : '#2563EB',
    border: isDarkMode ? '#2C2C2C' : '#E5E7EB',
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // ... more styles
});
```

### Styling Approach
- Use `StyleSheet.create()` for static styles
- Apply dynamic colors via inline styles: `style={[styles.base, { color: colors.text }]}`
- Always support both dark and light modes
- Use the `getColors(isDarkMode)` helper pattern

### Navigation
```javascript
// Navigate to screen
navigation.navigate('ScreenName', { param: value });

// Go back
navigation.goBack();

// Access params
const { param } = route.params;
```

## Freemium Model

| Constant | Value | Purpose |
|----------|-------|---------|
| `FREE_QUESTION_LIMIT` | 30 | Questions accessible without premium |
| `FREE_MOCK_EXAM_LIMIT` | 1 | Mock exams allowed for free users |

Access control helpers:
```javascript
const { canAccessQuestion, canAccessMockExam } = useApp();

if (!canAccessQuestion(questionIndex)) {
  // Show upgrade prompt
}
```

## Deployment

### GitHub Pages (Web)
The app deploys to GitHub Pages via GitHub Actions:

1. Push to feature branch triggers workflow
2. Builds web version with `expo export --platform web`
3. Deploys to `gh-pages` branch
4. Available at: `https://[username].github.io/sia-test`

### Mobile Builds
```bash
# EAS Build (recommended)
eas build --platform android
eas build --platform ios
```

## Common Tasks

### Adding a New Question
1. Open the appropriate `src/data/questions_lo*.json` file
2. Add new question object following the schema
3. Ensure unique `id` within that LO file
4. Update question count in `LEARNING_OUTCOMES` in `AppContext.js` if needed

### Adding a New Screen
1. Create `src/screens/NewScreen.js` following component structure
2. Add to navigator in `App.js`:
   ```javascript
   <Stack.Screen name="NewScreen" component={NewScreen} />
   ```
3. Navigate to it: `navigation.navigate('NewScreen')`

### Modifying Theme Colors
Update both themes in `App.js`:
```javascript
const CustomDarkTheme = { colors: { ... } };
const CustomLightTheme = { colors: { ... } };
```
And the `getColors()` function in each screen.

### Adding New State
1. Add state variable in `AppContext.js`
2. Add to `saveState()` and `loadSavedState()` for persistence
3. Export via context `value` object
4. Use via `useApp()` hook in components

## Testing Considerations

- Test both dark and light modes
- Verify free tier limits are enforced
- Test AsyncStorage persistence (quit and reopen app)
- Test mock exam timer behavior
- Verify progress tracking accuracy

## Important Notes

### Content Accuracy
This is an unofficial study aid. Question content should be verified against official SIA training materials. Key facts:
- SIA licence validity: 3 years
- Unlicensed work penalty: £5,000 fine + 6 months prison
- Exam: 72 questions, 110 minutes, 70% pass mark

### Platform Differences
- Web uses `react-native-web` - some features may behave differently
- AsyncStorage works across platforms but has different underlying implementations
- Navigation gestures vary by platform

### Performance
- Questions are loaded from JSON files (already bundled)
- AsyncStorage is used for progress persistence
- No network requests required for core functionality (offline-first)

## Git Workflow

- Main development happens on feature branches (`claude/*`)
- Push to feature branch triggers GitHub Pages deployment
- Main branch contains stable releases
- All commits should include clear, descriptive messages
