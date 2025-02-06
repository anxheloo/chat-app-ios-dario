import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native';
import {BORDERRADIUS, COLORS, FONTSIZE} from '../../theme/theme';
import {apiClient} from '../../api/apiClient';
import {DELETE_MESSAGE} from '../../api/apis';
import {useAppStore} from '../../store';

const DeleteMsg = React.memo(() => {
  const {
    updateFuncChat,
    updateSelectedChatMessages,
    selectedMessageToDelete: selectedMsgToDelete,
    socket,
    id,
  } = useAppStore();

  const isShown = selectedMsgToDelete !== null;
  const msgId = selectedMsgToDelete?._id;

  // Delete Specific message
  const handleDelete = async () => {
    try {
      const res = await apiClient.post(DELETE_MESSAGE, {msgId: msgId});

      if (res.status === 200) {
        console.log('This is the new conversation:', res.data.conversation);

        updateSelectedChatMessages(current =>
          current.map(msg => {
            if (msg._id === msgId) {
              return {
                ...msg,
                messageType: 'deleted',
                content: 'Message deleted',
              };
            }
            return msg;
          }),
        );

        // updateFuncChat({
        //   selectedChatMessages: selectedChatMessages.map(msg => {
        //     if (msg._id === msgId) {
        //       return {
        //         ...msg,
        //         messageType: 'deleted',
        //         content: 'Message deleted',
        //       };
        //     }
        //     return msg;
        //   }),
        // });

        socket?.emit('deleteSpecificMessage', {
          messageId: msgId,
          senderId: id,
          recipientId: res.data.recipientId,
          conversation: res.data.conversation,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to delete the message. Please try again.');
    } finally {
      updateFuncChat({selectedMessageToDelete: null});
    }
  };

  const closeModal = () => {
    // setShowModal(false);
    updateFuncChat({selectedMessageToDelete: null});
  };

  if (!isShown) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Are you sure?</Text>

          <View style={styles.btnContainer}>
            <TouchableOpacity style={[styles.btn]} onPress={closeModal}>
              <Text style={styles.cancelBtn}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.btn, {backgroundColor: 'white'}]}>
              <Text style={styles.deleteBtn}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    backgroundColor: COLORS.LightGray2,
    width: '100%',
    maxWidth: 320,
    height: 120,
    padding: 10,
    borderRadius: BORDERRADIUS.radius_14,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  title: {
    color: COLORS.Black,
    fontSize: FONTSIZE.lg,
    fontWeight: '700',
  },

  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
  },
  btn: {
    width: 130,
    borderRadius: BORDERRADIUS.radius_14,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {fontWeight: '500', fontSize: FONTSIZE.md},
  cancelBtn: {fontWeight: '300', fontSize: FONTSIZE.md},
});

export default DeleteMsg;
