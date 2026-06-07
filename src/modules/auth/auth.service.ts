import bcrypt from "bcryptjs";


import * as authRepo from "../auth/auth.repository";
import { LoginInput, SignupInput } from "../auth/auth.validator";
import { AppError } from "../../utils/AppError";
import { UserRole } from "../../types/enums";
import { signToken } from "../../utils/jwt";


export const signup = async (input: SignupInput) => {
  const existing = await authRepo.findUserByEmail(input.email);
  if (existing) {
    throw new AppError("Email already in use.", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await authRepo.createUser({
    email: input.email,
    passwordHash,
    firstName: input.firstName,
    lastName: input.lastName
  });

  const accessToken = signToken({ userId: user.id, email: user.email, role: user.role });

  return {
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
};

export const login = async (input: LoginInput) => {
  const user = await authRepo.findUserByEmail(input.email);
  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isMatch = await bcrypt.compare(input.password, user.passwordHash);
  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401);
  }

  const accessToken = signToken({ userId: user.id, email: user.email, role: user.role });

  return {
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
};
