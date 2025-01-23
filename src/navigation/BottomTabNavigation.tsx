import React from 'react';
import {Easing, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Messages from '../screens/Messages/Messages';
import Calls from '../screens/Calls/Calls';
import Contacts from '../screens/Contacts/Contacts';
import Profile from '../screens/Profile/Profile';
import MessageIcon from '../assets/icons/BottomTabIcons/MessageIcon';
import CallIcon from '../assets/icons/BottomTabIcons/Call-Icon';
import ContactsIcon from '../assets/icons/BottomTabIcons/ContactsIcon';
import ProfileIcon from '../assets/icons/BottomTabIcons/ProfileIcon';
import TabBarIcon from './TabBarIcon';
import Layout from '../components/Layout/Layout';

const MessageTabBarIcon = ({focused}: {focused: boolean}) => (
  <TabBarIcon Icon={MessageIcon} focused={focused} label={'Messages'} />
);

const CallTabBarIcon = ({focused}: {focused: boolean}) => (
  <TabBarIcon Icon={CallIcon} focused={focused} label={'Calls'} />
);

const ContactsTabBarIcon = ({focused}: {focused: boolean}) => (
  <TabBarIcon Icon={ContactsIcon} focused={focused} label={'Contacts'} />
);

const ProfileTabBarIcon = ({focused}: {focused: boolean}) => (
  <TabBarIcon Icon={ProfileIcon} focused={focused} label={'Profile'} />
);

const BottomTabNavigation = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Layout>
      <Tab.Navigator
        initialRouteName="Messages"
        screenOptions={{
          // animation: 'fade',
          transitionSpec: {
            animation: 'timing',
            config: {
              duration: 150,
              easing: Easing.inOut(Easing.ease),
            },
          },
          sceneStyleInterpolator: ({current}) => ({
            sceneStyle: {
              opacity: current.progress.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [0, 1, 0],
              }),
            },
          }),
          headerShown: false,
          tabBarStyle: styles.container,
        }}>
        <Tab.Screen
          name="Messages"
          component={Messages}
          options={{
            tabBarIcon: MessageTabBarIcon,
            tabBarLabelStyle: {
              display: 'none',
            },
            tabBarAccessibilityLabel: 'Messages',
            // tabBarLabel: ({focused}) => (
            //   <Text
            //     style={{
            //       color: focused ? '#212121' : COLORS.LightGray,
            //       fontSize: 10,
            //     }}>
            //     Messages
            //   </Text>
            // ),
            // tabBarBadge,
            // tabBarBadgeStyle
            // tabBarActiveTintColor: '#212121',
            // tabBarInactiveTintColor:COLORS.LightGray
          }}
        />
        <Tab.Screen
          name="Calls"
          component={Calls}
          options={{
            tabBarIcon: CallTabBarIcon,
            tabBarAccessibilityLabel: 'Calls',
          }}
        />
        <Tab.Screen
          name="Contacts"
          component={Contacts}
          options={{
            tabBarIcon: ContactsTabBarIcon,
            tabBarAccessibilityLabel: 'Contacts',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ProfileTabBarIcon,
            tabBarAccessibilityLabel: 'Profile',
          }}
        />
      </Tab.Navigator>
    </Layout>
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
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F9FAFC',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
});
