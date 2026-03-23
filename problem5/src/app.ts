import express from "express";
import swaggerUi from "swagger-ui-express";
import itemRoutes from "./api/items/item.routes";
import { errorHandler } from "./middleware/error-handler";
import { swaggerSpec } from "./swagger";

const app = express();

app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/items", itemRoutes);

app.use(errorHandler);

export default app;
