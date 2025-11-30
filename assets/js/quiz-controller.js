// Quiz Controller - Main quiz logic
import { filterConjugatable } from './data-manager.js';
import { getState, setState, incrementScore, incrementQuestionNumber, resetStats, setQuizMode, setConjugationInfo } from './state.js';
import { updateDisplay, showResult } from './ui.js';
import { settingsManager } from './settings.js';

export function initQuiz() {
    const state = getState();
    
    if (state.filteredVocabulary.length === 0) {
        alert('No vocabulary available. Please adjust your filters.');
        return;
    }
    
    resetStats();
    setQuizMode('normal');
    setState({ quizActive: true });
    nextQuestion();
}

export function initConjugationQuiz() {
    const state = getState();
    
    // Filter for only conjugatable words
    const conjugatableWords = filterConjugatable(state.filteredVocabulary);
    
    if (conjugatableWords.length === 0) {
        alert('No verbs or adjectives available. Please adjust your filters.');
        return;
    }
    
    resetStats();
    setQuizMode('conjugation');
    setState({ 
        quizActive: true,
        filteredVocabulary: conjugatableWords 
    });
    nextConjugationQuestion();
}

export function nextQuestion() {
    const state = getState();
    
    if (state.questionNumber >= state.totalQuestions) {
        endQuiz();
        return;
    }
    
    incrementQuestionNumber();
    
    // Select random word
    const randomIndex = Math.floor(Math.random() * state.filteredVocabulary.length);
    const word = state.filteredVocabulary[randomIndex];
    
    // Determine question and answer based on quiz direction
    const direction = settingsManager.getQuizDirection();
    let questionText, correctAnswer;
    
    if (direction === 'ja-en') {
        // Question in Japanese, answer in English
        questionText = word.kanji || word.hiragana;
        correctAnswer = word.english;
    } else {
        // Question in English, answer in Japanese
        questionText = word.english;
        correctAnswer = word.kanji || word.hiragana;
    }
    
    // Generate answer options
    const answers = generateAnswers(word, direction);
    
    setState({
        currentQuestion: questionText,
        currentAnswers: answers,
        correctAnswer: correctAnswer
    });
    
    updateDisplay();
}

export function nextConjugationQuestion() {
    const state = getState();
    
    if (state.questionNumber >= state.totalQuestions) {
        endQuiz();
        return;
    }
    
    incrementQuestionNumber();
    
    // Select random word
    const randomIndex = Math.floor(Math.random() * state.filteredVocabulary.length);
    const word = state.filteredVocabulary[randomIndex];
    
    // Select random conjugation form
    const { form, displayName, answer } = selectRandomConjugation(word);
    
    setConjugationInfo(form, displayName);
    
    // Question shows the base form and asks for conjugation
    const questionText = `${word.hiragana} (${word.english})`;
    
    // Generate answer options for this conjugation
    const answers = generateConjugationAnswers(word, form, answer);
    
    setState({
        currentQuestion: questionText,
        currentAnswers: answers,
        correctAnswer: answer
    });
    
    updateDisplay();
}

function selectRandomConjugation(word) {
    const conjugations = word.conjugations;
    const possibleForms = [];
    
    // Collect all possible conjugation forms
    if (word.wordType === 'u-verb' || word.wordType === 'ru-verb' || word.wordType === 'irregular-verb') {
        // Verb conjugations
        possibleForms.push(
            { form: 'polite-present-affirmative', displayName: 'Polite Present (+)', answer: conjugations.polite.present.affirmative },
            { form: 'polite-present-negative', displayName: 'Polite Present (−)', answer: conjugations.polite.present.negative },
            { form: 'polite-past-affirmative', displayName: 'Polite Past (+)', answer: conjugations.polite.past.affirmative },
            { form: 'polite-past-negative', displayName: 'Polite Past (−)', answer: conjugations.polite.past.negative },
            { form: 'plain-present-affirmative', displayName: 'Plain Present (+)', answer: conjugations.plain.present.affirmative },
            { form: 'plain-present-negative', displayName: 'Plain Present (−)', answer: conjugations.plain.present.negative },
            { form: 'plain-past-affirmative', displayName: 'Plain Past (+)', answer: conjugations.plain.past.affirmative },
            { form: 'plain-past-negative', displayName: 'Plain Past (−)', answer: conjugations.plain.past.negative }
        );
        
        if (conjugations.te_form) {
            possibleForms.push({ form: 'te-form', displayName: 'Te-form', answer: conjugations.te_form });
        }
    } else if (word.wordType === 'i-adjective' || word.wordType === 'na-adjective') {
        // Adjective conjugations
        possibleForms.push(
            { form: 'polite-present-affirmative', displayName: 'Polite Present (+)', answer: conjugations.polite.present.affirmative },
            { form: 'polite-present-negative', displayName: 'Polite Present (−)', answer: getNegativeForm(conjugations.polite.present.negative) },
            { form: 'polite-past-affirmative', displayName: 'Polite Past (+)', answer: conjugations.polite.past.affirmative },
            { form: 'polite-past-negative', displayName: 'Polite Past (−)', answer: getNegativeForm(conjugations.polite.past.negative) },
            { form: 'plain-present-affirmative', displayName: 'Plain Present (+)', answer: conjugations.plain.present.affirmative },
            { form: 'plain-present-negative', displayName: 'Plain Present (−)', answer: getNegativeForm(conjugations.plain.present.negative) },
            { form: 'plain-past-affirmative', displayName: 'Plain Past (+)', answer: conjugations.plain.past.affirmative },
            { form: 'plain-past-negative', displayName: 'Plain Past (−)', answer: getNegativeForm(conjugations.plain.past.negative) }
        );
        
        if (conjugations.adverb) {
            possibleForms.push({ form: 'adverb', displayName: 'Adverb Form', answer: conjugations.adverb });
        }
    }
    
    // Select random form
    const randomIndex = Math.floor(Math.random() * possibleForms.length);
    return possibleForms[randomIndex];
}

