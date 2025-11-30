/**
 * Chapter Filter Module
 * Handles chapter filtering UI and logic
 */

import { AppState } from './state.js';
import { DataManager } from './data-manager.js';
import { QuizController } from './quiz-controller.js';

const TOTAL_CHAPTERS = 24;

export const ChapterFilter = {
    // DOM elements
    elements: {},
    
    /**
     * Initialize chapter filter UI
     */
    init() {
        this.elements = {
            filterBtn: document.getElementById('open-chapter-filter'),
            filterBadge: document.getElementById('filter-badge'),
            modal: document.getElementById('chapter-filter-modal'),
            closeBtn: document.getElementById('close-chapter-filter'),
            chapterGrid: document.getElementById('chapter-grid'),
            selectAllBtn: document.getElementById('select-all-chapters'),
            clearAllBtn: document.getElementById('clear-all-chapters'),
            applyBtn: document.getElementById('apply-chapter-filter'),
            infoText: document.getElementById('filter-info-text')
        };

        this.setupEventListeners();
        this.generateChapterBadges();
        this.initializeAllChapters();
    },

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Open modal
        this.elements.filterBtn.addEventListener('click', () => this.openModal());
        
        // Close modal
        this.elements.closeBtn.addEventListener('click', () => this.closeModal());
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) this.closeModal();
        });

        // Action buttons
        this.elements.selectAllBtn.addEventListener('click', () => this.selectAll());
        this.elements.clearAllBtn.addEventListener('click', () => this.clearAll());
        this.elements.applyBtn.addEventListener('click', () => this.applyFilter());
    },

    /**
     * Generate chapter badge elements
     */
    generateChapterBadges() {
        const grid = this.elements.chapterGrid;
        grid.innerHTML = '';

        for (let i = 1; i <= TOTAL_CHAPTERS; i++) {
            const badge = document.createElement('button');
            badge.className = 'chapter-badge';
            badge.setAttribute('data-chapter', i);
            badge.innerHTML = `
                <span class="chapter-badge-number">${i}</span>
                <span class="chapter-badge-label">Ch ${i}</span>
            `;
            badge.addEventListener('click', () => this.toggleChapter(i));
            grid.appendChild(badge);
        }
    },

    /**
     * Initialize with all chapters selected
     */
    initializeAllChapters() {
        for (let i = 1; i <= TOTAL_CHAPTERS; i++) {
            AppState.chapterFilter.selectedChapters.add(i);
        }
        this.updateBadgeStates();
    },

    /**
     * Toggle chapter selection
     * @param {number} chapter - Chapter number
     */
    toggleChapter(chapter) {
        const chapters = AppState.chapterFilter.selectedChapters;
        
        if (chapters.has(chapter)) {
            chapters.delete(chapter);
        } else {
            chapters.add(chapter);
        }

        this.updateBadgeStates();
        this.updateInfoText();
    },

    /**
     * Select all chapters
     */
    selectAll() {
        for (let i = 1; i <= TOTAL_CHAPTERS; i++) {
            AppState.chapterFilter.selectedChapters.add(i);
        }
        this.updateBadgeStates();
        this.updateInfoText();
    },

    /**
     * Clear all chapter selections
     */
    clearAll() {
        AppState.chapterFilter.selectedChapters.clear();
        this.updateBadgeStates();
        this.updateInfoText();
    },

    /**
     * Update visual state of chapter badges
     */
    updateBadgeStates() {
        const badges = this.elements.chapterGrid.querySelectorAll('.chapter-badge');
        badges.forEach(badge => {
            const chapter = parseInt(badge.getAttribute('data-chapter'));
            if (AppState.chapterFilter.selectedChapters.has(chapter)) {
                badge.classList.add('active');
            } else {
                badge.classList.remove('active');
            }
        });
    },

    /**
     * Update info text showing selection count
     */
    updateInfoText() {
        const count = AppState.chapterFilter.selectedChapters.size;
        const total = TOTAL_CHAPTERS;

        if (count === 0) {
            this.elements.infoText.textContent = 'No chapters selected. Select at least one chapter.';
        } else if (count === total) {
            this.elements.infoText.textContent = 'All chapters selected. You will study everything!';
        } else {
            this.elements.infoText.textContent = `${count} of ${total} chapters selected.`;
        }
    },

    /**
     * Update filter badge on main button
     */
    updateFilterBadge() {
        const count = AppState.chapterFilter.selectedChapters.size;
        const badge = this.elements.filterBadge;

        if (count < TOTAL_CHAPTERS && count > 0) {
            badge.textContent = count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    },

    /**
     * Apply the chapter filter
     */
    applyFilter() {
        const selectedCount = AppState.chapterFilter.selectedChapters.size;

        // Don't allow applying with no chapters selected
        if (selectedCount === 0) {
            alert('Please select at least one chapter to study.');
            return;
        }

        // Enable filter if not all chapters are selected
        AppState.chapterFilter.enabled = selectedCount < TOTAL_CHAPTERS;

        // Reprocess data with new filter
        DataManager.processQuizData();

        // Update UI
        this.updateFilterBadge();
        this.closeModal();

        // Start new question with filtered data
        QuizController.startNewQuestion();
    },

    /**
     * Open filter modal
     */
    openModal() {
        this.updateBadgeStates();
        this.updateInfoText();
        this.elements.modal.classList.add('active');
    },

    /**
     * Close filter modal
     */
    closeModal() {
        this.elements.modal.classList.remove('active');
    },

    /**
     * Get currently selected chapters as array
     * @returns {number[]} Array of selected chapter numbers
     */
    getSelectedChapters() {
        return Array.from(AppState.chapterFilter.selectedChapters).sort((a, b) => a - b);
    }
};
