import { AppError } from "../../utils/AppError";
import { UserRepository } from "./user.repository";


export const UserService = {
  getAllUsers: async () => {
    return await UserRepository.findAll();
  },

  getUserById: async (id: string) => {
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  },

  updateUser: async (id: string, payload: any) => {
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return await UserRepository.update(id, payload);
  },

  deleteUser: async (id: string) => {
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return await UserRepository.delete(id);
  },
};