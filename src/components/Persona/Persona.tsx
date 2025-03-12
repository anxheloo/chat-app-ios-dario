import React, {memo, useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import {useAppStore} from '../../store';
import Avatar from './Avatar';

import {COLORS, FONTSIZE} from '../../theme/theme';
import {Contact} from '../../utils/types';

import ReanimatedSwipable from 'react-native-gesture-handler/ReanimatedSwipeable';

import {DELETE_FRIEND} from '../../api/apis';
import {apiClient} from '../../api/apiClient';
import {navigate} from '../../navigation/navigationRef';

import DeleteIcon from '../../assets/icons/Chat/DeleteIcon';
import {handleCall} from '../../utils/webrtc';

type PersonaProps = {
  contact: Contact;
  backgroundColor?: string;
  cancel?: () => void;
  version?: string;
  type?: 'call' | 'message';
};

const Persona: React.FC<PersonaProps> = memo(
  ({contact, backgroundColor, cancel, version, type}) => {
    const socket = useAppStore(state => state.socket);
    const [loading, setLoading] = useState(false);

    // Select contact to update chat data and navigate to chat screen
    const selectContact = useCallback(() => {
      console.log('Inside select Contacts');
      const {updateFuncChat, updateKeys} = useAppStore.getState();
      updateKeys({bottomSheetType: null});
      cancel?.();
      updateFuncChat({selectedChatData: contact});
      type === 'call' ? handleCall() : navigate('Chat');
    }, [cancel, contact, type]);

    const deleteContact = useCallback(async () => {
      console.log('Inside delete contanct');
      const {
        updateFriends,
        id: senderId,
        username: senderUsername,
      } = useAppStore.getState();

      setLoading(true);

      try {
        const res = await apiClient.post(DELETE_FRIEND, {
          friendId: contact?._id,
        });

        if (res.status === 200) {
          console.log('Inside delete contanct status 200');
          updateFriends(current =>
            current.filter(item => item._id !== contact._id),
          );

          await socket?.emit('deleteFriend', {
            senderId,
            friendId: contact?._id,
            senderUsername,
          });
        }
      } catch (error: any) {
        Alert.alert(error.response.data.message, 'Please try again.');
      } finally {
        setLoading(false);
      }
    }, [contact._id, socket]);

    const renderRightActions = useCallback(() => {
      if (version && version === 'search') {
        return null;
      }

      return (
        <TouchableOpacity
          onPress={deleteContact}
          style={[styles.renderRightActions]}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <DeleteIcon width={17.5} height={21.5} color={'#FFFFFF'} />
          )}
        </TouchableOpacity>
      );
    }, [version, deleteContact, loading]);

    return (
      <ReanimatedSwipable
        friction={2}
        renderRightActions={renderRightActions}
        overshootRight={false}
        key={contact._id}>
        <TouchableHighlight
          underlayColor={'white'}
          activeOpacity={1}
          style={[
            version && version === 'search'
              ? styles.container
              : styles.containerVersion2,
            {backgroundColor: backgroundColor ?? 'transparent'},
          ]}
          onPress={selectContact}>
          <>
            <Avatar
              width={36}
              height={36}
              avatarWidth={27}
              avatarHeight={27}
              backgroundColor={COLORS.LightGray2}
              src={contact.avatar}
            />
            <View style={styles.secondContainer}>
              <Text style={styles.username}>@{contact.username}</Text>
            </View>
          </>
        </TouchableHighlight>
      </ReanimatedSwipable>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    gap: 15,
  },

  containerVersion2: {
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
});

export default Persona;
