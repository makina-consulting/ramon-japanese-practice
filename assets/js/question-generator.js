// Question generation logic
import { config } from './config.js';
import { state } from './state.js';
import { filterVocabularyByLessons, filterVocabularyByCategories } from './data-manager.js';

export function generateQuestions() {
    // Filter vocabulary based on selected lessons or categories
    let filteredVocab;
    
    if (state.filterMode === 'lessons' && state.selectedLessons.length > 0) {
        filteredVocab = filterVocabularyByLessons(state.selectedLessons);
    } else if (state.filterMode === 'categories' && state.selectedCategories.length > 0) {
        filteredVocab = filterVocabularyByCategories(state.selectedCategories);
    } else {
        filteredVocab = state.vocabulary;
    }
    
    // If in conjugation mode, filter for only verbs and adjectives
    if (state.quizMode === 'conjugation') {
        filteredVocab = filteredVocab.filter(word => isVerbOrAdjective(word.category));
    }
    
    if (filteredVocab.length === 0) {
        console.error('No vocabulary available for selected filters');
        return [];
    }
    
    // Shuffle and select questions
    const shuffled = shuffleArray([...filteredVocab]);
    const numQuestions = Math.min(config.totalQuestions, shuffled.length);
    return shuffled.slice(0, numQuestions);
}

/**
 * Check if a category is a verb or adjective
 * @param {string} category - The category to check
 * @returns {boolean} True if the category is a verb or adjective
 */
function isVerbOrAdjective(category) {
    if (!category) return false;
    
    const lowerCategory = category.toLowerCase();
    
    // Exclude adverbs
    if (lowerCategory.includes('adverb')) return false;
    
    // Include verbs and adjectives
    return lowerCategory.includes('verb') || 
           lowerCategory.includes('adjective') ||
           lowerCategory === 'irregular verbs';
}

/**
 * Generate answer options based on quiz direction
 * @param {Object} correctWord - The correct vocabulary word object
 * @param {Array} allWords - All available vocabulary words
 * @param {string} answerType - 'english' or 'japanese'
 * @returns {Array} Array of answer option objects
 */
export function generateAnswerOptions(correctWord, allWords, answerType = 'english') {
    const options = [];
    const usedAnswers = new Set();
    
    // Add correct answer
    if (answerType === 'english') {
        options.push({
            text: correctWord.english,
            isCorrect: true
        });
        usedAnswers.add(correctWord.english);
    } else {
        // For Japanese, prefer kanji if available
        const correctAnswer = correctWord.kanji || correctWord.hiragana;
        options.push({
            text: correctAnswer,
            isCorrect: true
        });
        usedAnswers.add(correctAnswer);
    }
    
    // Filter out the correct word
    const availableWords = allWords.filter(w => {
        if (answerType === 'english') {
            return w.english !== correctWord.english;
        } else {
            const wordAnswer = w.kanji || w.hiragana;
            const correctAnswer = correctWord.kanji || correctWord.hiragana;
            return wordAnswer !== correctAnswer;
        }
    });
    
    // Get 3 random wrong answers
    const shuffled = shuffleArray(availableWords);
    let wrongAnswersAdded = 0;
    
    for (const word of shuffled) {
        if (wrongAnswersAdded >= 3) break;
        
        let answerText;
        if (answerType === 'english') {
            answerText = word.english;
        } else {
            answerText = word.kanji || word.hiragana;
        }
        
        // Avoid duplicates
        if (!usedAnswers.has(answerText)) {
            options.push({
                text: answerText,
                isCorrect: false
            });
            usedAnswers.add(answerText);
            wrongAnswersAdded++;
        }
    }
    
    // Shuffle the options
    return shuffleArray(options);
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export function getFilteredVocabCount() {
    let filteredVocab;
    
    if (state.filterMode === 'lessons' && state.selectedLessons.length > 0) {
        filteredVocab = filterVocabularyByLessons(state.selectedLessons);
    } else if (state.filterMode === 'categories' && state.selectedCategories.length > 0) {
        filteredVocab = filterVocabularyByCategories(state.selectedCategories);
    } else {
        filteredVocab = state.vocabulary;
    }
    
    // If in conjugation mode, filter for only verbs and adjectives
    if (state.quizMode === 'conjugation') {
        filteredVocab = filteredVocab.filter(word => isVerbOrAdjective(word.category));
    }
    
    return filteredVocab.length;
}
