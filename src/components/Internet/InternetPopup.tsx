import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const InternetPopup = () => {
  const [isInternetConnected, setIsInternetConnected] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      setIsInternetConnected(state.isConnected);
      setShowPopup(!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleTryAgain = async () => {};

  const handlePopupClose = () => {
    setShowPopup(false); // Call the callback function from LoginPage to update showInternetPopup state
  };

  return (
    <>
      {showPopup && (
        <Modal visible={showPopup} transparent animationType="fade">
          <View style={styles.centeredContainer}>
            <View style={styles.popUpContainer}>
              <Text
                style={{
                  fontSize: 22,
                  marginTop: 30,
                  paddingHorizontal: 20,
                  textAlign: 'center',
                }}>
                MUNGON LIDHJA ME INTERNETIN. SIGUROHUNI QE TE KENI AKSES NE
                INTERNET.
              </Text>
              {/* <AntDesign name="wifi" size={30} color="black" /> */}
              <TouchableOpacity
                style={styles.provoPerseriButton}
                onPress={handleTryAgain}>
                <Text style={styles.buttonText}>PROVO PERSERI</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  handlePopupClose();
                }}>
                {/* <MaterialIcons name="close" size={40} color="black" /> */}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    // width: windowWidth,
    // height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "blue",
  },

  popUpContainer: {
    backgroundColor: 'white',
    borderRadius: 40,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    // height: "72%",
    // width: "90%",
    width: '85%',
    height: windowHeight / 2,
    position: 'relative',
  },

  provoPerseriButton: {
    backgroundColor: '#25a8dd', // Set your desired button background color
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 16,
    width: '90%',
    // marginTop: windowHeight * 0.15,
  },

  closeButton: {
    position: 'absolute',
    top: 5,
    right: 10,
    padding: 10,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default InternetPopup;
