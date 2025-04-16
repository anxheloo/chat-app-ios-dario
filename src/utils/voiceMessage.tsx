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

declare global {
  interface FormData {
    append(
      name: string,
      value: {uri: string; name: string; type: string},
      filename?: string,
    ): void;
  }
}

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
  console.log('This is press in');
  const {updateMicSlice, updateMetering} = useAppStore.getState();

  const audioRecorderPlayer = getAudioPlayer();
  await audioRecorderPlayer.stopRecorder();
  audioRecorderPlayer.removeRecordBackListener();

  const status = await checkPermissionStatus(permission.microphone);

  if (!status) {
    console.log('No permmission');
    return;
  }

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

  try {
    await audioRecorderPlayer.startRecorder(path, audioSet, true);

    updateMicSlice({isRecording: true});

    audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      updateMicSlice({
        recordSecs: e.currentPosition,
      });

      if (e.currentMetering) {
        updateMetering(e.currentMetering);
      }
    });

    updateMicSlice({
      isPlaying: false,
      playingAudioId: null,
    });
  } catch (e) {
    updateMicSlice({isRecording: false});
    console.log('THis is error inside onMicPress', e);
  }
};
// Stop Function and upload
export const onMicRelease = async () => {
  console.log('This is release');
  const {updateMicSlice, recordSecs, isRecording} = useAppStore.getState();
  const status = await checkPermissionStatus(permission.microphone);

  await new Promise(resolve => setTimeout(resolve, 200));

  if (!isRecording) {
    console.log('No active recording to stop');
    return;
  }

  if (!status) {
    console.log('No permission');
    return;
  }

  const audioRecorderPlayer = getAudioPlayer();
  try {
    if (recordSecs < 1000) {
      console.log('Recording too short, aborting stop');
      await audioRecorderPlayer?.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      updateMicSlice({
        isRecording: false,
      });
      return;
    }

    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

    updateMicSlice({isRecording: false});
    // Upload the audio file to the server immediately
    await uploadAudioMessage(result);
  } catch (error) {
    await audioRecorderPlayer?.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    updateMicSlice({
      isRecording: false,
    });
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
    // downloading: false,
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
      const uploadedFilePath = response.data.filePaths[0];

      updateSelectedChatMessages(current =>
        current.map(msg =>
          msg._id === tempMsg._id
            ? {...msg, isLocalUri: true, uploading: false}
            : msg,
        ),
      );

      // Create final message with correct file URL
      const uploadedVoice = {
        ...tempMsg,
        uploading: false,
        fileUrl: uploadedFilePath,
      };

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
    });
  }
};

export const onPlayPause = async (
  messageId: string,
  filePath: string,
  isLocalUri: boolean,
) => {
  const {playingAudioId, isPlaying, updateMicSlice} = useAppStore.getState();

  const audioRecorderPlayer = getAudioPlayer();

  let playUrl = isLocalUri
    ? filePath
    : await getOrDownloadFile(filePath, messageId);

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

    // Start playing the new audio. This keeps listeners going for playing audios.
    await audioRecorderPlayer.startPlayer(playUrl);
    updateMicSlice({playingAudioId: messageId, isPlaying: true});

    audioRecorderPlayer.addPlayBackListener(async (e: PlayBackType) => {
      updateMicSlice({
        recordSecs: e.currentPosition,
      });

      if (e.currentPosition >= e.duration || e.isFinished) {
        await stopAndClearRecorder();
      }
    });
  } catch (error) {
    stopAndClearRecorder();
    console.error('Error playing voice message:', error);
  }
};

export const getOrDownloadFile = async (fileUrl: string, messageId: string) => {
  const {updateSelectedChatMessages} = useAppStore.getState();

  try {
    const fileName = `${messageId}.m4a`;
    // const localPath =
    //   Platform.OS === 'ios' ? `${fileName}` : `${dirs.CacheDir}/${fileName}`;

    const dirs = ReactNativeBlobUtil.fs.dirs;
    const localPath = `${dirs.CacheDir}/${fileName}`;

    const exists = await ReactNativeBlobUtil.fs.exists(localPath);

    console.log('This file exists?', exists, 'localPath', localPath);
    if (exists) {
      return 'file://' + localPath;
    }

    console.log("After checking, file doesn't exist. Downloading...");

    updateSelectedChatMessages(current =>
      current.map(msg =>
        msg._id === messageId
          ? {
              ...msg,
              downloading: true,
            }
          : msg,
      ),
    );

    const res = await ReactNativeBlobUtil.config({
      fileCache: true,
      path: localPath,
    }).fetch('GET', `${HOST}/${fileUrl}`);

    updateSelectedChatMessages(current =>
      current.map(msg =>
        msg._id === messageId
          ? {
              ...msg,
              isLocalUri: true,
              downloading: false,
              fileUrl: 'file://' + localPath,
            }
          : msg,
      ),
    );

    return 'file://' + res.path();
  } catch (error) {
    console.error('Download failed:', error);
    stopAndClearRecorder();
    throw error;
  }
};

export const stopAndClearRecorder = async () => {
  const {updateMicSlice} = useAppStore.getState();

  const audioPlayer = getAudioPlayer();
  await audioPlayer.stopPlayer();
  audioPlayer.removePlayBackListener();
  updateMicSlice({
    playingAudioId: null,
    isPlaying: false,
    recordSecs: 0,
  });
};
