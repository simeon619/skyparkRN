import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { COLORS } from '../themes/colors';
import { RATIO_HEADER } from '../utils/metric';
// import { PropsNaivation } from '../utils/schemaType';

const { width, height } = Dimensions.get('window');
export const Header = ({ navigation , page, onSwitchPage }: {
  navigation : any , page : number , onSwitchPage :(index: number) => void 
}) => {


  return (
    <>
      <View style={styles.topHeader}>
        <Pressable onPress={()=>{navigation.openDrawer();}} style={{ alignSelf: 'center' }}>
          <Image
            style={styles.avatar}
            source={require('../assets/images/user.png')}
          />
        </Pressable>
        <Pressable onPress={() => {}} style={{ alignSelf: 'center' }}>
          <Text
            style={{
              fontSize: 30,
              color: 'black',
              fontFamily: 'Kurale-Regular',
              marginRight: 55,
            }}>
            Skypark
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {}}
          style={{ alignSelf: 'flex-start' }}></Pressable>
      </View>
      <View style={styles.bottomHeader}>
        <TouchableOpacity onPress={() => onSwitchPage(0)}>
          <Text
            style={[
              {
                fontSize: 20,
                color: '#aaa',
                fontWeight: '600',
                fontFamily: 'Ubuntu-Regular',
                paddingBottom: 8,
              },
              page === 0
                ? {
                    borderBottomWidth: 3,
                    borderBottomColor: COLORS.blue,
                    color: COLORS.black,
                    fontWeight: '700',
                  }
                : {},
            ]}>
            Building
          </Text>
        </TouchableOpacity>
        <Pressable onPress={() => onSwitchPage(1)}>
          <Text
            style={[
              {
                fontSize: 20,
                color: '#aaa',
                fontWeight: '600',
                paddingBottom: 8,
                fontFamily: 'Ubuntu-Regular',
              },
              page === 1
                ? {
                    borderBottomColor: COLORS.blue,
                    borderBottomWidth: 3,
                    fontWeight: '700',
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
    height: (RATIO_HEADER * height) / 100 / 2.9,
    width: (RATIO_HEADER * height) / 100 / 2.9,
    alignSelf: 'stretch',
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
    borderBottomWidth: 1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    gap: 20,
    paddingHorizontal: 15,
  },
});
