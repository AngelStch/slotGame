import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
) {
    console.error("[ERROR]", err);

    const status =
        typeof err.statusCode === "number"
            ? err.statusCode
            : 500;

    res.status(status).json({
        error: err.name || "Error",
        message: err.message || "Unexpected server error",
    });
}
