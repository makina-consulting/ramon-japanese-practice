// UI Manager - Handles all UI updates and user interactions
import { extractLessons, extractCategories, filterVocabulary } from './data-manager.js';
import { getState, setFilteredVocabulary, setSelectedLessons, setSelectedCategories } from './state.js';
import { checkAnswer } from './quiz-controller.js';
import { initSettingsListeners } from './settings.js';

export function initUI() {
    setupFilterModal();
    initSettingsListeners();
}

export function updateDisplay() {
    const state = getState();
    
    // Update stats
    document.getElementById('score').textContent = state.score;
    document.getElementById('questionNumber').textContent = `${state.questionNumber}/${state.totalQuestions}`;
    document.getElementById('availableWords').textContent = state.filteredVocabulary.length;
    
    // Update question
    const questionText = document.getElementById('questionText');
    const kanjiDisplay = document.getElementById('kanjiDisplay');
    const answerArea = document.getElementById('answerArea');
    const resultMessage = document.getElementById('resultMessage');
    
    if (!state.quizActive) {
        questionText.textContent = state.currentQuestion || 'Click "Start Quiz" to begin!';
        kanjiDisplay.textContent = '';
        answerArea.innerHTML = '';
        resultMessage.textContent = '';
        return;
    }
    
    // Show question
    if (state.quizMode === 'conjugation') {
        questionText.textContent = `Convert to: ${state.conjugationFormDisplay}`;
        kanjiDisplay.textContent = state.currentQuestion;
    } else {
        questionText.textContent = 'Select the correct answer:';
        kanjiDisplay.textContent = state.currentQuestion;
    }
    
    // Clear result message
    resultMessage.textContent = '';
    resultMessage.className = 'result-message';
    
    // Create answer buttons
    answerArea.innerHTML = '';
    state.currentAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.addEventListener('click', () => handleAnswerClick(button, answer));
        answerArea.appendChild(button);
    });
}

function handleAnswerClick(button, answer) {
    const state = getState();
    
    // Disable all buttons
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
    });
    
    // Highlight correct/incorrect
    const isCorrect = answer === state.correctAnswer;
    if (isCorrect) {
        button.classList.add('correct');
    } else {
        button.classList.add('incorrect');
        // Highlight the correct answer
        document.querySelectorAll('.answer-btn').forEach(btn => {
            if (btn.textContent === state.correctAnswer) {
                btn.classList.add('correct');
            }
        });
    }
    
    checkAnswer(answer);
}

export function showResult(isCorrect, correctAnswer) {
    const resultMessage = document.getElementById('resultMessage');
    
    if (isCorrect) {
        resultMessage.textContent = '✓ Correct!';
        resultMessage.className = 'result-message correct';
    } else {
        resultMessage.textContent = `✗ Incorrect. The answer was: ${correctAnswer}`;
        resultMessage.className = 'result-message incorrect';
    }
}

function setupFilterModal() {
    const state = getState();
    const modal = document.getElementById('filterModal');
    const filterBtn = document.getElementById('filterBtn');
    const closeBtn = modal.querySelector('.close');
    const applyBtn = document.getElementById('applyFilter');
    
    // Get unique lessons and categories
    const lessons = extractLessons(state.vocabulary);
    const categories = extractCategories(state.vocabulary);
    
    // Setup lesson checkboxes
    const lessonContainer = document.getElementById('lessonCheckboxes');
    lessonContainer.innerHTML = '';
    lessons.forEach(lesson => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `lesson-${lesson}`;
        checkbox.value = lesson;
        checkbox.checked = true; // Default to all selected
        
        const label = document.createElement('label');
        label.htmlFor = `lesson-${lesson}`;
        label.textContent = `Lesson ${lesson}`;
        
        div.appendChild(checkbox);
        div.appendChild(label);
        lessonContainer.appendChild(div);
    });
    
    // Setup category checkboxes
    const categoryContainer = document.getElementById('categoryCheckboxes');
    categoryContainer.innerHTML = '';
    categories.forEach(category => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `category-${category}`;
        checkbox.value = category;
        checkbox.checked = true; // Default to all selected
        
        const label = document.createElement('label');
        label.htmlFor = `category-${category}`;
        label.textContent = category;
        
        div.appendChild(checkbox);
        div.appendChild(label);
        categoryContainer.appendChild(div);
    });
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs and content
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            btn.classList.add('active');
            
            // Show corresponding content
            const tabName = btn.dataset.tab;
            const content = document.getElementById(`${tabName}Tab`);
            if (content) {
                content.classList.add('active');
            }
        });
    });
    
    // Select/Deselect All Lessons
    document.getElementById('selectAllLessons').addEventListener('click', () => {
        lessonContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
    });
    
    document.getElementById('deselectAllLessons').addEventListener('click', () => {
        lessonContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    });
    
    // Select/Deselect All Categories
    document.getElementById('selectAllCategories').addEventListener('click', () => {
        categoryContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
    });
    
    document.getElementById('deselectAllCategories').addEventListener('click', () => {
        categoryContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    });
    
    // Open modal
    filterBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Apply filter
    applyBtn.addEventListener('click', () => {
        const selectedLessons = Array.from(lessonContainer.querySelectorAll('input:checked')).map(cb => cb.value);
        const selectedCategories = Array.from(categoryContainer.querySelectorAll('input:checked')).map(cb => cb.value);
        
        setSelectedLessons(selectedLessons);
        setSelectedCategories(selectedCategories);
        
        const filtered = filterVocabulary(state.vocabulary, selectedLessons, selectedCategories);
        setFilteredVocabulary(filtered);
        
        updateDisplay();
        modal.style.display = 'none';
        
        console.log(`Filtered to ${filtered.length} words`);
    });
}
