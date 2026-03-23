import { z } from "zod";
import { registry } from "../../../openapi-registry";
import { ItemSchema } from "../item.schema";

export const listItemsSchema = z.object({
  name: z.string().optional().openapi({ description: "Filter by name" }),
  sortBy: z.string().optional().openapi({ description: "Field to sort by" }),
  order: z.enum(["asc", "desc"]).optional().openapi({ description: "Sort direction" }),
  page: z.coerce.number().int().positive().optional().openapi({ description: "Page number", example: 1 }),
  limit: z.coerce.number().int().positive().max(100).optional().openapi({ description: "Items per page", example: 10 }),
});

registry.registerPath({
  method: "get",
  path: "/items",
  tags: ["Items"],
  summary: "List items",
  request: { query: listItemsSchema },
  responses: {
    200: {
      description: "List of items with pagination",
      content: {
        "application/json": {
          schema: z.object({
            data: z.array(ItemSchema),
            meta: z.object({
              total: z.number().int().openapi({ example: 100 }),
              page: z.number().int().openapi({ example: 1 }),
              limit: z.number().int().openapi({ example: 10 }),
              totalPages: z.number().int().openapi({ example: 10 }),
            }),
          }),
        },
      },
    },
  },
});

export type ListItemsDto = z.infer<typeof listItemsSchema>;
