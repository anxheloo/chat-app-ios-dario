import {Platform} from 'react-native';

import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
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

// Record Function
export const onMicPress = async () => {
  const {updateMicSlice, updateMetering} = useAppStore.getState();
  const status = await checkPermissionStatus(permission.microphone);

  console.log('This is status:', status);

  if (!status) {
    console.log('No permmission');
    return;
  }

  updateMicSlice({micPermission: true});

  const audioRecorderPlayer = getAudioPlayer();

  const audioSet: AudioSet = {
    // iOS settings
    AVFormatIDKeyIOS: AVEncodingOption.aac,
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
    AVNumberOfChannelsKeyIOS: 2,

    // Android settings
    AudioSourceAndroid: AudioSourceAndroidType.MIC,
    AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
    OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
  };

  const dirs = ReactNativeBlobUtil.fs.dirs;

  const path =
    Platform.OS === 'ios'
      ? 'recordedAudio.m4a'
      : `${dirs.CacheDir}/recordedAudio.m4a`;

  // const path = Platform.select({
  //   ios: 'recordedAudio.m4a',
  //   android: `${dirs.CacheDir}/recordedAudio.m4a`,
  // });

  try {
    console.log('Inside try catc');
    const result = await audioRecorderPlayer.startRecorder(
      path,
      audioSet,
      true,
    );
    console.log('Recording started at path:', result);

    updateMicSlice({isRecording: true});

    audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      updateMicSlice({
        recordSecs: e.currentPosition,
      });

      if (e.currentMetering) {
        updateMetering(e.currentMetering);
      }
    });

    updateMicSlice({isPlaying: false, playingAudioId: null});
  } catch (e) {
    console.log('THis is error inside onMicPress', e);
  }
};
// Stop Function and upload
export const onMicRelease = async () => {
  const {updateMicSlice, micPermission} = useAppStore.getState();

  if (!micPermission) {
    console.log('No permmission');
    return;
  }

  const audioRecorderPlayer = getAudioPlayer();

  try {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    updateMicSlice({isRecording: false});

    // Upload the audio file to the server immediately
    await uploadAudioMessage(result);

    console.log('Ready to release');
  } catch (error) {
    console.error('Error stopping recording:', error);
  }
};

export const uploadAudioMessage = async (fileUri: string) => {
  const {
    selectedChatData,
    id,
    disappearingMessages,
    updateSelectedChatMessages,
    socket,
    recordSecs,
    waveMetering,
    updateMicSlice,
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
      name: `audio-${Date.now()}.m4a`,
      type: 'audio/m4a',
    });

    // Upload the file to the server
    const response = await apiClient.post(`${HOST}/${UPLOAD_FILE}`, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });

    if (response.status === 200) {
      console.log('Inside 200');
      const uploadedFilePath = response.data.filePaths[0];

      console.log('This is uploadedFilePath:', uploadedFilePath);

      // // Create final message with correct file URL
      const uploadedVoice = {
        ...tempMsg,
        uploading: false,
        fileUrl: uploadedFilePath,
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
  } finally {
    updateMicSlice({
      recordSecs: 0,
      waveMetering: null,
      // longPressed: false,
    });
  }
};

export const onPlayPause = async (messageId: string, filePath: string) => {
  const {playingAudioId, isPlaying, updateMicSlice} = useAppStore.getState();
  const audioRecorderPlayer = getAudioPlayer();

  console.log('This is filepath:', `${HOST}/${filePath}`);

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

    // TEST e.isFinished , also test what e returns in android

    // Start playing the new audio. This keeps listeners going for playing audios.
    await audioRecorderPlayer.startPlayer(`${HOST}/${filePath}`);
    updateMicSlice({playingAudioId: messageId, isPlaying: true});

    audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
      updateMicSlice({
        recordSecs: e.currentPosition,
      });

      if (e.currentPosition >= e.duration || e.isFinished) {
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
