import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../themes/colors';

export const LogoStart = ({ navigation }: any) => {
  useEffect(() => {
    const time = setTimeout(() => {
      navigation.replace('Infoprofile');
    }, 2000);

    return () => {
      clearTimeout(time);
    };
  });
  return (
    <View style={styles.container}>
      {/* <Image
        source={require('../assets/images/svg1_login.jpg')}
        style={{ width: 300, height: 300 }}
        fadeDuration={100}
      /> */}
             <Text
          style={{
            fontSize: 65,
            color: '#ffffff',
            fontFamily: 'PermanentMarker-Regular',
            alignSelf: 'center',
        
          }}>Skypark</Text>
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
  text: {
    color: '#101010',
    fontSize: 24,
    fontWeight: 'bold',
  },
});


