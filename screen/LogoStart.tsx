import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../themes/colors';
export const LogoStart = ({ navigation }: any) => {
  useEffect(() => {
    // flashLog();
    const time = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => {
      clearTimeout(time);
    };
  });
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Skypark</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
  },
  logo: {
    fontSize: 65,
    color: '#ffffff',
    fontFamily: 'PermanentMarker-Regular',
    alignSelf: 'center',
  },
  text: {
    color: '#101010',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
