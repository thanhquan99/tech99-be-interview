import { z } from "zod";
import { registry } from "../../openapi-registry";

export const ItemSchema = registry.register(
  "Item",
  z.object({
    id: z.number().int().openapi({ example: 1 }),
    name: z.string().openapi({ example: "Widget" }),
    description: z.string().openapi({ example: "A useful widget" }),
    price: z.number().openapi({ example: 9.99 }),
    createdAt: z.date().openapi({ example: "2024-01-01T00:00:00.000Z" }),
    updatedAt: z.date().openapi({ example: "2024-01-01T00:00:00.000Z" }),
  })
);
