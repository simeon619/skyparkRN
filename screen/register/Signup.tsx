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
import { FormSignup } from '../../layouts/FormSignup';
import { COLORS } from '../../themes/colors';
const { width, height } = Dimensions.get('window');

export const Signup = ({ navigation }: any) => {
  return (
    <View style={styles.containerFormPerso}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <View style={{ flex: 2 }}>
        <Image
          resizeMode="cover"
          style={{ width, height }}
          source={require('../../assets/images/banner.jpg')}
        />
      </View>
      <View
        style={{
          height: height * 0.1,
          //alignSelf: 'flex-start',
          marginHorizontal: 20,
          justifyContent: 'center',
          paddingHorizontal: 10,
        }}>
        <Image
          style={{
            width: 40,
            height: 40,
            position: 'absolute',
            tintColor: COLORS.blue,
            top: -40,
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
    </View>
  );
};

const styles = StyleSheet.create({
  containerFormPerso: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLogin,
    justifyContent: 'center',
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
    height: height * 0.75,
    // borderRadius: 20,
    // justifyContent: 'center',
    backgroundColor: '#0008',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
