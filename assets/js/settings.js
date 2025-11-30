// Settings Manager - Handle quiz settings
class SettingsManager {
    constructor() {
        this.settings = {
            quizDirection: 'ja-en' // 'ja-en' or 'en-ja'
        };
        this.loadSettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('quizSettings');
        if (saved) {
            try {
                this.settings = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
    }

    saveSettings() {
        localStorage.setItem('quizSettings', JSON.stringify(this.settings));
    }

    getQuizDirection() {
        return this.settings.quizDirection;
    }

    setQuizDirection(direction) {
        this.settings.quizDirection = direction;
        this.saveSettings();
    }
}

export const settingsManager = new SettingsManager();

export function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (!modal) {
        console.error('Settings modal not found');
        return;
    }
    
    // Set current values
    const direction = settingsManager.getQuizDirection();
    const radioBtn = document.querySelector(`input[name="quizDirection"][value="${direction}"]`);
    if (radioBtn) {
        radioBtn.checked = true;
        updateRadioSelection(radioBtn);
    }
    
    modal.style.display = 'block';
}

export function closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function updateRadioSelection(selectedRadio) {
    document.querySelectorAll('.radio-option').forEach(option => {
        option.classList.remove('selected');
    });
    const parentLabel = selectedRadio.closest('.radio-option');
    if (parentLabel) {
        parentLabel.classList.add('selected');
    }
}

export function initSettingsListeners() {
    // Close button
    const closeBtn = document.getElementById('closeSettingsBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSettingsModal);
    }
    
    // Close when clicking outside
    const modal = document.getElementById('settingsModal');
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeSettingsModal();
            }
        });
    }
    
    // Radio button selection visual feedback
    document.querySelectorAll('.radio-option').forEach(option => {
        option.addEventListener('click', () => {
            const radio = option.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                updateRadioSelection(radio);
            }
        });
    });
    
    // Save settings
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const selectedDirection = document.querySelector('input[name="quizDirection"]:checked');
            if (selectedDirection) {
                settingsManager.setQuizDirection(selectedDirection.value);
                console.log('Settings saved:', settingsManager.settings);
            }
            closeSettingsModal();
        });
    }
}
