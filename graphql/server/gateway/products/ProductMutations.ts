import {
  GraphQLNonNull,
} from 'graphql';
import { createProduct } from '@server/gateway/products/product-operations';
import CreateProductInputType from '@server/gateway/products/types/CreateProductInputType';
import CreateProductPayload from '@server/gateway/products/types/CreateProductPayloadType';

const ProductMutations = {
  createProduct: {
    type: CreateProductPayload,
    args: {
      input: {
        type: new GraphQLNonNull(CreateProductInputType),
      },
    },
    resolve: async (_source, { input }) => {
      const createdProduct = await createProduct(input);
      return {product: createdProduct}
    
  },
}}

export default ProductMutations;
