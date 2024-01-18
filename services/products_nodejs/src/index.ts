import { PrismaClient } from "@prisma/client";
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { router } from "./products/products.router";

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

app.use("/api/products", router);

const server = app.listen(8080, () =>
  console.log(`
🚀 Server ready at: http://localhost:8080
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
