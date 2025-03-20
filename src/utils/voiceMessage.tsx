import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  OutputFormatAndroidType,
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player'; //   type RecordBackType, //   type PlayBackType, //   type AudioSet, //   OutputFormatAndroidType, //   AVEncodingOption, //   AVEncoderAudioQualityIOSType, //   AudioSourceAndroidType, //   AudioEncoderAndroidType,
// import {Dirs} from 'react-native-file-access';

import {checkPermissionStatus} from './helpers';
import {permission} from './permissions';
import {useAppStore} from '../store';
import {ObjectId} from 'bson';
// import {Message} from './types';
import {HOST, UPLOAD_FILE} from '../api/apis';
import {apiClient} from '../api/apiClient';
// import {Platform} from 'react-native';

// ====================================================
// Voice recording
// ====================================================

// const audioRecorderPlayer = new AudioRecorderPlayer();

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

  if (!status) {
    return;
  }

  const audioRecorderPlayer = getAudioPlayer();

  console.log('Microphone permission granted');
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

  const path = 'recordedAudio.m4a';

  try {
    const uri = await audioRecorderPlayer.startRecorder(
      path,
      audioSet,
      meteringEnabled,
    );

    audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      updateMicSlice({
        recordSecs: e.currentPosition / 1000,
        recordTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      });

      if (e.currentMetering) {
        updateMetering(e.currentMetering);
      }
    });

    console.log('THis is uri inside onMicPress: ' + uri);
  } catch (e) {
    console.log('THis is error inside onMicPress', e);
  }
};
// Stop Function and upload
export const onMicRelease = async () => {
  const {updateMicSlice} = useAppStore.getState();
  updateMicSlice({isRecording: false});

  const audioRecorderPlayer = getAudioPlayer();

  try {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

    console.log('Recording stopped. File saved at:', result);

    // Upload the audio file to the server immediately
    await uploadAudioMessage(result);

    updateMicSlice({
      recordSecs: 0,
      recordTime: '',
      waveMetering: null,
    });
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
  } = useAppStore.getState();

  // Create a temporary message object
  const tempMsg = {
    _id: new ObjectId().toString(),
    conversationId: selectedChatData?.conversationId || '',
    sender: id,
    recipient: selectedChatData?._id || '',
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    messageType: 'audio',
    fileUrl: fileUri,
    expiresAt: disappearingMessages,
    uploading: true,
    duration: recordSecs,
    waveMetering: waveMetering,
  };

  console.log('This is tempMsg inside upload audio msg:', tempMsg);

  console.log('This is waveMetering inside upload audio msg:', waveMetering);

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
      const uploadedFilePath = response.data.filePaths;

      console.log('This is uploadedFilePath:', uploadedFilePath);

      // Create final message with correct file URL
      const uploadedVoice = {
        ...tempMsg,
        uploading: false,
        fileUrl: `${HOST}/${uploadedFilePath}`,
      };

      // Update UI and emit the message via Socket.io
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
    if (playingAudioId === messageId) {
      // If the same message is playing, toggle pause
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
    }

    // Start playing the new audio
    await audioRecorderPlayer.startPlayer(filePath);
    updateMicSlice({playingAudioId: messageId, isPlaying: true});

    audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
      updateMicSlice({
        recordSecs: e.currentPosition / 1000,
        recordTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      });

      console.log('This is duration:', e.duration);

      if (e.currentPosition >= e.duration) {
        // Stop when finished
        updateMicSlice({isPlaying: false, playingAudioId: null});
        audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
      }
    });
  } catch (error) {
    console.error('Error playing voice message:', error);
  }
};
