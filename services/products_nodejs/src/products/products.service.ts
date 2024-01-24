import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
type ProductRead = {
  id: number;
  title: string;
  price: number;
  description: string;
};

type ProductWrite = {
  title: string;
  description: string;
  price: number;
};

export const listProducts = async (): Promise<ProductRead[]> => {
  return prisma.product.findMany({});
};

export const getProduct = async (id: number): Promise<ProductRead | null> => {
  return prisma.product.findUnique({
    where: {
      id,
    },
  });
};

export const createProduct = async (
  Product: ProductWrite
): Promise<ProductRead> => {
  const { title, description, price } = Product;
  console.log( title, description, price)

  return prisma.product.create({
    data: {
      title,
      price,
      description,
    },
  });
};

export const updateProduct = async (
  Product: ProductRead,
  id: number
): Promise<ProductRead> => {
  const { title, description } = Product;
  return prisma.product.update({
    where: {
      id,
    },
    data: {
      title,
    },
  });
};

export const deleteProduct = async (id: number): Promise<void> => {
  await prisma.product.delete({
    where: {
      id,
    },
  });
};

