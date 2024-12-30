import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Messages from '../screens/Messages/Messages';
import Calls from '../screens/Calls/Calls';
import Contacts from '../screens/Contacts/Contacts';
import Profile from '../screens/Profile/Profile';
import {COLORS} from '../theme/theme';
import MessageIcon from '../assets/icons/BottomTabIcons/MessageIcon';
import CallIcon from '../assets/icons/BottomTabIcons/Call-Icon';
import ContactsIcon from '../assets/icons/BottomTabIcons/ContactsIcon';
import ProfileIcon from '../assets/icons/BottomTabIcons/ProfileIcon';

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
          tabBarIcon: ({focused}) => (
            <View style={styles.iconWrapper}>
              <MessageIcon
                width={20}
                height={20}
                fill={focused ? '#212121' : COLORS.LightGray}
              />
            </View>
          ),
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? '#212121' : COLORS.LightGray,
                fontSize: 10,
              }}>
              Messages
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Calls"
        component={Calls}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.iconWrapper}>
              <CallIcon
                width={20}
                height={20}
                fill={focused ? '#212121' : COLORS.LightGray}
              />
            </View>
          ),
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? '#212121' : COLORS.LightGray,
                fontSize: 10,
              }}>
              Calls
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={Contacts}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.iconWrapper}>
              <ContactsIcon
                width={20}
                height={20}
                fill={focused ? '#212121' : COLORS.LightGray}
              />
            </View>
          ),
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? '#212121' : COLORS.LightGray,
                fontSize: 10,
              }}>
              Contacts
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.iconWrapper}>
              <ProfileIcon
                width={20}
                height={20}
                fill={focused ? '#212121' : COLORS.LightGray}
              />
            </View>
          ),
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? '#212121' : COLORS.LightGray,
                fontSize: 10,
              }}>
              Profile
            </Text>
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
    bottom: Platform.OS === 'ios' ? 20 : 40,
    marginLeft: '5%',
    marginRight: '5%',
    borderRadius: 14,
    backgroundColor: '#F9FAFC',
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F9FAFC',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  iconWrapper: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconContainer: {
    flex: 1,
    transform: Platform.OS === 'android' ? [{translateY: 10}] : undefined,
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
});
