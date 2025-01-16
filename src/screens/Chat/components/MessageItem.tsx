import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Message} from '../../../utils/types';
import moment from 'moment';
import {useAppStore} from '../../../store';
import {BORDERRADIUS, COLORS, FONTSIZE} from '../../../theme/theme';
import TextMsg from './TextMsg';
import {checkIfImage, checkIfVideo} from '../../../utils/helpers';
// import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import DeleteIcon from '../../../assets/icons/Chat/DeleteIcon';
import DeleteMsg from '../../../components/modals/DeleteMsg';
import ImageComponent from './MessageComponent/ImageComponent';
import VideoComponent from './MessageComponent/VideoComponent';

type MessageItemProps = {
  message: Message;
};

const MessageItem: React.FC<MessageItemProps> = React.memo(({message}) => {
  const loggedInUserId = useAppStore(state => state.id);
  const isSender = message?.sender === loggedInUserId;
  const [showModal, setShowModal] = useState<boolean>(false);

  const renderMsgs = (message: Message) => (
    <View
      style={[
        styles.messageContainer,
        {
          backgroundColor: isSender ? COLORS.Black : COLORS.LightGray2,
        },
      ]}>
      {message.messageType === 'text' && (
        <TextMsg isSender={isSender}>{message.content}</TextMsg>
      )}

      {message.messageType === 'file' && checkIfImage(message.fileUrl) && (
        <ImageComponent fileUrl={message.fileUrl} />
      )}

      {message.messageType === 'file' && checkIfVideo(message.fileUrl) && (
        <VideoComponent fileUrl={message.fileUrl} />
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
            color: isSender ? 'white' : COLORS.Black,
          },
        ]}>
        {moment(message.createdAt).format('H:mm')}
      </Text>
    </View>
  );

  // render delete icon
  const renderRightActions = () => {
    return (
      <View style={styles.renderRightActions}>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <DeleteIcon width={17.5} height={21.5} color={'red'} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      {isSender && message.messageType !== 'deleted' ? (
        <ReanimatedSwipeable
          renderRightActions={renderRightActions}
          overshootRight={false}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: isSender ? 'flex-end' : 'flex-start',
            }}>
            {renderMsgs(message)}
          </View>
        </ReanimatedSwipeable>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: isSender ? 'flex-end' : 'flex-start',
          }}>
          {renderMsgs(message)}
        </View>
      )}

      <DeleteMsg
        msgId={message._id}
        setShowModal={setShowModal}
        showModal={showModal}
      />
    </>
  );
});

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

  // loading: {
  //   width: 220,
  //   height: 150,
  // },
});

export default MessageItem;
