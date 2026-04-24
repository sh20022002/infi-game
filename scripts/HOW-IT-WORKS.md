# Question Generator — How It Works

## What this does

Reads a PDF textbook, cuts it into pieces, sends each piece to Claude to create Hebrew math game questions, validates them with a second Claude call, and saves them into the game — one piece per run, resuming where it left off each time.

---

## Files and what each one does

### `config.json` ← **EDIT THIS FIRST**
The only file you need to touch.

```json
{
  "pdfPath": "C:/Users/shmue/Downloads/your-textbook.pdf",
  "apiKey":  "sk-ant-YOUR-KEY-HERE"
}
```

| Field     | What to put                                             |
|-----------|---------------------------------------------------------|
| `pdfPath` | Full path to your PDF on your computer (use `/` slashes)|
| `apiKey`  | Your Anthropic API key from console.anthropic.com       |

Once you fill these in you never need to pass anything in the terminal — just run `node generate-questions.js`.

---

### `generate-questions.js` — the main script

**What it needs:**
- Node.js installed
- `npm install` already run inside `scripts/`
- `config.json` filled in (or API key in the `ANTHROPIC_API_KEY` environment variable)

**What it does each run (one chunk per run):**

```
1. loadConfig()         reads config.json → gets pdfPath + apiKey
2. loadProgress()       reads .progress.json → knows which chunk to do next
3. pdfParse()           reads the PDF and extracts all text
4. splitIntoChunks()    cuts the text into pieces (each ≤ 35% of Claude's 200K token limit)
5. generateQuestions()  sends one chunk to Claude → Claude writes 4-6 Hebrew questions
6. validateQuestions()  sends those questions back to Claude → Claude checks and fixes them
7. saveStoredTopics()   merges validated questions into generated-topics-data.json
8. rewriteOutputJs()    rewrites data/generated-topics.js so the game loads the new questions
9. saveProgress()       saves which chunk comes next, so the next run continues from there
```

**Token budget per run (stays under 50% of the 200K limit):**
- Chunk sent to Claude: ≤ 35% (≤ 70,000 tokens)
- Generate call total:  ≤ 36% (chunk + short prompt)
- Validate call total:  ≤  5% (just the generated questions JSON)

---

### `package.json`

Declares two npm dependencies:

| Package            | What it does                                  |
|--------------------|-----------------------------------------------|
| `@anthropic-ai/sdk`| Talks to the Claude API                       |
| `pdf-parse`        | Extracts plain text from PDF files            |

Run `npm install` once inside the `scripts/` folder before first use.

---

### `.progress.json` (auto-created, auto-deleted)

Created automatically after each run. Stores:

```json
{
  "sourceFile":      "C:/path/to/textbook.pdf",
  "totalChunks":     15,
  "nextChunkIndex":  3,
  "lastProcessedAt": "2026-04-24T10:30:00.000Z",
  "remaining":       12
}
```

The script reads this on the next run to know where to continue. Deleted automatically when all chunks of a PDF are done. You can delete it manually to restart a PDF from the beginning.

---

## Output files (in `data/`)

| File                          | What it is                                               |
|-------------------------------|----------------------------------------------------------|
| `generated-topics-data.json`  | Raw JSON store of all generated questions (persistent)   |
| `generated-topics.js`         | Browser-loadable version — loaded by the game at startup |

`generated-topics.js` is automatically rewritten every run. The game merges its questions into the main topic list on page load.

---

## Processes that run

Each call to `node generate-questions.js` runs these processes in order:

```
Node.js process
│
├── pdf-parse         — reads the PDF file from disk, returns plain text
│
├── splitIntoChunks   — pure JS, no I/O, splits text at paragraph breaks
│
├── Anthropic API #1  — HTTPS request to api.anthropic.com
│   model: claude-sonnet-4-6
│   purpose: generate Hebrew questions from the textbook chunk
│   max output: 8,192 tokens
│
├── Anthropic API #2  — HTTPS request to api.anthropic.com
│   model: claude-sonnet-4-6
│   purpose: validate and fix the generated questions
│   max output: 8,192 tokens
│
├── fs.writeFileSync  — writes generated-topics-data.json
├── fs.writeFileSync  — writes data/generated-topics.js
└── fs.writeFileSync  — writes .progress.json
```

---

## Step-by-step: first time use

1. Open `scripts/config.json`
2. Replace `your-textbook.pdf` with the full path to your PDF
3. Replace `sk-ant-YOUR-KEY-HERE` with your API key
4. Open a terminal in the `scripts/` folder:
   ```
   cd C:\Users\shmue\projects\infi-game\scripts
   ```
5. Install dependencies (once only):
   ```
   npm install
   ```
6. Run:
   ```
   node generate-questions.js
   ```
7. Run again to get the next chunk:
   ```
   node generate-questions.js
   ```
   Keep running until you see "All chunks processed!"

---

## Step-by-step: adding a second PDF

Just change `pdfPath` in `config.json` to the new file and run again. Progress from any previous PDF is already saved in `generated-topics-data.json` — it won't be overwritten.

If you want to restart the same PDF from scratch, delete `scripts/.progress.json`.
