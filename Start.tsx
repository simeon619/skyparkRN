import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { BottomTabs } from './components/BottomTabs/BottomTabs';
import DrawerNavigator from './components/Drawer/Drawernavigator';
import Activity from './screen/Activity';
import { Home } from './screen/Home/Home';
import ItemActivity from './screen/ItemActivity';
import { LogoStart } from './screen/LogoStart';
import { Provider as PaperProvider } from 'react-native-paper';
import { Infoperso } from './screen/register/Infoperso';
import { Infoprofile } from './screen/register/Infoprofile';
import { Login } from './screen/register/Login';
import { store } from './wharehouse/store';

const Stack = createNativeStackNavigator();

const Start = () => {
  return (
    <NavigationContainer>
      <StoreProvider store={store}>
        <PaperProvider >
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              animationDuration: 300,
              orientation : 'portrait'
            }}>
            <Stack.Screen name="logostart" component={LogoStart} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Activity" component={Activity} />
            <Stack.Screen name="ItemActivity" component={ItemActivity} />
            <Stack.Screen name="Infoperso" component={Infoperso} />
            <Stack.Screen name="Infoprofile" component={Infoprofile} />
            <Stack.Screen name="drawer" component={DrawerNavigator} />
            <Stack.Screen name="bottomTabs" component={BottomTabs} />
          </Stack.Navigator>
        </PaperProvider>
      </StoreProvider>
    </NavigationContainer>
  );
};

export default Start;
