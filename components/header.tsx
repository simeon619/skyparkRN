/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS } from '../themes/colors';
import { HOST, RATIO_HEADER } from '../utils/metric';
// import { PropsNaivation } from '../utils/schemaType';

const { height, width } = Dimensions.get('window');
export const Header = ({
  navigation,
  page,
  onSwitchPage,
}: {
  navigation: any;
  page: number;
  onSwitchPage: (index: number) => void;
}) => {
  let User = useSelector((state: any) => state.dataUser);
  return (
    <>
      <View style={styles.topHeader}>
        <Pressable
          onPress={() => {
            navigation.openDrawer();
          }}
          style={{ alignSelf: 'center' }}>
          {User?.imgProfile ? (
            <Image
              style={styles.avatar}
              resizeMode="contain"
              source={
                User.imgProfile[0]
                  ? { uri: HOST + User.imgProfile[0] }
                  : require('../assets/images/user.png')
              }
            />
          ) : (
            <Image
              style={styles.avatar}
              resizeMode="contain"
              source={require('../assets/images/user.png')}
            />
          )}
        </Pressable>
        <Pressable onPress={() => {}} style={{ alignSelf: 'center' }}>
          <Text
            style={{
              fontSize: width * 0.05,
              color: 'black',
              fontFamily: 'Kurale-Regular',
              marginRight: 55,
            }}>
            Skypark
          </Text>
        </Pressable>
        <Pressable onPress={() => {}} style={{ alignSelf: 'flex-start' }} />
      </View>
      <View style={styles.bottomHeader}>
        <Pressable onPress={() => onSwitchPage(0)}>
          <Text
            style={[
              {
                fontSize: 20,
                color: '#aaa',
                fontWeight: '600',
                fontFamily: 'Ubuntu-Regular',
                paddingBottom: 8,
                borderBottomColor: '#0000',
                borderBottomWidth: 4,
              },
              page === 0
                ? {
                    borderBottomColor: COLORS.blue,
                    color: COLORS.black,
                  }
                : {},
            ]}>
            Building
          </Text>
        </Pressable>
        <Pressable onPress={() => onSwitchPage(1)}>
          <Text
            style={[
              {
                fontSize: 20,
                color: '#aaa',
                fontWeight: '600',
                paddingBottom: 8,
                fontFamily: 'Ubuntu-Regular',
                borderBottomColor: '#0000',
                borderBottomWidth: 4,
              },
              page === 1
                ? {
                    borderBottomColor: COLORS.blue,

                    color: COLORS.black,
                  }
                : {},
            ]}>
            Neighborhood
          </Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  avatar: {
    height: (RATIO_HEADER * height) / 100 / 2.5,
    width: (RATIO_HEADER * height) / 100 / 2.5,
    alignSelf: 'stretch',
    borderRadius: 20,
  },

  shop: {
    height: (RATIO_HEADER * height) / 100 / 2.8,
    width: (RATIO_HEADER * height) / 100 / 2.8,
    marginTop: 10,
  },
  logo: {
    height: (RATIO_HEADER * height) / 100 / 2.3,
    width: (RATIO_HEADER * height) / 100 / 2.3,
    // backgroundColor : 'red',
    marginTop: 5,
  },
  bottomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: (RATIO_HEADER * height) / 100 - (RATIO_HEADER * height) / 100 / 1.8,
  },

  topHeader: {
    height: (RATIO_HEADER * height) / 100 / 1.8,
    borderBottomColor: '#0012',
    borderBottomWidth: 0.4,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    gap: 20,
    paddingHorizontal: 15,
  },
});
