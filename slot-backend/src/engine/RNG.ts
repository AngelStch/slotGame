// Simple RNG wrapper.

export class RNG {
  pickIndex(length: number): number {
    return Math.floor(Math.random() * length);
  }
}
