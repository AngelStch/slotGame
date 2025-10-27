import { RNG } from "./RNG";
import type { SlotConfiguration } from "./types";

export class SlotMachine {
  private cfg: SlotConfiguration;
  private rng: RNG;

  constructor(cfg: SlotConfiguration, rng: RNG = new RNG()) {
    this.cfg = cfg;
    this.rng = rng;
  }

    spin(): number[][] {
        const matrix: number[][] = [];

        for (let row = 0; row < this.cfg.rowsCount; row++) {
            matrix[row] = [];
        }

        for (let reelIndex = 0; reelIndex < this.cfg.reelsCount; reelIndex++) {
            const reelStrip = this.cfg.reels[reelIndex]; 
            const stopPos = this.rng.pickIndex(reelStrip.length);

            for (let row = 0; row < this.cfg.rowsCount; row++) {
                const stripPos = (stopPos + row) % reelStrip.length;
                matrix[row][reelIndex] = reelStrip[stripPos];
            }
        }

        return matrix;
    }

}
