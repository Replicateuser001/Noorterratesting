# Noorterra Language Testing Workflow

## Overview
Noorterra implements an AI-powered language skill testing system that generates, administers, and evaluates tests dynamically. The workflow consists of four main phases: Skill Selection, Test Generation, Test Administration, and Result Management.

## 1. Skill Selection
### Process
1. User selects a language (currently English)
2. System presents available skill categories (e.g., Grammar, Vocabulary)
3. User chooses specific skills to test (e.g., Present Simple, Past Simple)

### Technical Implementation
- Skills are defined in `src/data/languages.ts`
- Each skill contains:
  - Name
  - Description
  - Test pattern templates
  - Category

## 2. Test Generation
### Process
1. Selected skill is passed to the Gemini AI service
2. AI generates questions based on predefined templates
3. Questions are validated and formatted

### Technical Implementation (`src/lib/gemini.ts`)
- Uses Google's Gemini AI model
- Generation parameters:
  - Temperature: 0.9 (for response variety)
  - Max tokens: 2048
- Question format:
  ```
  Template: [Template pattern]
  Question: [Question with [answer] in brackets]
  A) Option 1
  B) Option 2
  C) Option 3
  D) Option 4
  ```
- Validation ensures:
  - Exactly 4 options per question
  - Correct answer in brackets
  - Answer exists in options

## 3. Test Administration
### Process
1. Questions are presented one at a time
2. User selects from multiple choice options
3. Progress is tracked throughout the test

### Technical Implementation (`src/components/TestInterface.tsx`)
- Manages test state:
  - Current question index
  - Selected answers
  - Test progress
- Features:
  - Question formatting (replaces [answer] with ___)
  - Option selection handling
  - Progress indication

## 4. Result Management
### Process
1. Test completion triggers evaluation
2. Results are calculated and displayed
3. Results are stored in test history
4. Performance analytics are generated

### Technical Implementation
#### Evaluation (`TestInterface.tsx`)
- Calculates:
  - Overall score
  - Per-skill performance
  - Correct/incorrect answers

#### Storage (`TestHistory.tsx`)
- Results stored in localStorage
- Data structure:
  ```typescript
  {
    date: string;
    language: string;
    skills: string[];
    score: number;
    questions: {
      question: string;
      selectedAnswer: number;
      correctAnswer: number;
      skill: string;
    }[];
  }
  ```

#### History Display
- Shows recent tests first
- Expandable test details
- Performance analytics per skill

## Error Handling
- Question generation failures
  - Retry mechanism
  - Fallback templates
- Invalid AI responses
  - Format validation
  - Response cleanup
- Storage failures
  - Local storage checks
  - Error recovery

## Future Enhancements
- Additional question types
- More granular skill categories
- Advanced analytics
- User progress tracking
- Difficulty levels
- Comprehensive error handling
- Extended test pattern templates

## Technical Dependencies
- Google Generative AI (@google/generative-ai)
- React
- TypeScript
- localStorage API

## Security Considerations
- API key management through environment variables
- Client-side evaluation
- No sensitive data storage
