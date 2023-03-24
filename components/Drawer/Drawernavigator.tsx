import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { Image, StyleSheet ,Text } from 'react-native';
import { Home } from '../../screen/Home/Home';
import Profile from '../../screen/Profile';
import { Infoprofile } from '../../screen/register/Infoprofile';
import { Login } from '../../screen/register/Login';
import { BottomTabs } from '../BottomTabs/BottomTabs';
import CustomDrawer from './CustomDrawer';

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props: any) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#000',
        drawerItemStyle : {marginTop: 5 },
        drawerLabelStyle: { marginLeft: -10, fontSize: 18, marginTop: 0  ,fontFamily :'Roboto-regular'},
      }}>
      <Drawer.Screen
        name="botommTabs"
        component={BottomTabs}
        options={{
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile',
          drawerItemStyle : {marginTop: 35},
           drawerLabel: () => ( <Text style={{ fontSize: 22, color: 'black', fontFamily :'Roboto-Regular' }}>Profile</Text> ),
          drawerIcon: ({ color, size, focused }) => (
            <Image
              style={{
                height: size,
                width: size,
              }}
              // source={require('../../')}
              source={require('../../assets/images/profile.png')}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Message"
        component={Home}
        options={{
          title: 'Messages',
          drawerLabel: () => ( <Text style={{ fontSize: 22, color: 'black', fontFamily :'Roboto-Regular' }}>Messages</Text> ),
          drawerIcon: ({ color, size, focused }) => (
            <Image
              style={{
                height: size,
                width: size,
              }}
              source={require('../../assets/images/topic.png')}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Favoris"
        component={Infoprofile}
        options={{
          title: 'Favoris',
          drawerLabel: () => ( <Text style={{ fontSize: 22, color: 'black', fontFamily :'Roboto-Regular' }}>Favoris</Text> ),
          drawerIcon: ({ color, size, focused }) => (
            <Image
              style={{
                height: size,
                width: size,
              }}
              source={require('../../assets/images/bookmarks.png')}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Activity"
        component={Login}
        options={{
          title: 'Activity',
          drawerLabel: () => ( <Text style={{ fontSize: 22, color: 'black', fontFamily :'Roboto-Regular' }}>Activity</Text> ),
          drawerIcon: ({ color, size, focused }) => (
            <Image
              style={{
                height: size,
                width: size,
              }}
              source={require('../../assets/images/activity.png')}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
const styles = StyleSheet.create({
  avatar: {
    height: 20,
    width: 20,
  },
});
export default DrawerNavigator;
