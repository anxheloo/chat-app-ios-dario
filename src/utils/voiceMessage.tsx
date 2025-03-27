import {Platform} from 'react-native';

import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  OutputFormatAndroidType,
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';

import ReactNativeBlobUtil from 'react-native-blob-util';

import {useAppStore} from '../store';

import {checkPermissionStatus} from './helpers';

import {permission} from './permissions';

import {ObjectId} from 'bson';

import {HOST, UPLOAD_FILE} from '../api/apis';
import {apiClient} from '../api/apiClient';

// ====================================================
// Voice recording
// ====================================================

export const getAudioPlayer = (() => {
  let instance: AudioRecorderPlayer | null = null;
  return () => {
    if (!instance) {
      instance = new AudioRecorderPlayer();
    }
    return instance;
  };
})();

export const getAudioPermissions = async () => {
  console.log('PRESSED IN');
  await checkPermissionStatus(permission.microphone);

  return;
};

// Record Function
export const onMicPress = async () => {
  const {updateMicSlice, updateMetering} = useAppStore.getState();
  const status = await checkPermissionStatus(permission.microphone);

  console.log('LONG PRESSED');

  if (!status) {
    console.log('No permmission');
    return;
  }

  updateMicSlice({longPressed: true});

  const audioRecorderPlayer = getAudioPlayer();

  updateMicSlice({isRecording: true});

  const audioSet: AudioSet = {
    AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
    AudioSourceAndroid: AudioSourceAndroidType.MIC,
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
    AVNumberOfChannelsKeyIOS: 2,
    AVFormatIDKeyIOS: AVEncodingOption.aac,
    OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
  };
  const meteringEnabled = true;

  // const path = 'recordedAudio.m4a';

  const dirs = ReactNativeBlobUtil.fs.dirs;

  const path = Platform.select({
    ios: 'recordedAudio.m4a',
    // android: `${dirs.CacheDir}/recordedAudio.mp3`,
    android: `${dirs.CacheDir}/recordedAudio.m4a`,
  });

  // const path =
  //   Platform.OS === 'android'
  //     ? `${dirs.CacheDir}/recordedAudio.m4a`
  //     : 'recordedAudio.m4a';

  try {
    const uri = await audioRecorderPlayer.startRecorder(
      path,
      audioSet,
      meteringEnabled,
    );

    console.log('THis is uri inside onMicPress: ' + uri);

    audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      updateMicSlice({
        recordSecs: e.currentPosition / 1000,
      });

      if (e.currentMetering) {
        console.log(
          'This is e.currentMetering for android: ' + e.currentMetering,
        );
        updateMetering(e.currentMetering);
      }
    });
  } catch (e) {
    console.log('THis is error inside onMicPress', e);
  }
};
// Stop Function and upload
export const onMicRelease = async () => {
  const {updateMicSlice, longPressed} = useAppStore.getState();
  const status = await checkPermissionStatus(permission.microphone);

  console.log('RELEASED');

  if (status && longPressed) {
    updateMicSlice({isRecording: false});

    const audioRecorderPlayer = getAudioPlayer();

    try {
      const result = await audioRecorderPlayer.stopRecorder();
      console.log('Recording stopped. File saved at:', result);
      audioRecorderPlayer.removeRecordBackListener();

      // Upload the audio file to the server immediately
      await uploadAudioMessage(result);

      updateMicSlice({
        recordSecs: 0,
        waveMetering: null,
        longPressed: false,
      });
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  } else {
    return;
  }
};

export const uploadAudioMessage = async (fileUri: string) => {
  console.log('This is fileUri: ' + fileUri);

  // let correctedUri = fileUri;

  // // ✅ Fix incorrect file URI format on Android
  // if (Platform.OS === 'android') {
  //   correctedUri = fileUri.replace('file:////', 'file:///'); // Remove extra slash
  // }

  const {
    selectedChatData,
    id,
    disappearingMessages,
    updateSelectedChatMessages,
    socket,
    recordSecs,
    waveMetering,
  } = useAppStore.getState();

  // Create a temporary message object
  const tempMsg = {
    _id: new ObjectId().toString(),
    conversationId: selectedChatData?.conversationId || '',
    sender: id,
    recipient: selectedChatData?._id || '',
    createdAt: new Date().toISOString(),
    messageType: 'audio',
    fileUrl: fileUri,
    expiresAt: disappearingMessages.value,
    uploading: true,
    duration: recordSecs,
    waveMetering: waveMetering,
  };

  // Update UI with pending message
  updateSelectedChatMessages(current => [...current, tempMsg]);

  try {
    // Prepare the FormData for upload
    const formData = new FormData();
    formData.append('files', {
      uri: fileUri,
      // uri: correctedUri,
      name: `audio-${Date.now()}.m4a`,
      type: 'audio/m4a',
      // name: `audio-${Date.now()}.${Platform.OS === 'ios' ? 'm4a' : 'mp3'}`,
      // type: `audio/${Platform.OS === 'ios' ? 'm4a' : 'mp3'}`,
    });

    // Upload the file to the server
    const response = await apiClient.post(`${HOST}/${UPLOAD_FILE}`, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });

    if (response.status === 200) {
      const uploadedFilePath = response.data.filePaths;

      // // Create final message with correct file URL
      const uploadedVoice = {
        ...tempMsg,
        uploading: false,
        fileUrl: `${HOST}/${uploadedFilePath}`,
      };

      console.log('This is uploadedVoice:', uploadedVoice);

      // // Update UI and emit the message via Socket.io
      updateSelectedChatMessages(current =>
        current.map(msg => (msg._id === tempMsg._id ? uploadedVoice : msg)),
      );

      socket?.emit('sendMessage', {messages: [uploadedVoice]});
    }
  } catch (error) {
    console.error('Failed to upload audio message:', error);
    updateSelectedChatMessages(current =>
      current.filter(msg => msg._id !== tempMsg._id),
    );
  }
};

export const onPlayPause = async (messageId: string, filePath: string) => {
  const {playingAudioId, isPlaying, updateMicSlice} = useAppStore.getState();
  const audioRecorderPlayer = getAudioPlayer();

  try {
    // If the same message is playing, toggle pause/play
    if (playingAudioId === messageId) {
      if (isPlaying) {
        await audioRecorderPlayer.pausePlayer();
        updateMicSlice({isPlaying: false});
      } else {
        await audioRecorderPlayer.resumePlayer();
        updateMicSlice({isPlaying: true});
      }
      return;
    }

    // If another audio is playing, stop it first
    if (playingAudioId && playingAudioId !== messageId) {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();

      updateMicSlice({
        recordSecs: 0,
      });
    }

    // Start playing the new audio
    await audioRecorderPlayer.startPlayer(filePath);
    updateMicSlice({playingAudioId: messageId, isPlaying: true});

    audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
      updateMicSlice({
        recordSecs: e.currentPosition / 1000,
      });

      if (e.currentPosition >= e.duration) {
        audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
        // Stop when finished
        updateMicSlice({
          isPlaying: false,
          playingAudioId: null,
          recordSecs: 0,
        });
      }
    });
  } catch (error) {
    console.error('Error playing voice message:', error);
  }
};
