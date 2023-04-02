import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FormLogin from '../../layouts/Formlogin';
import { COLORS } from '../../themes/colors';

export const Login = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerSvg}>
        <LottieView
          source={require('../../assets/images/f2.json')}
          autoSize={true}
          style={{
            height: '90%',
            marginLeft: '4%',
            backgroundColor: COLORS.backgroundLogin,
          }}
          resizeMode={'cover'}
          autoPlay
          loop={true}
        />
        <Text style={styles.textwelcome}>BIENVENUE !!!</Text>
      </View>
      <View style={styles.containerForm}>
        <FormLogin navigation={navigation} />
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
  containerSvg: {
    flex: 3,
    width: '100%',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLogin,
  },
  containerForm: {
    width: '95%',
    flex: 4,
    backgroundColor: COLORS.backgroundLogin,
  },
  textwelcome: {
    fontSize: 30,
    color: COLORS.blue,
    bottom: 15,
    fontFamily: 'Kurale-Regular',
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
});
