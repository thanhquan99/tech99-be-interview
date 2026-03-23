import { Request, Response, NextFunction } from "express";
import { idParam } from "./get-item.validation";
import { getItem } from "./get-item.service";

export async function getItemController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = idParam.parse(req.params);
    const item = await getItem(id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}
