import React from 'react';

import {useAppStore} from '../../../store';

import AudioUserDetails from './AudioUserDetails';

import RemoteStream from './RemoteStream';

const AudioVideoTemplate = () => {
  const callType = useAppStore(state => state.callType);
  const callState = useAppStore(state => state.callState);

  if (callType === 'video' && callState === 'active') {
    return <RemoteStream />;
  }

  return <AudioUserDetails />;
};

export default AudioVideoTemplate;
