/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { KeyboardInsetsView } from 'react-native-keyboard-insets';
import { FormSignup } from '../../layouts/FormSignup';
import { COLORS } from '../../themes/colors';
const { width, height } = Dimensions.get('window');

export const Signup = ({ navigation }: any) => {
  return (
    <KeyboardInsetsView extraHeight={5}>
      <StatusBar backgroundColor={'#000'} barStyle={'light-content'} />
      <ImageBackground
        resizeMode="cover"
        style={{ width, height, justifyContent: 'space-between' }}
        source={require('../../assets/images/banner.jpg')}>
        <View
          style={{
            height: height * 0.2,
            //alignSelf: 'flex-start',
            marginHorizontal: 20,
            justifyContent: 'center',
            paddingHorizontal: 10,
            marginTop: 40,
          }}>
          <Image
            style={{
              width: 20,
              height: 20,
              padding: 20,
              backgroundColor: '#000a',
              borderRadius: 99,
              position: 'absolute',
              tintColor: 'white',
              top: 0,
            }}
            source={require('../../assets/images/arrowback.png')}
          />
          <Text
            style={{
              fontFamily: 'Ubuntu-Bold',
              fontSize: width * 0.11,
              color: '#ccc',
            }}>
            Create Account
          </Text>
        </View>
        <View style={styles.containerForm}>
          <FormSignup navigation={navigation} />
          <View style={styles.gotoregister}>
            <Text style={styles.simple}>Already have a account ?</Text>
            <Text
              style={styles.link}
              onPress={() => {
                navigation.navigate('Login');
              }}>
              Login
            </Text>
          </View>
        </View>
      </ImageBackground>
    </KeyboardInsetsView>
  );
};

const styles = StyleSheet.create({
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
  gotoregister: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    flexWrap: 'wrap',
    gap: 5,
    alignSelf: 'center',
    alignItems: 'baseline',
  },
  containerSvg: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLogin,
  },
  containerForm: {
    width: '95%',
    height: height * 0.7,
    // borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: '#0008',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // flex: 1,
  },
});
