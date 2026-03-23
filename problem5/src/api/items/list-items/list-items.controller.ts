import { Request, Response, NextFunction } from "express";
import { listItemsSchema } from "./list-items.validation";
import { listItems } from "./list-items.service";

export async function listItemsController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const dto = listItemsSchema.parse(req.query);
    const result = await listItems(dto);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
