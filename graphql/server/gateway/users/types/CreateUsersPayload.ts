import {
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';
import User from '@server/gateway/users/types/UserType';

const CreateUsersPayload = new GraphQLObjectType({
  name: 'CreateUsersPayload',
  description: 'User type definition',
  fields: () => ({
    users: {
      type: new GraphQLList(User),
    },
  }),
});

export default CreateUsersPayload;
