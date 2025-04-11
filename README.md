# Math Tic Tac Toe

A fun educational twist on the classic Tic Tac Toe game where players solve math problems to place their marks. Features a score tracking system to record wins and moves.

## Features

- Math problems with addition, subtraction, and multiplication
- Score tracking system
- Real-time move counter
- Responsive design
- Persistent leaderboard

## Technologies Used

- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js, Express.js
- Database: File-based JSON storage

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/math-tic-tac-toe.git
   cd math-tic-tac-toe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

## Deployment

### Heroku Deployment

1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku:
   ```bash
   heroku login
   ```

3. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```

4. Deploy the application:
   ```bash
   git push heroku main
   ```

### Environment Variables

The following environment variables can be configured:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode ('development' or 'production')
- `ALLOWED_ORIGIN`: Allowed CORS origin in production

## How to Play

1. Visit the game URL
2. Players take turns solving math problems to place their marks (X/O)
3. Each cell contains a math problem - solve it correctly to place your mark
4. First player to get three in a row (horizontally, vertically, or diagonally) wins!
5. Scores are automatically saved and displayed in the leaderboard

## License

MIT
