import { z } from "zod";
import { registry } from "../../../openapi-registry";
import { ItemSchema } from "../item.schema";

export const idParam = z.object({
  id: z.string().min(1).openapi({ description: "Item ID", example: "cm8..." }),
});

registry.registerPath({
  method: "get",
  path: "/items/{id}",
  tags: ["Items"],
  summary: "Get an item by ID",
  request: { params: idParam },
  responses: {
    200: {
      description: "Item found",
      content: { "application/json": { schema: ItemSchema } },
    },
    404: { description: "Item not found" },
  },
});
