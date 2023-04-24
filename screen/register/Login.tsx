/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FormLogin from '../../layouts/Formlogin';
import { COLORS } from '../../themes/colors';
const { width, height } = Dimensions.get('window');
export const Login = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={{ flex: 4 }}>
        <Image
          resizeMode="cover"
          style={{ width, height }}
          source={require('../../assets/images/banner.jpg')}
        />
      </View>
      <View
        style={{
          height: height * 0.2,
          alignSelf: 'flex-start',
          marginHorizontal: 20,
          rowGap: 5,
          justifyContent: 'center',
          paddingHorizontal: 10,
        }}>
        <Text
          style={{ fontFamily: 'Ubuntu-Bold', fontSize: 40, color: '#eee' }}>
          Login
        </Text>
        <Text
          style={{ fontFamily: 'Ubuntu-Bold', fontSize: 20, color: '#ccc' }}>
          Please sign in to continue.
        </Text>
      </View>
      <View style={styles.containerForm}>
        <FormLogin navigation={navigation} />
        <View style={styles.gotoregister}>
          <Text style={styles.simple}>Don't have an account ?</Text>
          <Text
            style={styles.link}
            onPress={() => {
              navigation.navigate('Signup');
            }}>
            Sign up
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLogin,
  },
  containerForm: {
    width: '95%',
    height: height * 0.6,
    backgroundColor: '#0008',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // backgroundColor: COLORS.backgroundLogin,
  },
  textwelcome: {
    fontSize: 30,
    color: COLORS.blue,
    bottom: 15,
    fontFamily: 'Roboto-Regular',
  },
  forgetpsswd: {
    alignSelf: 'center',
    color: COLORS.blue,
    fontSize: 15,
    fontFamily: 'Kurale-Regular',
    textDecorationLine: 'underline',
    fontWeight: '800',
    position: 'absolute',
    bottom: 10,
  },
  gotoregister: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    flexWrap: 'wrap',
    gap: 5,
    alignSelf: 'center',
    alignItems: 'baseline',
  },

  simple: {
    fontFamily: 'Kurale-Regular',
    fontSize: 18,
    color: '#bbb',
  },
  link: {
    color: COLORS.blue,
    fontWeight: '900',
    // textDecorationLine: 'underline',
    fontFamily: 'Kurale-Regular',
    fontSize: 16,
  },
});
