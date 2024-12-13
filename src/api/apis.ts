import {API_BASE} from '@env';

export const HOST = API_BASE;

export const AUTH_ROUTES = 'api/auth';
export const SIGNUP_ROUTES = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user_info`;
export const GET_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const CONTACTS_ROUTES = 'api/contacts';
export const SEARCH = `${CONTACTS_ROUTES}/search`;
export const GET_CONTACTS_FOR_DM = `${CONTACTS_ROUTES}/get-contacts-for-dm`;
export const GET_ALL_CONTACTS = `${CONTACTS_ROUTES}/get-all-contacts`;

export const MESSAGES_ROUTES = 'api/messages';
export const GET_ALL_MESSAGES = `${MESSAGES_ROUTES}/get-messages`;
export const UPLOAD_FILE = `${MESSAGES_ROUTES}/upload-files`;

export const CHANNEL_ROUTES = 'api/channels';
export const CREATE_CHANNEL = `${CHANNEL_ROUTES}/create-channel`;
export const GET_USER_CHANNELS = `${CHANNEL_ROUTES}/get-user-channels`;
export const GET_CHANNEL_MESSAGES = `${CHANNEL_ROUTES}/get-channel-messages`;

// export const login = async (values: {username: string; pin: string}) => {
//   const updateKeys = useAppStore(state => state.updateKeys);
//   updateKeys({loading: true});

//   console.log('INside login function');

//   try {
//     const response = await apiClient.post(LOGIN_ROUTE, values);

//     if (response.status === 200) {
//       //   setLoader(false);
//       //   await AsyncStorage.setItem(
//       //     `user${response.data._id}`,
//       //     JSON.stringify(response.data),
//       //   );

//       //   await AsyncStorage.setItem('id', JSON.stringify(response.data._id));
//       //   await AsyncStorage.setItem(
//       //     'token',
//       //     JSON.stringify(response.data.token),
//       //   );
//       //   console.log('THIS IS TOKEN: ', response.data.token);
//       console.log('This is res.data: ', response.data);
//       //   navigation.replace('BottomTabBar');

//       // const newUser = await AsyncStorage.getItem(`user${responseData._id}`);
//       // console.log(newUser);
//     } else {
//       //   Alert.alert('Error Loggin in', 'Please provide valid credentials', [
//       //     {
//       //       text: 'Cancel',
//       //       onPress: () => console.log(),
//       //     },
//       //     {
//       //       text: 'Continue',
//       //       onPress: () => console.log(),
//       //     },
//       //     // { defaultIndex: 1 },
//       //   ]);

//       console.log('This is res.data: ', response.data);
//     }
//   } catch (error) {
//     console.log(error);
//     updateKeys({loading: false});
//   } finally {
//     updateKeys({loading: false});
//   }
// };

// export const register = async (values: {
//   username: string;
//   pin: string;
//   avatar?: number;
// }) => {
//   //   setLoader(true);

//   const {username, pin, avatar = 0} = values;

//   try {
//     const res = await apiClient.post(SIGNUP_ROUTES, {username, pin, avatar});

//     if (res.status === 200) {
//       //   setLoader(false);
//       //   await AsyncStorage.setItem(
//       //     `user${response.data._id}`,
//       //     JSON.stringify(response.data),
//       //   );

//       //   await AsyncStorage.setItem('id', JSON.stringify(response.data._id));
//       //   await AsyncStorage.setItem(
//       //     'token',
//       //     JSON.stringify(response.data.token),
//       //   );
//       //   console.log('THIS IS TOKEN: ', response.data.token);
//       console.log('This is res.data: ', res.data);
//       //   navigation.replace('BottomTabBar');

//       // const newUser = await AsyncStorage.getItem(`user${responseData._id}`);
//       // console.log(newUser);
//     } else {
//       //   Alert.alert('Error Loggin in', 'Please provide valid credentials', [
//       //     {
//       //       text: 'Cancel',
//       //       onPress: () => console.log(),
//       //     },
//       //     {
//       //       text: 'Continue',
//       //       onPress: () => console.log(),
//       //     },
//       //     // { defaultIndex: 1 },
//       //   ]);

//       console.log('This is res.data: ', res.data);
//     }
//   } catch (error) {
//     console.log(error);
//   } finally {
//     // setLoader(false);
//   }
// };
