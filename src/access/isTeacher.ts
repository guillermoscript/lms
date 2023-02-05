import { Access, FieldAccess } from "payload/types";
import { User } from "../payload-types";

export const isTeacher: Access<any, User> = ({ req: { user } }) => {
  // Return true or false based on if the user has an student role
  return Boolean(user?.roles?.includes('teacher'));
}

export const isTeacherFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({ req: { user } }) => {
  // Return true or false based on if the user has an student role
  return Boolean(user?.roles?.includes('teacher'));
}