# ラモンの日本語クイズ (Ramon's Japanese Quiz)

A comprehensive Japanese vocabulary and conjugation quiz application built with vanilla JavaScript.

## Features

### 1. **Regular Vocabulary Quiz**
- Test yourself on Japanese-to-English or English-to-Japanese translations
- Filter by lesson (L00-L12 from Genki 1)
- Filter by category (Greetings, Numbers, Verbs, Adjectives, etc.)
- 1,076 vocabulary items from Genki 1

### 2. **Conjugation Quiz** (NEW!)
The conjugation quiz mode allows you to practice verb and adjective conjugations.

When you click "Start Conjugation":
- **Only verbs and adjectives** are included in the quiz
- For each question, a random word is selected
- A random conjugation form is chosen (e.g., "Polite Past Affirmative")
- You must select the correct conjugation from 4 options

#### Supported Conjugation Forms:

**For Verbs:**
- Polite Present (+/−): ます / ません
- Polite Past (+/−): ました / ませんでした
- Plain Present (+/−): dictionary form / ない
- Plain Past (+/−): た / なかった
- Te-form: て

**For い-Adjectives:**
- Polite Present (+/−): です / くないです
- Polite Past (+/−): かったです / くなかったです
- Plain Present (+/−): dictionary form / くない
- Plain Past (+/−): かった / くなかった
- Adverb form: く

**For な-Adjectives:**
- Polite Present (+/−): です / ではありません
- Polite Past (+/−): でした / ではありませんでした
- Plain Present (+/−): だ / ではない
- Plain Past (+/−): だった / ではなかった
- Adverb form: に

## Usage

### Starting the Quiz
1. **Filter Lessons** (optional): Click "📚 Filter Lessons" to select specific lessons or categories
2. **Start Regular Quiz**: Click "Start Quiz" for vocabulary practice
3. **Start Conjugation Quiz**: Click "Start Conjugation" for verb/adjective conjugation practice

### Settings
- Click "⚙️ Settings" to change quiz direction:
  - **日本語 → English**: Questions in Japanese, answers in English
  - **English → 日本語**: Questions in English, answers in Japanese

### Examples

**Regular Quiz (JA→EN mode):**
```
Question: のむ
Answer options:
- to drink ✓
- to eat
- to speak
- to read
```

**Conjugation Quiz:**
```
Convert to: Polite Past Affirmative
のむ (to drink)

Answer options:
- のみました ✓
- のみます
- のんだ
- のまない
```

## File Structure
```
japanese-quiz-app/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── styles.css     # All styles
│   └── js/
│       ├── app.js          # Main entry point
│       ├── data-manager.js # Vocabulary loading and filtering
│       ├── state.js        # State management
│       ├── ui.js           # UI updates and interactions
│       ├── quiz-controller.js # Quiz logic
│       └── settings.js     # Settings management
└── data/
    └── vocab.json          # Vocabulary database (1,076 words)
```

## Running the Application

### Option 1: Local Python Server
```bash
cd japanese-quiz-app
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

### Option 2: Live Server (VS Code)
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

### Option 3: Any Web Server
Deploy the entire folder to any web server.

## Technical Details

- **Pure Vanilla JavaScript** - No frameworks or build tools required
- **ES6 Modules** - Modern JavaScript module system
- **Responsive Design** - Works on desktop and mobile
- **Local Storage** - Settings persist between sessions

## Data Structure

Each word with conjugations has this structure:
```json
{
  "hiragana": "のむ",
  "kanji": "飲む",
  "english": "to drink (〜を)",
  "lessonSection": "03",
  "category": "U-verbs",
  "wordType": "u-verb",
  "conjugations": {
    "polite": {
      "present": {
        "affirmative": "のみます",
        "negative": "のみません"
      },
      "past": {
        "affirmative": "のみました",
        "negative": "のみませんでした"
      }
    },
    "plain": {
      "present": {
        "affirmative": "のむ",
        "negative": "のまない"
      },
      "past": {
        "affirmative": "のんだ",
        "negative": "のまなかった"
      }
    },
    "te_form": "のんで"
  }
}
```

## Credits

Built by Ramon for Japanese language learning.
Vocabulary from Genki 1 textbook.

## License

For personal educational use.
