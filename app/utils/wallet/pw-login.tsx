import { axiosInstance } from '../axiosInstance';
import StorageLabel from '../../lib/localStorage';

export const isLoggedIn = async () => {
  const token = localStorage.getItem(StorageLabel.AUTH);
  if (!token) return false;

  const valid = await axiosInstance
    .get('/auth/validate-token')
    .then(res => res.data.valid)
    .catch(() => false);

  return valid;
};
