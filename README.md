Slot Machine Backend – Dreamshot Challenge
This is a TypeScript/Node.js implementation of a classic 5-reel, 3-row slot machine. It simulates spinning, paylines, win evaluation, and balance updates — all without any database. Built as a backend-only solution for the Dreamshot technical challenge.

Features
5x3 slot machine mechanics

Random spin generation based on number reels

Win evaluation based on paylines and paytable

In-memory player balances (no DB required)

REST API with 3 endpoints:

/spin
/balance
/config
Currency: USD

How the Game Works
The player provides:
playerId
betPerLine – bet per active line
linesPlayed – how many lines to activate (e.g. 1–5)
The machine performs a "spin" — generates a matrix of visible numbers.
Each active payline is checked for left-to-right number matches.
If a line has N matching numbers:
The payout multiplier is taken from the paytable.
winAmount = multiplier × betPerLine
Final balance is updated as: newBalance = balanceBefore - totalBet + totalWin
API Documentation
POST /spin
Spin the slot machine with a given bet and line count.

URL http://localhost:5000/spin

Method POST

Request Body (JSON):

{
  "playerId": "demo",
  "betPerLine": 1,
  "linesPlayed": 5
}
GET /balance
Get current player balance.

URL http://localhost:5000/balance?playerId=demo

Method GET

Query Params

playerId (required) — The player’s ID.
GET /config
Get the slot machine configuration.

URL http://localhost:5000/config

Method GET

Setup Instructions
Clone the repository and install dependencies:

cd slot-backend npm install npm run dev

Or run manually with: npx ts-node-dev src/index.ts

Simulation run
npm run simulate

Or run manually with: npx ts-node-dev src/simulate.ts

Project Structure
src/
├── index.ts               # Start server
├── simulation.ts          # Start simulation
├── server.ts              # Express app + middleware
├── routes/
│   └── gameRoutes.ts      # API routes
├── controllers/
│   └── gameController.ts  # Request → Service
├── services/
│   └── gameService.ts     # Spin logic, payout, balance
├── engine/
│   ├── SlotMachine.ts     # Generates spin matrix
│   ├── PayoutEvaluator.ts # Checks wins
│   ├── RNG.ts             # Random helper
│   └── types.ts           # Core engine types
├── data/
│   ├── configuration.ts   # Config & math model
│   └── playerStore.ts     # In-memory balances
└── utils/
    └── errors.ts          # Custom errors
Notes
The game resets all balances every time the server restarts.
