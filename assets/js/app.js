// Main application entry point
import { loadVocabulary } from './data-manager.js';
import { setVocabulary } from './state.js';
import { initUI, updateDisplay } from './ui.js';
import { initQuiz, initConjugationQuiz, resetQuiz } from './quiz-controller.js';
import { settingsManager, openSettingsModal } from './settings.js';

async function init() {
    console.log('Initializing Japanese Quiz App...');
    
    // Load vocabulary
    const vocabulary = await loadVocabulary();
    
    if (vocabulary.length === 0) {
        alert('Failed to load vocabulary data. Please check the vocab.json file.');
        return;
    }
    
    setVocabulary(vocabulary);
    
    // Initialize UI
    initUI();
    updateDisplay();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('App initialized successfully!');
    console.log('Current quiz direction:', settingsManager.getQuizDirection());
}

function setupEventListeners() {
    // Start button
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            initQuiz();
        });
    }
    
    // Start Conjugation button
    const startConjugationBtn = document.getElementById('startConjugationBtn');
    if (startConjugationBtn) {
        startConjugationBtn.addEventListener('click', () => {
            initConjugationQuiz();
        });
    }
    
    // Reset button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetQuiz();
        });
    }
    
    // Settings button - THIS FIXES THE ERROR
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            openSettingsModal();
        });
    } else {
        console.warn('Settings button not found. Make sure you have an element with id="settingsBtn"');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export settingsManager so other modules can use it
export { settingsManager };
