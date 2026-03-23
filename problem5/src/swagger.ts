// Side-effect imports: register all routes onto the shared registry
import "./api/items/item.schema";
import "./api/items/create-item/create-item.validation";
import "./api/items/list-items/list-items.validation";
import "./api/items/update-item/update-item.validation";
import "./api/items/get-item/get-item.validation";
import "./api/items/delete-item/delete-item.validation";

import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./openapi-registry";

const generator = new OpenApiGeneratorV3(registry.definitions);

export const swaggerSpec = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Items CRUD API",
    version: "1.0.0",
    description: "CRUD API for managing items",
  },
});
