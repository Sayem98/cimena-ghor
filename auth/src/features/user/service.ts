import { User, IUserAttrs, IUserDoc } from "./model";

export const create = async (userData: IUserAttrs): Promise<IUserDoc> => {
  const user = User.build(userData);
  await user.save();
  return user;
};

export const findUserById = async (id: string): Promise<IUserDoc | null> => {
  return User.findById(id);
};
