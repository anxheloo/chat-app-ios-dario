import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Messages from '../screens/Messages/Messages';
import Calls from '../screens/Calls/Calls';
import Contacts from '../screens/Contacts/Contacts';
import Profile from '../screens/Profile/Profile';

// const tabBarStyle: ViewStyle = {
//   paddingTop: 20,
//   paddingBottom: 20,
//   borderWidth: 1,
//   borderRadius: 20,
//   height: 80,
//   position: "absolute",
//   bottom: 40,
//   left: 20,
//   right: 20,
//   shadowOffset: { width: 3, height: 3 },
//   shadowOpacity: 0.5,
//   shadowRadius: 12,
//   elevation: 7,
//   opacity: 1,
// };

const BottomTabNavigation = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Messages"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.container,
      }}>
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarButton: props => (
            <TouchableOpacity style={styles.iconContainer} onPress={props.onPress}>
              <Image
                source={require('../assets/icons/message-icon.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.label}>Messages</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Calls"
        component={Calls}
        options={{
          tabBarButton: props => (
            <TouchableOpacity style={styles.iconContainer} onPress={props.onPress}>
              <Image source={require('../assets/icons/call-icon.png')} resizeMode="contain" style={styles.icon}/>
              <Text style={styles.label}>Calls</Text>
            </TouchableOpacity>
          ),
          // ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={Contacts}
        options={{
          tabBarButton: props => (
            <TouchableOpacity style={styles.iconContainer} onPress={props.onPress}>
              <Image source={require('../assets/icons/contacts-icon.png')} resizeMode="contain" style={styles.icon}/>
              <Text style={styles.label}>Contacts</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarButton: props => (
            <TouchableOpacity style={styles.iconContainer} onPress={props.onPress}>
              <Image source={require('../assets/icons/profile-icon.png')} resizeMode="contain" style={styles.icon}/>
              <Text style={styles.label}>Profile</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;

const styles = StyleSheet.create({
  container: {
    height: 56,
    position: 'absolute',
    bottom: 20,
    marginLeft: '5%',
    marginRight: '5%',
    borderRadius: 14,
    backgroundColor: '#F9FAFC',
    display: 'flex',
    flexDirection: 'row',
  },

  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    width: 20,
    height: 20,
    marginBottom: 4, // Space between icon and title
  },

  label: {
    fontSize: 10,
    color: 'gray',
  },
  // tabBar: {
  //   // paddingTop: 20,
  //   // paddingBottom: 20,
  //   // borderWidth: 1,
  //   paddingVertical: 3,
  //   // backgroundColor:"black",
  //   borderRadius: 14,
  //   height: 56,
  //   width: "100%",
  //   maxWidth: 320,
  //   position: "absolute",
  //   alignSelf: "center",
  //   // display: "flex",
  //   // flexDirection: "column",
  //   // alignItems: "center",
  //   bottom: 40,
  //   left: 0,
  //   right: 0,
  //   marginHorizontal: "auto",
  //   opacity: 1,
  // },
});
