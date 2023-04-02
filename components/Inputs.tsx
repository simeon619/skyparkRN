import React, { useCallback, useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { COLORS } from '../themes/colors';
const randomImages = [
  require('../assets/images/padlock.png'),
  require('../assets/images/email.png'),
  require('../assets/images/user.png'),
];
export const Input = ({
  name,
  control,
  placeholder,
  icon,
}: {
  name: string;
  control: any;
  placeholder: string;
  icon: number;
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    defaultValue: '',
    name,
  });
  let errorDeatils = error?.message;
  let typeKeyBoard:
    | 'numeric'
    | 'password'
    | 'default'
    | 'email-address'
    | 'numbers-and-punctuation' = 'default';
  let password = false;
  switch (name) {
    case 'code':
    case 'number':
      typeKeyBoard = 'numeric';
      break;
    case 'email':
      typeKeyBoard = 'email-address';
      break;
    case 'password':
    case 'confirmPassword':
      typeKeyBoard = 'numbers-and-punctuation';
      password = true;
      break;

    default:
      typeKeyBoard = 'default';
      break;
  }
  return (
    <>
      <View
        style={[
          styles.SectionStyle,
          !!errorDeatils && {
            borderColor: COLORS.error,
            borderBottomWidth: 1,
            backgroundColor: COLORS.error,
          },
        ]}>
        <Image source={randomImages[icon]} style={styles.ImageStyle} />
        <TextInput
          style={{ flex: 1, color: 'rgb(12 74 110)' }}
          value={field.value}
          onChangeText={field.onChange}
          placeholderTextColor={COLORS.blue}
          placeholder={placeholder}
          secureTextEntry={password}
          keyboardType={typeKeyBoard}
        />
      </View>
      {!!errorDeatils && <Text style={styles.error}> {errorDeatils} </Text>}
      {!!!errorDeatils && <Text style={styles.error}> {errorDeatils} </Text>}
    </>
  );
};

export const InputPost = ({
  name,
  control,
  placeholder,
  isVisible,
}: {
  name: string;
  control: any;
  placeholder: string;
  isVisible: boolean;
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    defaultValue: '',
    name,
  });
  const height = useSharedValue(40);

  const handleContentSizeChange = useCallback((event: any) => {
    const newHeight = event.nativeEvent.contentSize.height;
    height.value = withTiming(newHeight);
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      ({ endCoordinates }) => {
        setKeyboardHeight(30);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);



  return (
    <Animated.View style={animatedStyles}>
      <TextInput
        style={{
          textAlignVertical: 'top',
          backgroundColor: '#fff',
          color: 'black',
          fontFamily: 'Ubuntu-Regular',
          fontSize: 18,
          flex: 1,
          paddingBottom: keyboardHeight + 5,
        }}
        value={field.value}
        placeholder={placeholder}
        placeholderTextColor="black"
        focusable={isVisible}
        multiline={true}
        onContentSizeChange={handleContentSizeChange}
        onChangeText={field.onChange}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundInput,
    height: 50,
    borderRadius: 99,
    marginHorizontal: 19,
    elevation: 10,
    color: COLORS.blue,
    marginTop: 10,
  },
  ImageStyle: {
    margin: 15,
    height: 20,
    tintColor: COLORS.blue,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',
  },

  error: {
    fontSize: 11,
    color: COLORS.error,
    borderRadius: 20,
    paddingHorizontal: 5,
    textAlign: 'center',
  },
});
