import { z } from "zod";
import { registry } from "../../../openapi-registry";
import { ItemSchema } from "../item.schema";

export const idParam = z.object({
  id: z.string().min(1).openapi({ description: "Item ID", example: "cm8..." }),
});

export const updateItemSchema = z.object({
  name: z.string().min(1).optional().openapi({ example: "Updated Widget" }),
  description: z.string().min(1).optional().openapi({ example: "An updated widget" }),
  price: z.number().nonnegative().optional().openapi({ example: 19.99 }),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided",
});

registry.registerPath({
  method: "put",
  path: "/items/{id}",
  tags: ["Items"],
  summary: "Update an item",
  request: {
    params: idParam,
    body: {
      required: true,
      content: { "application/json": { schema: updateItemSchema } },
    },
  },
  responses: {
    200: {
      description: "Item updated",
      content: { "application/json": { schema: ItemSchema } },
    },
    400: { description: "Validation error" },
    404: { description: "Item not found" },
  },
});

export type UpdateItemDto = z.infer<typeof updateItemSchema>;
