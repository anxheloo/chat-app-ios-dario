import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {BORDERRADIUS, COLORS, FONTSIZE} from '../../theme/theme';
import {apiClient} from '../../api/apiClient';
import {DELETE_MESSAGE} from '../../api/apis';
import {useAppStore} from '../../store';

type DeleteMsgProps = {
  msgId: string;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
};

const DeleteMsg: React.FC<DeleteMsgProps> = ({
  msgId,
  setShowModal,
  showModal,
}) => {
  const token = useAppStore(state => state.token);
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const {selectedChatMessages} = useAppStore.getState();

  const handleDelete = async () => {
    try {
      const res = await apiClient.post(
        DELETE_MESSAGE,
        {msgId: msgId},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 200) {
        console.log(res.data.message);

        updateFuncChat({
          selectedChatMessages: selectedChatMessages.map(msg => {
            if (msg._id === msgId) {
              return {
                ...msg,
                messageType: 'deleted',
                content: 'Message deleted',
              };
            }
            return msg;
          }),
        });

        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Modal
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
        transparent={true}>
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.title}>Are you sure?</Text>

            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={[styles.btn]}
                onPress={() => {
                  setShowModal(false);
                }}>
                <Text style={{fontWeight: '300', fontSize: FONTSIZE.md}}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                style={[styles.btn, {backgroundColor: 'white'}]}>
                <Text style={{fontWeight: '500', fontSize: FONTSIZE.md}}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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
    zIndex: 2,
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
});

export default DeleteMsg;
