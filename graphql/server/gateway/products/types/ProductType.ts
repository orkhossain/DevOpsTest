import {
  GraphQLString,
  GraphQLID,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFloat,
} from 'graphql';

import DateTime from '@gateway/custom-scalars/DateTime';

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
    },
    price: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    createdAt: {
      type: new GraphQLNonNull(DateTime),
    },
    updatedAt: {
      type: DateTime,
    },
  }),
});

export default ProductType;
