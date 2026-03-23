import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/api-error";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation error",
      details: err.flatten().fieldErrors,
    });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Prisma record not found (update/delete on non-existent id)
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    (err as Prisma.PrismaClientKnownRequestError).code === "P2025"
  ) {
    res.status(404).json({ error: "Item not found" });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
