import { User } from 'models';
import { UserInterface } from 'types';

export const checkExistingUser = async (
  email: string,
  password: boolean
): Promise<UserInterface | null> => {
  try {
    const existingUser = await User.findOne({ email })
      .select(password ? '+password' : '-password')
      .lean();

    if (existingUser) return existingUser;

    return null;
  } catch (error) {
    console.log('🚀 ~ checkExistingUser ~ error:', error);
    return null;
  }
};
