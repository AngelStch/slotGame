
// Definition of a reel configuration
export interface ReelConfig {
  symbols: string[]; 
}

//  Definition of a payline
export interface Payline {
  pattern: number[]; 
}

//  Definition of payout rules for a symbol
export interface PaytableEntry {
  [count: number]: number; 
}

//  Definition of the full paytable
export interface Paytable {
  [symbol: string]: PaytableEntry;
}

//  Definition of the slot machine configuration(comming from data/configuration)
export interface SlotConfiguration {
  reelsCount: number;
  rowsCount: number;
  symbols: Record<number, number[]>; 
  lines: number[][];                 
  reels: number[][];                 
}
