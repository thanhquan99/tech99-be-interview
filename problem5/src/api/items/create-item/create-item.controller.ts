import { Request, Response, NextFunction } from "express";
import { createItemSchema } from "./create-item.validation";
import { createItem } from "./create-item.service";

export async function createItemController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const dto = createItemSchema.parse(req.body);
    const item = await createItem(dto);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}
