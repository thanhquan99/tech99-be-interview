import { z } from "zod";
import { registry } from "../../../openapi-registry";
import { ItemSchema } from "../item.schema";

export const createItemSchema = z.object({
  name: z.string().min(1).openapi({ example: "Widget" }),
  description: z.string().min(1).openapi({ example: "A useful widget" }),
  price: z.number().nonnegative().openapi({ example: 9.99 }),
});

registry.registerPath({
  method: "post",
  path: "/items",
  tags: ["Items"],
  summary: "Create a new item",
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: createItemSchema } },
    },
  },
  responses: {
    201: {
      description: "Item created",
      content: { "application/json": { schema: ItemSchema } },
    },
    400: { description: "Validation error" },
  },
});

export type CreateItemDto = z.infer<typeof createItemSchema>;
