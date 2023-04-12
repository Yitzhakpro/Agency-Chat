import { hash, compare } from 'bcrypt';

export const hashWithSalt = async (
  text: string,
  saltRounds = 10
): Promise<string> => {
  const hashedText = await hash(text, saltRounds);

  return hashedText;
};

export const compareHash = async (
  plainText: string,
  hash: string
): Promise<boolean> => {
  return compare(plainText, hash);
};
