import { z } from "zod";
import { registry } from "../../../openapi-registry";

export const idParam = z.object({
  id: z.string().min(1).openapi({ description: "Item ID", example: "cm8..." }),
});

registry.registerPath({
  method: "delete",
  path: "/items/{id}",
  tags: ["Items"],
  summary: "Delete an item",
  request: { params: idParam },
  responses: {
    204: { description: "Item deleted" },
    404: { description: "Item not found" },
  },
});
