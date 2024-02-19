
import {
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import isEmail from 'validator/lib/isEmail';
import { createUser, createUsers } from '@users/users-operations';
import CreateUserInput from '@server/gateway/users/types/CreateUserInputType';
import CreateUserPayload from '@server/gateway/users/types/CreateUserPayload';
import CreateUsersPayload from '@server/gateway/users/types/CreateUsersPayload';

const UserMutations = {
  createUser: {
    type: CreateUserPayload,
    args: {
      input: {
        type: new GraphQLNonNull(CreateUserInput),
      },
    },
    resolve: (_source, args) => {
      const { input } = args;

      if (input.email && !isEmail(input.email)) {
        throw new Error('Email is not in valid format');
      }
      return {
        user: createUser(input),
      };
    },
  },
  createUsers: {
    type: CreateUsersPayload,
    args: {
      input: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CreateUserInput))),
      },
    },
    resolve: (_source, { input }) => {
      const createdUsers = createUsers(input);
      return {
        users: createdUsers,
      };
    },
  },
};

export default UserMutations;
