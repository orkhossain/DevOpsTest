import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import express from "express";

export const router = express.Router();
import * as ProductService from "./products.service";

router.get("/", async (request: Request, response: Response) => {
  try {
    const products = await ProductService.listProducts();
    return response.status(200).json(products);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

router.get(`/create`, async (request: Request, response: Response) => {
  const { title, price, description } = request.body;
  console.log(request.body);
  try {
    const product = await ProductService.createProduct({
      title,
      price,
      description,
    });
    console.log("i am here");
    return response.status(200).json(product);
  } catch (error: any) {
    console.log("i am there");

    return response.status(500).json(error.message);
  }
});

router.put("/update/:id", async (request: Request, response: Response) => {
  const { id } = request.params;
  // const post = await prisma.product.update({
  //   where: { id: Number(id) },
  // });
  // response.json(post);
});

router.delete(`/delete/:id`, async (request: Request, response: Response) => {
  const { id } = request.params;
  // const post = await prisma.product.delete({
  //   where: {
  //     id: Number(id),
  //   },
  // });
  // response.json(post);
});
