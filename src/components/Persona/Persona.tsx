import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Avatar from './Avatar';
import {useAppStore} from '../../store';
import {Contact, NavigationProps} from '../../utils/types';
import {COLORS, FONTSIZE} from '../../theme/theme';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import DeleteIcon from '../../assets/icons/Chat/DeleteIcon';
import {DELETE_FRIEND} from '../../api/apis';
import {apiClient} from '../../api/apiClient';

type PersonaProps = {
  contact: Contact;
  navigation?: NavigationProps;
  backgroundColor?: string;
  cancel?: () => void;
  version?: string;
};

const Persona: React.FC<PersonaProps> = ({
  contact,
  navigation,
  backgroundColor,
  cancel,
  version,
}) => {
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const senderId = useAppStore(state => state.id);
  const senderUsername = useAppStore(state => state.username);
  const token = useAppStore(state => state.token);
  const socket = useAppStore(state => state.socket);
  const updateFriends = useAppStore(state => state.updateFriends);
  const [loading, setLoading] = useState(false);

  console.log('THis is contact:', contact);
  console.log('This is contact._id inside Persona', contact._id);

  // Select contact to update chat
  const selectContact = () => {
    updateFuncChat({selectedChatData: contact});
    navigation?.navigate('Chat');

    if (cancel) {
      cancel();
    }
  };

  const deleteContact = useCallback(async () => {
    setLoading(true);

    try {
      const res = await apiClient.post(
        DELETE_FRIEND,
        {friendId: contact._id},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 200) {
        setLoading(false);
        updateFriends(current =>
          current.filter(item => item._id !== contact._id),
        );

        socket?.emit('deleteFriend', {
          senderId: senderId,
          friendId: contact._id,
          senderUsername,
        });
      }
    } catch (error: any) {
      setLoading(false);
      Alert.alert(error.response.data.message, 'Please try again.');
    }
  }, [contact._id, senderId, senderUsername, socket, token, updateFriends]);

  const renderRightActions = useCallback(() => {
    if (version && version === 'search') {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={deleteContact}
        style={styles.renderRightActions}>
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <DeleteIcon width={17.5} height={21.5} color={'#FFFFFF'} />
        )}
      </TouchableOpacity>
    );
  }, [version, deleteContact, loading]);

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <TouchableOpacity
        activeOpacity={1}
        style={[
          version && version === 'search'
            ? styles.container
            : styles.containerVersion2,
          {backgroundColor: backgroundColor ?? 'transparent'},
        ]}
        onPress={selectContact}>
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
      </TouchableOpacity>
    </Swipeable>
  );
};

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
