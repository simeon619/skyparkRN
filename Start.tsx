import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { MagicModalPortal } from 'react-native-magic-modal';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as StoreProvider } from 'react-redux';
import { BottomTabs } from './components/BottomTabs/BottomTabs';
import DrawerNavigator from './components/Drawer/Drawernavigator';
import Activity from './screen/Activity';
import { Home } from './screen/Home/Home';
import ItemActivity from './screen/ItemActivity';
import { LogoStart } from './screen/LogoStart';
import Contact from './screen/Modal/Conversation/ContactModal';
import Discussion from './screen/Modal/Conversation/DiscussionModal';
import DetailPost from './screen/Modal/DetailPostModal';
import Post from './screen/Modal/PostModal';
import { Infoprofile } from './screen/register/Infoprofile';
import { Login } from './screen/register/Login';
import { Signup } from './screen/register/Signup';
import { store } from './wharehouse/store';
const Stack = createNativeStackNavigator();

const Start = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StoreProvider store={store}>
          <MagicModalPortal />
          <Stack.Navigator
            initialRouteName="logostart"
            screenOptions={{
              headerShown: false,
              animation: 'simple_push',
              animationDuration: 300,
              orientation: 'portrait',
            }}>
            <Stack.Screen name="logostart" component={LogoStart} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Activity" component={Activity} />
            <Stack.Screen name="ItemActivity" component={ItemActivity} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Infoprofile" component={Infoprofile} />
            <Stack.Screen name="Drawer" component={DrawerNavigator} />
            <Stack.Screen name="BottomTabs" component={BottomTabs} />
            <Stack.Screen
              name="discussion"
              component={Discussion}
              options={{
                presentation: 'modal',
                animation: 'simple_push',
                animationDuration: 500,
              }}
            />
            <Stack.Screen
              name="post"
              component={Post}
              options={{
                presentation: 'modal',
                animation: 'fade_from_bottom',
              }}
            />
            <Stack.Screen
              name="detailPost"
              component={DetailPost}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                animationDuration: 500,
              }}
            />
            <Stack.Screen
              name="contact"
              component={Contact}
              options={{
                presentation: 'modal',
                animation: 'slide_from_right',
                animationDuration: 500,
              }}
            />
          </Stack.Navigator>
        </StoreProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Start;
