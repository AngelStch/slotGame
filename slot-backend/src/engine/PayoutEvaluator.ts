import type { SlotConfiguration } from "./types";

/**
 * PayoutEvaluator:
 * - checks paylines
 * - calculates wins
 * - returns win details
 */
export class PayoutEvaluator {
  private cfg: SlotConfiguration;

  constructor(cfg: SlotConfiguration) {
    this.cfg = cfg;
  }

  evaluateSpin(
    matrix: number[][],
    activeLines: number,
    betPerLine: number
  ): {
    lineWins: Array<{
      lineIndex: number;
      symbol: number;
      count: number;
      winAmount: number;
      positions: Array<[row: number, reel: number]>;
    }>;
    totalWin: number;
  } {
    const lineWins = [];
    let totalWin = 0;

    for (let i = 0; i < activeLines; i++) {
      const payline = this.cfg.lines[i];
      const winInfo = this.evaluateLine(matrix, payline, betPerLine, i);
      if (winInfo) {
        lineWins.push(winInfo);
        totalWin += winInfo.winAmount;
      }
    }

    return {
      lineWins,
      totalWin,
    };
  }

  //Evaluate a single payline for wins
  private evaluateLine(
    matrix: number[][],
    payline: number[],
    betPerLine: number,
    lineIndex: number
  ) {
    const firstRow = payline[0];
    const baseSymbol = matrix[firstRow][0];

    if (!this.cfg.symbols[baseSymbol]) return null;

    let matchCount = 1;
    const positions: Array<[number, number]> = [[firstRow, 0]];

    for (let reel = 1; reel < this.cfg.reelsCount; reel++) {
      const row = payline[reel];
      const sym = matrix[row][reel];

      if (sym === baseSymbol) {
        matchCount++;
        positions.push([row, reel]);
      } else {
        break;
      }
    }

    const paytable = this.cfg.symbols[baseSymbol];
    const payout = paytable[matchCount - 1] ?? 0; 

    if (payout <= 0) return null;

    const winAmount = payout * betPerLine;

    return {
      lineIndex,
      symbol: baseSymbol,
      count: matchCount,
      winAmount,
      positions,
    };
  }
}
