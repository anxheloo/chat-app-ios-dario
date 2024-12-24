import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Message} from '../../../utils/types';
import moment from 'moment';
import {useAppStore} from '../../../store';
import {BORDERRADIUS, COLORS, FONTSIZE} from '../../../theme/theme';
import {HOST} from '../../../api/apis';
import TextMsg from './TextMsg';
import Video from 'react-native-video';
import {checkIfImage, checkIfVideo} from '../../../utils/helpers';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import DeleteIcon from '../../../assets/icons/Chat/DeleteIcon';
import DeleteMsg from '../../../components/modals/DeleteMsg';

type MessageItemProps = {
  message: Message;
};

const MessageItem: React.FC<MessageItemProps> = ({message}) => {
  const selectedChatData = useAppStore(state => state.selectedChatData);
  const isSender = message.sender === selectedChatData?._id;
  const [showModal, setShowModal] = useState<boolean>(false);

  const renderMsgs = (message: Message) => (
    <View
      style={[
        styles.messageContainer,
        {
          backgroundColor: isSender ? COLORS.LightGray2 : COLORS.Black,
        },
      ]}>
      {message.messageType === 'text' && (
        <TextMsg isSender={isSender}>{message.content}</TextMsg>
      )}

      {message.messageType === 'file' && checkIfImage(message.fileUrl) && (
        <Image
          source={{uri: `${HOST}/${message.fileUrl}`}}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {message.messageType === 'file' && checkIfVideo(message.fileUrl) && (
        <Video
          source={{uri: `${HOST}/${message.fileUrl}`}}
          style={styles.image}
          controls={true} // Add controls for play/pause/seek
          resizeMode="contain"
        />
      )}

      {message.messageType === 'file' &&
        !checkIfVideo(message.fileUrl) &&
        !checkIfImage(message.fileUrl) && (
          <TouchableOpacity
            onPress={() => {
              console.log('File pressed');
            }}>
            <Text style={styles.fileName}>
              {message.fileUrl.split('/').pop()}
            </Text>
          </TouchableOpacity>
        )}

      {message.messageType === 'deleted' && (
        <TextMsg isSender={isSender}>Message deleted</TextMsg>
      )}

      <Text
        style={[
          styles.messageDate,
          {
            color: isSender ? COLORS.Black : 'white',
          },
        ]}>
        {moment(message.timestamp).format('H:mm')}
      </Text>
    </View>
  );

  // render delete icon
  const renderRightActions = () => {
    return (
      <View style={styles.renderRightActions}>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <DeleteIcon width={17.5} height={21.5} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      {!isSender && message.messageType !== 'deleted' ? (
        <Swipeable
          renderRightActions={renderRightActions}
          overshootRight={false}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: isSender ? 'flex-start' : 'flex-end',
            }}>
            {renderMsgs(message)}
          </View>
        </Swipeable>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: isSender ? 'flex-start' : 'flex-end',
          }}>
          {renderMsgs(message)}
        </View>
      )}
      <DeleteMsg
        msgId={message._id}
        setShowModal={setShowModal}
        showModal={showModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 10,
  },

  messageContainer: {
    borderRadius: BORDERRADIUS.radius_14,
    padding: 2,
    minWidth: 100,
    maxWidth: '70%',
    overflow: 'hidden',
  },

  messageText: {
    fontWeight: 300,
    fontSize: FONTSIZE.sm,
  },

  messageDate: {
    fontWeight: 300,
    fontSize: FONTSIZE.xs,
    alignSelf: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },

  image: {
    width: 220,
    height: 150,
    borderTopLeftRadius: BORDERRADIUS.radius_13,
    borderTopRightRadius: BORDERRADIUS.radius_13,
  },

  fileName: {
    fontSize: FONTSIZE.sm,
    fontWeight: '500',
  },

  renderRightActions: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessageItem;
