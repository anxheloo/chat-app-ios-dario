import React, {useEffect} from 'react';
import {KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import ChatHeader from './components/ChatHeader';
import ChatContainer from './components/ChatContainer';
import ChatFooter from './components/ChatFooter';
import {useAppStore} from '../../store';
import {SafeAreaView} from 'react-native-safe-area-context';

const Chat = () => {
  const updateFuncChat = useAppStore(state => state.updateFuncChat);

  useEffect(() => {
    return () => {
      updateFuncChat({selectedChatMessages: [], selectedChatData: null});
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{flex: 1}}
      keyboardVerticalOffset={-30}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.container}>
          <ChatHeader />
          <ChatContainer />
          <ChatFooter />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Chat;

// import * as React from 'react';
// import {
//   Image,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   View,
// } from 'react-native';
// import {DemoButton, DemoResponse, DemoTitle} from './components';

// import * as ImagePicker from 'react-native-image-picker';

// type ImagePickerType = 'capture' | 'library';

// export default function App() {
//   const [response, setResponse] = React.useState<any>(null);

//   const onButtonPress = React.useCallback(
//     (type: ImagePickerType, options: any) => {
//       if (type === 'capture') {
//         ImagePicker.launchCamera(options, setResponse);
//       } else {
//         ImagePicker.launchImageLibrary(options, setResponse);
//       }
//     },
//     [],
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <DemoTitle>🌄 React Native Image Picker</DemoTitle>
//       <ScrollView>
//         <View style={styles.buttonContainer}>
//           {actions.map(({title, type, options}) => {
//             return (
//               <DemoButton
//                 key={title}
//                 onPress={() => onButtonPress(type, options)}>
//                 {title}
//               </DemoButton>
//             );
//           })}
//         </View>
//         <DemoResponse>{response}</DemoResponse>

//         {response?.assets &&
//           response?.assets.map(({uri}: {uri: string}) => (
//             <View key={uri} style={styles.imageContainer}>
//               <Image
//                 resizeMode="cover"
//                 resizeMethod="scale"
//                 style={styles.image}
//                 source={{uri: uri}}
//               />
//             </View>
//           ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'aliceblue',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginVertical: 8,
//   },
//   imageContainer: {
//     marginVertical: 24,
//     alignItems: 'center',
//   },
//   image: {
//     width: 200,
//     height: 200,
//   },
// });

// interface Action {
//   title: string;
//   type: 'capture' | 'library';
//   options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
// }

// const actions: Action[] = [
//   // {
//   //   title: 'Take Image',
//   //   type: 'capture',
//   //   options: {
//   //     saveToPhotos: true,
//   //     mediaType: 'photo',
//   //     includeBase64: false,
//   //     includeExtra,
//   //   },
//   // },
//   // {
//   //   title: 'Select Image',
//   //   type: 'library',
//   //   options: {
//   //     selectionLimit: 0,
//   //     mediaType: 'photo',
//   //     includeBase64: false,
//   //     includeExtra,
//   //   },
//   // },
//   // {
//   //   title: 'Take Video',
//   //   type: 'capture',
//   //   options: {
//   //     saveToPhotos: true,
//   //     formatAsMp4: true,
//   //     mediaType: 'video',
//   //     includeExtra,
//   //   },
//   // },
//   // {
//   //   title: 'Select Video',
//   //   type: 'library',
//   //   options: {
//   //     selectionLimit: 0,
//   //     mediaType: 'video',
//   //     formatAsMp4: true,
//   //     includeExtra,
//   //   },
//   // },

//   {
//     title: 'Take mixed Content',
//     type: 'capture',
//     options: {
//       selectionLimit: 0,
//       mediaType: 'mixed',
//       formatAsMp4: true,
//       includeExtra,
//       quality: 0.5,
//     },
//   },
//   {
//     title: 'Select Image or Video\n(mixed)',
//     type: 'library',
//     options: {
//       selectionLimit: 0,
//       mediaType: 'mixed',
//       includeExtra,
//       quality: 0.3,
//     },
//   },
// ];

// if (Platform.OS === 'ios') {
//   actions.push({
//     title: 'Take Image or Video\n(mixed)',
//     type: 'capture',
//     options: {
//       saveToPhotos: true,
//       mediaType: 'mixed',
//       includeExtra,
//       presentationStyle: 'fullScreen',
//     },
//   });
// }
