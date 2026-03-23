import { Request, Response, NextFunction } from "express";
import { idParam } from "./delete-item.validation";
import { deleteItem } from "./delete-item.service";

export async function deleteItemController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = idParam.parse(req.params);
    await deleteItem(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
