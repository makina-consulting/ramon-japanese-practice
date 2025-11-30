// State Manager - Centralized application state
let state = {
    vocabulary: [],
    filteredVocabulary: [],
    selectedLessons: [],
    selectedCategories: [],
    currentQuestion: null,
    currentAnswers: [],
    correctAnswer: null,
    score: 0,
    questionNumber: 0,
    totalQuestions: 10,
    quizActive: false,
    quizMode: 'normal', // 'normal' or 'conjugation'
    // For conjugation mode
    conjugationForm: null, // e.g., "polite present affirmative"
    conjugationFormDisplay: null // e.g., "Polite Present Affirmative"
};

export function getState() {
    return state;
}

export function setState(updates) {
    state = { ...state, ...updates };
}

export function setVocabulary(vocabulary) {
    state.vocabulary = vocabulary;
    state.filteredVocabulary = vocabulary;
}

export function setFilteredVocabulary(filtered) {
    state.filteredVocabulary = filtered;
}

export function setSelectedLessons(lessons) {
    state.selectedLessons = lessons;
}

export function setSelectedCategories(categories) {
    state.selectedCategories = categories;
}

export function incrementScore() {
    state.score++;
}

export function incrementQuestionNumber() {
    state.questionNumber++;
}

export function resetStats() {
    state.score = 0;
    state.questionNumber = 0;
    state.quizActive = false;
    state.currentQuestion = null;
    state.currentAnswers = [];
    state.correctAnswer = null;
    state.conjugationForm = null;
    state.conjugationFormDisplay = null;
}

export function setQuizMode(mode) {
    state.quizMode = mode;
}

export function setConjugationInfo(form, display) {
    state.conjugationForm = form;
    state.conjugationFormDisplay = display;
}
