export type LoginResult = { token: string } | null;

export type RegisterResult =
  | { message: string }
  | import('../../users/schemas/user.schema').UserDocument;
