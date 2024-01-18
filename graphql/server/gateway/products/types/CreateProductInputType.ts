
import {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
} from 'graphql';
import DateTime from '@gateway/custom-scalars/DateTime';

const CreateProductInputType = new GraphQLInputObjectType({
  name: 'CreateProductInput',
  fields: () => ({
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    price: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
      defaultValue: '',
    },
  }),
});

export default CreateProductInputType;
