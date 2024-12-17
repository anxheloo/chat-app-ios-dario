import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Message} from '../../../utils/types';
import moment from 'moment';
import {useAppStore} from '../../../store';
import {BORDERRADIUS, COLORS, FONTSIZE} from '../../../theme/theme';

type MessageItemProps = {
  message: Message;
};

const MessageItem: React.FC<MessageItemProps> = ({message}) => {
  const selectedChatData = useAppStore(state => state.selectedChatData);

  let lastDate: string | null = null;
  const messageDate = moment(message.timestamp).format('YYYY-MM-DD');
  const showDate = messageDate !== lastDate;
  lastDate = messageDate;

  const renderDmMessages = (message: Message) => (
    <View style={styles.messageContainer}>
      {message.messageType === 'text' && (
        <Text style={styles.messageText}>{message.content}</Text>
      )}

      {/* {message.messageType === 'file' && (
            <div
            // className={`${
            //   message.sender !== selectedChatData?._id
            //     ? 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50'
            //     : 'bg-[#2a2b33]/5 text-white/80 border-white/20'
            // } border inline-block p-4 rounded max-w-[50%] break-words`}
            >
              {checkIfImage(message.fileUrl) ? (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setShowImage(true);
                    setImageUrl(message.fileUrl);
                  }}>
                  <img
                    src={`${HOST}/${message.fileUrl}`}
                    alt="file display"
                    className=" size-[300px]"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <span className="tet-white/80 text-3xl bg-black/20 rounded-full p-3">
                    <GoFileZip />
                  </span>
                  <span>{message.fileUrl.split('/').pop()}</span>
                  <span
                    className="text-3xl cursor-pointer hover:opacity-80"
                    onClick={() => downloadFile(message.fileUrl)}>
                    <MdDownloadForOffline />
                  </span>
                </div>
              )}
            </div>
          )} */}

      <Text style={styles.messageDate}>
        {moment(message.timestamp).format('LT')}
      </Text>
    </View>
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent:
          message.sender._id === selectedChatData?._id
            ? 'flex-start'
            : 'flex-end',
      }}>
      {/* {showDate && (
        <Text style={styles.dateContainer}>
          {moment(message.timestamp).format('LL')}
        </Text>
      )}  */}
      {renderDmMessages(message)}
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
    backgroundColor: COLORS.Black,
    borderRadius: BORDERRADIUS.radius_14,
    padding: 10,
    minWidth: 100,
    maxWidth: '45%',
  },

  messageText: {
    color: 'white',
    fontWeight: 300,
    fontSize: FONTSIZE.sm,
  },

  messageDate: {
    color: 'white',
    fontWeight: 300,
    fontSize: FONTSIZE.xs,
    alignSelf: 'flex-end',
    paddingTop: 10,
  },
});

export default MessageItem;
