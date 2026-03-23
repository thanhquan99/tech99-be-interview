import { Request, Response, NextFunction } from "express";
import { idParam, updateItemSchema } from "./update-item.validation";
import { updateItem } from "./update-item.service";

export async function updateItemController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = idParam.parse(req.params);
    const dto = updateItemSchema.parse(req.body);
    const item = await updateItem(id, dto);
    res.json(item);
  } catch (err) {
    next(err);
  }
}
