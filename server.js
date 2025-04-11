const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;
const SCORES_DIR = process.env.NODE_ENV === 'production' ? '/tmp' : '.';

// Configure CORS for production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGIN || 'https://math-tic-tac-toe.herokuapp.com'
        : 'http://localhost:3000',
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

// Store scores in a JSON file
const SCORES_FILE = path.join(SCORES_DIR, 'scores.json');

// Initialize scores file if it doesn't exist
async function initializeScoresFile() {
    try {
        await fs.access(SCORES_FILE);
    } catch {
        await fs.writeFile(SCORES_FILE, JSON.stringify({ scores: [] }));
    }
}

// Get all scores
app.get('/api/scores', async (req, res) => {
    try {
        const data = await fs.readFile(SCORES_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Error reading scores' });
    }
});

// Add a new score
app.post('/api/scores', async (req, res) => {
    try {
        const { winner, moves, date } = req.body;
        const data = await fs.readFile(SCORES_FILE, 'utf8');
        const scoresData = JSON.parse(data);
        
        scoresData.scores.push({
            winner,
            moves,
            date,
            id: Date.now()
        });

        await fs.writeFile(SCORES_FILE, JSON.stringify(scoresData, null, 2));
        res.json({ message: 'Score saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving score' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Initialize scores file and start server
initializeScoresFile().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
