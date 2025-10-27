/**
 * In-memory player balances.
 * In real life this is DB or cache.
 */

const balances: Record<string, number> = {
  demo: 100 ,
  player1: 200// starting credits
};

export function getPlayerBalance(playerId: string): number {
  if (!(playerId in balances)) {
    
    // initialize new player with default balance 100
    balances[playerId] = 100;
  }
  return balances[playerId];
}

export function updatePlayerBalance(playerId: string, newBalance: number): void {
  balances[playerId] = newBalance;
}
