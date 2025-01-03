import { axiosInstance } from '../axiosInstance';
import StorageLabel from '../../lib/localStorage';

export const isLoggedIn = async () => {
  if (!localStorage.getItem(StorageLabel.AUTH) || !localStorage.getItem(StorageLabel.LOGGED_IN_GITHUB_HANDLE)) return false;
  try {
    const { data } = await axiosInstance.get<Number>('/auth/isloggedin');
    return data;
  }
  catch (err) {
    return false;
  }
};
