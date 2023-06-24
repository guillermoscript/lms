import { Access } from "payload/config";

export const isAdminOrSelf: any = ({ req: { user } }: any) => {
  // Need to be logged in
  if (user) {
    // If user has role of 'admin'
    if (user.roles?.includes('admin')) {
      return true;
    }

    // If any other type of user, only provide access to themselves
    return {
      or: [
        {
          createdBy: {
            equals: user.id,
          },
        },
        {
          user: {
            equals: user.id,
          },
        },
        {
          student: {
            equals: user.id,
          },
        },
        {
          teacher: {
            equals: user.id,
          },
        },
        {
          id: {
            equals: user.id,
          },
        }
      ],
    }
  }

  // Reject everyone else
  return false;
}