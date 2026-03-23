import { Router } from "express";
import { createItemController } from "./create-item/create-item.controller";
import { listItemsController } from "./list-items/list-items.controller";
import { getItemController } from "./get-item/get-item.controller";
import { updateItemController } from "./update-item/update-item.controller";
import { deleteItemController } from "./delete-item/delete-item.controller";

const router = Router();

router.post("/", createItemController);
router.get("/", listItemsController);
router.get("/:id", getItemController);
router.put("/:id", updateItemController);
router.delete("/:id", deleteItemController);

export default router;
