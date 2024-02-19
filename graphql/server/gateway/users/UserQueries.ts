
import {
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import { getUsers } from '@users/users-operations';
import User from '@server/gateway/users/types/UserType';
import UserRoleEnum from '@server/gateway/users/types/UserRoleEnumType';

const UserQueries = {
  users: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
    args: {
      role: {
        type: UserRoleEnum,
      },
    },
    resolve: (_source, { role }) => {
      const result = getUsers();
      if (role != null) {
        return result.filter((user) => user.role === role);
      }
      return result;
    },
  },
};

export default UserQueries;
