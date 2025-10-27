import { Request, Response, NextFunction } from "express";
import config from "../data/configuration"; 
import { getPlayerBalance } from "../data/playerStore";
import { gameService, printSpinResult } from "../services/gameService";
import { BadRequestError } from "../utils/errors";

export function getConfig(req: Request, res: Response) {
  // Return only public info (no internal weights or hidden math)
  res.json({
    reelsCount: config.reelsCount,
    rowsCount: config.rowsCount,
    paytable: config.symbols,
    paylines: config.lines,
    currency: "USD", 
    maxLines: config.lines.length,
  });
}

export function getBalance(req: Request, res: Response, next: NextFunction) {
  try {
    const playerId = String(req.query.playerId || "demo");
    const balance = getPlayerBalance(playerId);
    res.json({ playerId, balance });
  } catch (err) {
    next(err);
  }
}

export function postSpin(req: Request, res: Response, next: NextFunction) {
  try {
    const { playerId, betPerLine, linesPlayed } = req.body ?? {};

    if (!playerId) throw new BadRequestError("playerId is required.");

    if (typeof betPerLine !== "number" || betPerLine <= 0) {
      throw new BadRequestError("betPerLine must be a positive number.");
    }

    const maxLines = config.lines.length;

    if (typeof linesPlayed !== "number" || linesPlayed <= 0 || linesPlayed > maxLines) {
      throw new BadRequestError(
        `linesPlayed must be a positive number between 1 and ${maxLines}.`
      );
    }

    const result = gameService.spin({
      playerId,
      betPerLine,
      linesPlayed,
    });

    printSpinResult(result); 
    res.json(result);
  } catch (err) {
    next(err);
  }
}
