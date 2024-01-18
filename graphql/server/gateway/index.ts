import {
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql';

import UserQueries from '@users/UserQueries';
import UserMutations from '@users/UserMutations';
import ProductMutations from '@server/gateway/products/ProductMutations';
import ProductQueries from '@server/gateway/products/ProductQueries';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'query',
    fields: () => ({
      ...UserQueries,
      ...ProductQueries,
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'mutation',
    fields: () => ({
      ...UserMutations,
      ...ProductMutations,
    }),
  }),
});

export default schema;
