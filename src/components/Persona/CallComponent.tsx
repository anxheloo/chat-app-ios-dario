import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableHighlight,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Avatar from './Avatar';
import {useAppStore} from '../../store';

import {DELETE_CALL} from '../../api/apis';
import {apiClient} from '../../api/apiClient';

import {handleCall} from '../../utils/webrtc';
import {Call, Contact, NavigationProps} from '../../types/types';
import {timeCalendarFormat} from '../../utils/helpers';
import {COLORS, FONTSIZE} from '../../theme/theme';

import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import DeleteIcon from '../../assets/icons/Chat/DeleteIcon';

type ConversationsProps = {
  call: Call;
  navigation?: NavigationProps;
  backgroundColor?: string;
  cancel?: () => void;
};

const CallComponent: React.FC<ConversationsProps> = React.memo(
  ({call, backgroundColor}) => {
    const {id: loggedInUserId, updateConfirmationModal} =
      useAppStore.getState();
    const [loading, setLoading] = useState(false);

    const receiver = useMemo(() => {
      return call?.participants?.find(
        (user: Contact) => user._id !== loggedInUserId,
      );
    }, [call?.participants, loggedInUserId]);

    const isCaller = loggedInUserId === call?.participants?.[0]?._id;

    // Select contact to update chat
    const selectCall = useCallback(() => {
      const {updateFuncChat} = useAppStore.getState();
      updateFuncChat({selectedChatData: receiver});
      handleCall();
    }, [receiver]);

    // Render call status
    const renderCallStatus = useMemo(() => {
      let text = '';
      let textStyle = styles.incomingOutgoing;

      if (isCaller) {
        text = `Outgoing ${call.callType} call`;
      } else {
        switch (call.callStatus) {
          case 'missed':
            text = `Missed ${call.callType} call`;
            textStyle = styles.missedCall;
            break;
          default:
            text = `Incoming ${call.callType} call`;
        }
      }

      return <Text style={textStyle}>{text}</Text>;
    }, [call.callStatus, call.callType, isCaller]);

    // Delete Call
    const deleteCall = useCallback(async () => {
      const {updateCalls} = useAppStore.getState();

      setLoading(true);

      try {
        const res = await apiClient.post(DELETE_CALL, {
          callId: call?._id,
        });

        if (res.status === 200) {
          updateCalls(currentCalls => [
            ...currentCalls.filter(item => item?._id !== call?._id),
          ]);
        }
      } catch (error) {
        console.log('Error deleting call:', error);
        Alert.alert('Could not delete the call. Please try again.');
      } finally {
        setLoading(false);
      }
    }, [call?._id]);

    // Delete Call UI
    const renderRightActions = useCallback(() => {
      return (
        <TouchableOpacity
          onPress={() => {
            updateConfirmationModal({
              confirmationModalSlice: {
                title: 'Delete Call?',
                onConfirm: deleteCall,
              },
            });
          }}
          style={[styles.renderRightActions]}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <DeleteIcon width={17.5} height={21.5} color={'#FFFFFF'} />
          )}
        </TouchableOpacity>
      );
    }, [deleteCall, loading, updateConfirmationModal]);

    if (!receiver) {
      return null;
    }

    return (
      <ReanimatedSwipeable
        friction={2}
        renderRightActions={renderRightActions}
        overshootRight={false}
        key={call._id}>
        <TouchableHighlight
          underlayColor={'white'}
          activeOpacity={1}
          style={[
            styles.container,
            {backgroundColor: backgroundColor ?? 'transparent'},
          ]}
          onPress={selectCall}>
          <>
            <Avatar
              width={46}
              height={46}
              avatarWidth={34}
              avatarHeight={34}
              backgroundColor={COLORS.LightGray2}
              src={receiver?.avatar}
            />
            <View style={styles.secondContainer}>
              <Text style={styles.username}>@{receiver?.username}</Text>
              <View>{renderCallStatus}</View>
            </View>

            <Text style={[styles.messageDate]}>
              {timeCalendarFormat(call?.createdAt)}
            </Text>
          </>
        </TouchableHighlight>
      </ReanimatedSwipeable>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LightGray2,
  },

  secondContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 6,
  },

  username: {
    fontWeight: '300',
    flex: 1,
  },

  lastMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    fontSize: FONTSIZE.sm,
    color: COLORS.LightGray,
    maxWidth: 200,
  },

  messageDate: {
    fontWeight: '300',
    fontSize: FONTSIZE.sm,
    color: 'black',
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },

  renderRightActions: {
    paddingHorizontal: 10,
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },

  missedCall: {
    color: '#FF675C',
    fontSize: FONTSIZE.sm,
    fontWeight: '300',
  },

  incomingOutgoing: {
    color: COLORS.LightGray,
    fontSize: FONTSIZE.sm,
    fontWeight: '300',
  },
});

export default CallComponent;
