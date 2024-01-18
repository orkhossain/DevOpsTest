import {
  GraphQLObjectType,
  GraphQLNonNull,
} from 'graphql';
import Product from '@server/gateway/products/types/ProductType';

const CreateProductPayload = new GraphQLObjectType({
  name: 'CreateProductPayload',
  description: 'CreateProductPayload type definition',
  fields: () => ({
    product: {
      type: new GraphQLNonNull(Product),
    },
  }),
});

export default CreateProductPayload;
