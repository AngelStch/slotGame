import config from "../data/configuration";
import { getPlayerBalance, updatePlayerBalance } from "../data/playerStore";
import { SlotMachine } from "../engine/SlotMachine";
import { PayoutEvaluator } from "../engine/PayoutEvaluator";

// Types
export interface SpinRequest {
    playerId: string;
    betPerLine: number;
    linesPlayed: number;
}

export interface SpinResponse {
    balanceBefore: number;
    balanceAfter: number;
    currency: string;
    spinResult: {
        matrix: number[][];
        lineWins: Array<{
            lineIndex: number;
            symbol: number;
            count: number;
            winAmount: number;
            positions: Array<[row: number, reel: number]>;
        }>;
        totalWin: number;
    };
}


//console pretty-print for debugging or visual logs
export function printSpinResult(spin: SpinResponse): void {
    const { matrix, lineWins, totalWin } = spin.spinResult;
    const { currency } = spin;

    console.log("\n🎰  SPIN RESULT");
    console.log("──────────────────────────────");

    console.log("\n🧩 Matrix:");
    matrix.forEach((row, i) => {
        console.log(`Row ${i + 1}:  ${row.join("   ")}`);
    });

    console.log("\n💰 Line Wins:");
    if (lineWins.length === 0) {
        console.log("No wins this spin 😢");
    } else {
        lineWins.forEach(win => {
            const pos = win.positions.map(([r, c]) => `(${r},${c})`).join(", ");
            console.log(`- Line ${win.lineIndex + 1}: Symbol ${win.symbol} x${win.count} → +${win.winAmount} ${currency}`);
            console.log(`  ↳ Positions: ${pos}`);
        });
    }

    console.log("\n🏆 Total Win:", `${totalWin} ${currency}`);
    console.log(`💼 Balance: ${spin.balanceBefore} → ${spin.balanceAfter} ${currency}`);
    console.log("──────────────────────────────\n");
}


// Core spin logic
export function doSpin(req: SpinRequest): SpinResponse {
    const { playerId, betPerLine, linesPlayed } = req;

    const activeLines = Math.min(linesPlayed, config.lines.length);
    const totalBet = betPerLine * activeLines;

    const before = getPlayerBalance(playerId);

    if (before < totalBet) {
        throw new Error("Not enough balance for this spin.");
    }

    //  Deduct bet from balance
    updatePlayerBalance(playerId, before - totalBet);

    // Spin the reels
    const machine = new SlotMachine(config);
    const matrix = machine.spin();

    // PayoutEvaluator
    const evaluator = new PayoutEvaluator(config);
    const { lineWins, totalWin } = evaluator.evaluateSpin(matrix, activeLines, betPerLine);

    //  adding winnings to balance
    const after = getPlayerBalance(playerId) + totalWin;
    updatePlayerBalance(playerId, after);

    const result: SpinResponse = {
        balanceBefore: before,
        balanceAfter: after,
        currency: "USD",
        spinResult: {
            matrix,
            lineWins,
            totalWin,
        },
    };

    //  print on the terminal
    printSpinResult(result);

    return result;
}

// Export game logic
export const gameService = {
    spin: doSpin,
};
