import {
  GraphQLObjectType,
  GraphQLNonNull,
} from 'graphql';
import User from '@server/gateway/users/types/UserType';

const CreateUserPayload = new GraphQLObjectType({
  name: 'CreateUserPayload',
  description: 'User type definition',
  fields: () => ({
    user: {
      type: new GraphQLNonNull(User),
    },
  }),
});

export default CreateUserPayload;
