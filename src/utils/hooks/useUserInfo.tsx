import {useEffect} from 'react';
import {getUserInfo} from '../DataFetching';

const useUserInfo = () => {
  //Get user info
  useEffect(() => {
    getUserInfo();
  }, []);
};

export default useUserInfo;
