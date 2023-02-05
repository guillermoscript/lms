import { Access } from "payload/config";

export const isSelf: Access = ({ req: { user } }) => {
  // Need to be logged in
  if (user) {
    // only provide access to themselves
    return {
      id: {
        equals: user.id,
      }
    }
  }

  // Reject everyone else
  return false;
}