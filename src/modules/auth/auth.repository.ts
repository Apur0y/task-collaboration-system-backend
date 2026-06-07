import prisma from "../../config/database";
import { UserRole } from "../../types/enums";


export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const createUser = async (data: {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName:string
}) => {
  return prisma.user.create({ data });
};
