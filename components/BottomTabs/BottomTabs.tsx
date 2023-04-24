/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

import Conversation from '../../screen/Conversations';
import { Home } from '../../screen/Home/Home';
import ItemActivity from '../../screen/ItemActivity';
import Notification from '../../screen/Notification';
import Search from '../../screen/Search';

const Tab = createBottomTabNavigator();
export const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 1 },
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                source={
                  focused
                    ? require('../../assets/images/home_active.png')
                    : require('../../assets/images/home_inactive.png')
                }
                style={{ width: size, height: size }}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                source={
                  focused
                    ? require('../../assets/images/search_active.png')
                    : require('../../assets/images/search_inactive.png')
                }
                style={{ width: size, height: size }}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ItemActivity}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                source={
                  focused
                    ? require('../../assets/images/activity_active.png')
                    : require('../../assets/images/activity_inactive.png')
                }
                style={{ width: size, height: size }}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                source={
                  focused
                    ? require('../../assets/images/notifications_active.png')
                    : require('../../assets/images/notifications_inactive.png')
                }
                style={{ width: size, height: size }}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Conversation"
        component={Conversation}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Image
                source={
                  focused
                    ? require('../../assets/images/conversation_active.png')
                    : require('../../assets/images/conversation_inactive.png')
                }
                style={{ width: size, height: size }}
              />
            );
          },
        }}
      />
      {/* <Tab.Navigator screenOptions={{}}>
        <Tab.Screen name="discussion" component={Discussion} />
      </Tab.Navigator> */}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({});
