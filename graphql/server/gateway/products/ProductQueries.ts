
import {
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import { getProducts } from '@server/gateway/products/product-operations';
import Product from '@server/gateway/products/types/ProductType';

const ProductQueries = {
  product: {
    type: new GraphQLNonNull(new GraphQLList(Product)),
    resolve: () => getProducts(),
  },
};

export default ProductQueries;
