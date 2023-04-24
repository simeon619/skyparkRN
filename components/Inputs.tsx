/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
const { width } = Dimensions.get('window');

import {
  Dimensions,
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
  require('../assets/images/123.png'),
];
const { height: SCREEN_HEIGHT } = Dimensions.get('screen');
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
      {!errorDeatils && <Text style={styles.error}> {errorDeatils} </Text>}
    </>
  );
};

export const InputPost = ({
  name,
  control,
  placeholder,
}: {
  name: string;
  control?: any;
  placeholder: string;
}) => {
  const {
    field,
    fieldState: {},
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

        console.log(endCoordinates, SCREEN_HEIGHT);
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
      // refinput.current?.blur()
    };
  }, []);

  return (
    <Animated.View
      style={[
        animatedStyles,
        { borderBottomColor: COLORS.blue, borderBottomWidth: 0.4 },
      ]}>
      <TextInput
        style={{
          textAlignVertical: 'top',
          backgroundColor: '#fff',
          color: 'black',
          fontFamily: 'Ubuntu-Regular',
          fontSize: 18,
          // flex: 1,
          paddingBottom: keyboardHeight + 5,
        }}
        value={field.value}
        placeholder={placeholder}
        placeholderTextColor="grey"
        multiline={true}
        autoFocus={true}
        // scrollEnabled={true}
        // focusable={true}
        onContentSizeChange={handleContentSizeChange}
        onChangeText={field.onChange}
      />
    </Animated.View>
  );
};

export const Input2 = ({
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
  const [isFocused, setIsFocused] = useState(false);
  placeholder = isFocused ? '' : placeholder;
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
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
    case 'Password':
    case 'password':
      typeKeyBoard = 'numbers-and-punctuation';
      password = true;
      break;
    case 'confirmPassword':
      typeKeyBoard = 'numbers-and-punctuation';
      password = true;
      name = 'confirm Password';
      break;

    default:
      typeKeyBoard = 'default';
      break;
  }

  return (
    <>
      <View
        style={[
          styles.SectionStyle2,
          !!errorDeatils && {
            borderBottomColor: COLORS.error,
            borderBottomWidth: 1,
            // backgroundColor: COLORS.error,
          },
          isFocused && {
            borderRadius: 4,
            elevation: 2,
            borderBottomWidth: 0.3,
            backgroundColor: 'white',
          },
        ]}>
        <Image source={randomImages[icon]} style={styles.ImageStyle} />
        <View style={{ alignItems: 'flex-start' }}>
          {isFocused && (
            <Text
              style={{
                fontSize: 12,
                color: '#4448',
                fontFamily: 'Roboto-Bold',
              }}>
              {name.toLocaleUpperCase()}
            </Text>
          )}
          <View style={{ flex: 1, flexDirection: 'row', width: width * 0.65 }}>
            <TextInput
              style={{
                flex: 1,
                color: '#112',
                paddingVertical: 2,
                fontFamily: 'Roboto-Bold',
                fontSize: 15,
                // width: width * 0.7,
                // overflow: 'hidden',
                // backgroundColor: '#ff2',
              }}
              value={field.value}
              onChangeText={field.onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholderTextColor={'#4448'}
              placeholder={placeholder}
              secureTextEntry={password}
              keyboardType={typeKeyBoard}
            />
            {name === 'password' && (
              <Text
                style={[
                  {
                    fontSize: 13,
                    color: COLORS.blue,
                    fontFamily: 'Roboto-Bold',
                    height: 20,
                    // backgroundColor: 'white',
                    paddingRight: 5,
                  },
                  !isFocused && { top: 16 },
                ]}>
                FORGOT
              </Text>
            )}
          </View>
        </View>
      </View>
      {!!errorDeatils && <Text style={styles.error}> {errorDeatils} </Text>}
      {!errorDeatils && <Text style={styles.error}> {errorDeatils} </Text>}
    </>
  );
};

const styles = StyleSheet.create({
  SectionStyle2: {
    flexDirection: 'row',
    justifyContent: 'center',
    // paddingHorizontal: 20,

    backgroundColor: '#fffc',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.4,
    // height: 50,

    marginHorizontal: 19,
    color: COLORS.blue,
    marginTop: 10,
    paddingTop: 5,
  },
  ImageStyle: {
    margin: 10,
    width: 25,
    aspectRatio: 1,
    tintColor: '#333',
    resizeMode: 'stretch',
    alignSelf: 'flex-end',
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundInput,
    height: 60,
    borderRadius: 99,
    marginHorizontal: 19,
    elevation: 10,
    color: COLORS.blue,
    marginTop: 10,
  },
  error: {
    fontSize: 11,
    color: COLORS.error,
    borderRadius: 20,
    paddingHorizontal: 5,
    textAlign: 'center',
  },
});