// Helper function to handle multiple negative forms
function getNegativeForm(negativeText) {
    if (typeof negativeText === 'string' && negativeText.includes('/')) {
        // Return the first form (most common)
        return negativeText.split('/')[0].trim();
    }
    return negativeText;
}

function generateAnswers(word, direction) {
    const state = getState();
    const answers = [];
    
    if (direction === 'ja-en') {
        answers.push(word.english);
    } else {
        answers.push(word.kanji || word.hiragana);
    }
    
    // Add 3 random wrong answers
    const usedAnswers = new Set(answers);
    while (answers.length < 4 && state.filteredVocabulary.length >= 4) {
        const randomWord = state.filteredVocabulary[Math.floor(Math.random() * state.filteredVocabulary.length)];
        const answer = direction === 'ja-en' ? randomWord.english : (randomWord.kanji || randomWord.hiragana);
        
        if (!usedAnswers.has(answer)) {
            answers.push(answer);
            usedAnswers.add(answer);
        }
    }
    
    // Shuffle answers
    return shuffleArray(answers);
}

function generateConjugationAnswers(word, form, correctAnswer) {
    const state = getState();
    const answers = [correctAnswer];
    const usedAnswers = new Set([correctAnswer]);
    
    // Try to get wrong answers from the same word's other conjugations
    if (word.conjugations) {
        const allConjugations = collectAllConjugations(word.conjugations);
        for (const conj of allConjugations) {
            if (answers.length >= 4) break;
            if (!usedAnswers.has(conj)) {
                answers.push(conj);
                usedAnswers.add(conj);
            }
        }
    }
    
    // If we need more answers, get from other similar words
    while (answers.length < 4) {
        const randomWord = state.filteredVocabulary[Math.floor(Math.random() * state.filteredVocabulary.length)];
        if (randomWord.conjugations) {
            const randomConj = getRandomConjugationValue(randomWord.conjugations);
            if (randomConj && !usedAnswers.has(randomConj)) {
                answers.push(randomConj);
                usedAnswers.add(randomConj);
            }
        }
    }
    
    return shuffleArray(answers);
}

function collectAllConjugations(conjugations) {
    const all = [];
    
    if (conjugations.polite) {
        if (conjugations.polite.present) {
            all.push(conjugations.polite.present.affirmative);
            all.push(getNegativeForm(conjugations.polite.present.negative));
        }
        if (conjugations.polite.past) {
            all.push(conjugations.polite.past.affirmative);
            all.push(getNegativeForm(conjugations.polite.past.negative));
        }
    }
    
    if (conjugations.plain) {
        if (conjugations.plain.present) {
            all.push(conjugations.plain.present.affirmative);
            all.push(getNegativeForm(conjugations.plain.present.negative));
        }
        if (conjugations.plain.past) {
            all.push(conjugations.plain.past.affirmative);
            all.push(getNegativeForm(conjugations.plain.past.negative));
        }
    }
    
    if (conjugations.te_form) all.push(conjugations.te_form);
    if (conjugations.adverb) all.push(conjugations.adverb);
    
    return all;
}

function getRandomConjugationValue(conjugations) {
    const all = collectAllConjugations(conjugations);
    return all.length > 0 ? all[Math.floor(Math.random() * all.length)] : null;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function checkAnswer(selectedAnswer) {
    const state = getState();
    const isCorrect = selectedAnswer === state.correctAnswer;
    
    if (isCorrect) {
        incrementScore();
    }
    
    showResult(isCorrect, state.correctAnswer);
    
    // Move to next question after delay
    setTimeout(() => {
        if (state.quizMode === 'conjugation') {
            nextConjugationQuestion();
        } else {
            nextQuestion();
        }
    }, 1500);
}

function endQuiz() {
    const state = getState();
    setState({ quizActive: false });
    
    const percentage = Math.round((state.score / state.totalQuestions) * 100);
    const message = `Quiz Complete!\n\nScore: ${state.score}/${state.totalQuestions} (${percentage}%)\n\nClick "Start Quiz" to try again!`;
    
    setState({
        currentQuestion: message,
        currentAnswers: [],
        correctAnswer: null
    });
    
    updateDisplay();
}

export function resetQuiz() {
    resetStats();
    setState({
        currentQuestion: 'Click "Start Quiz" to begin!',
        currentAnswers: [],
        correctAnswer: null
    });
    updateDisplay();
}
