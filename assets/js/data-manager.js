// Data Manager - Handles vocabulary loading and filtering
export async function loadVocabulary() {
    try {
        const response = await fetch('assets/data/vocab.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Loaded ${data.length} vocabulary items`);
        return data;
    } catch (error) {
        console.error('Error loading vocabulary:', error);
        return [];
    }
}

export function extractLessons(vocabulary) {
    const lessonsSet = new Set();
    vocabulary.forEach(word => {
        if (word.lessonSection) {
            lessonsSet.add(word.lessonSection);
        }
    });
    return Array.from(lessonsSet).sort();
}

export function extractCategories(vocabulary) {
    const categoriesSet = new Set();
    vocabulary.forEach(word => {
        if (word.category) {
            categoriesSet.add(word.category);
        }
    });
    return Array.from(categoriesSet).sort();
}

export function filterVocabulary(vocabulary, selectedLessons, selectedCategories) {
    return vocabulary.filter(word => {
        const matchesLesson = selectedLessons.length === 0 || 
                            selectedLessons.includes(word.lessonSection);
        const matchesCategory = selectedCategories.length === 0 || 
                              selectedCategories.includes(word.category);
        return matchesLesson && matchesCategory;
    });
}

// Filter for words that have conjugations (verbs and adjectives)
export function filterConjugatable(vocabulary) {
    return vocabulary.filter(word => 
        word.conjugations && 
        (word.wordType === 'u-verb' || 
         word.wordType === 'ru-verb' || 
         word.wordType === 'irregular-verb' ||
         word.wordType === 'i-adjective' || 
         word.wordType === 'na-adjective')
    );
}
