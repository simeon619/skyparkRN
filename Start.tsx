import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Provider } from 'react-redux';
import { BottomTabs } from './components/BottomTabs/BottomTabs';
import DrawerNavigator from './components/Drawer/Drawernavigator';
import { Home } from './screen/Home/Home';
import { LogoStart } from './screen/LogoStart';
import { Infoperso } from './screen/register/Infoperso';
import { Infoprofile } from './screen/register/Infoprofile';
import { Login } from './screen/register/Login';
import { store } from './wharehouse/store';
const Stack = createNativeStackNavigator();

const Start = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <Stack.Navigator
          initialRouteName="logostart"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 2000,
          }}>
          <Stack.Screen name="logostart" component={LogoStart} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Infoperso" component={Infoperso} />
          <Stack.Screen name="Infoprofile" component={Infoprofile} />
          <Stack.Screen name="drawer" component={DrawerNavigator} />
          <Stack.Screen name="bottomTabs" component={BottomTabs} />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
};

export default Start;
