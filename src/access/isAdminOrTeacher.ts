import { Access } from "payload/config";

export const isAdminOrTeacher: Access = ({ req: { user } }) => {
  // Need to be logged in
  if (user) {
    // If user has role of 'admin' or 'teacher'
    if (user.roles?.includes('admin') || (user.roles?.includes('teacher'))) {
      return true;
    }

    // If any other type of user, only provide access to themselves
    return {
      id: {
        equals: user.id,
      }
    }
  }

  // Reject everyone else
  return false;
}