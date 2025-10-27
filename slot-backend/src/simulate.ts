import { gameService } from "./services/gameService";
import { performance } from "perf_hooks";

const playerId = "simulator";
const betPerLine = 1;
const linesPlayed = 5;
const iterations = 10000;

function resetBalance() {
  const { updatePlayerBalance } = require("./data/playerStore");
  updatePlayerBalance(playerId, 1_000_000); // reset to 1 million credits
}

async function simulateSpins() {
  resetBalance();

  let totalWins = 0;
  let totalBets = 0;
  let winCount = 0;

  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    try {
      const result = gameService.spin({
        playerId,
        betPerLine,
        linesPlayed,
      });

      totalBets += betPerLine * linesPlayed;
      totalWins += result.spinResult.totalWin;
      if (result.spinResult.totalWin > 0) {
        winCount++;
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error("Simulation error:", e.message);
      } else {
        console.error("Simulation error:", e);
      }
      break;
    }
  }

  const end = performance.now();
  const durationSeconds = ((end - start) / 1000).toFixed(2);
  const rtp = ((totalWins / totalBets) * 100).toFixed(2);
  const winRate = ((winCount / iterations) * 100).toFixed(2);

  console.log(`\nSimulation Complete!`);
  console.log(`Spins:           ${iterations}`);
  console.log(`Total Bets:      ${totalBets}`);
  console.log(`Total Wins:      ${totalWins}`);
  console.log(`RTP:             ${rtp}%`);
  console.log(`Win Rate:        ${winRate}%`);
  console.log(`Execution Time:  ${durationSeconds} sec\n`);
}

simulateSpins();
