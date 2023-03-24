import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS } from '../themes/colors';
import { RATIO_HEADER } from '../utils/metric';

const { width, height } = Dimensions.get('window');
export const Header = ({ navigation, page, onbtn1, onbtn2 }: any) => {
  const toggleDrawer = () => {
    navigation.toggleDrawer();
  };

  return (
    <>
      <View style={styles.topHeader}>
        <Pressable onPress={toggleDrawer} style={{ alignSelf: 'center' }}>
          <Image
            style={styles.avatar}
            source={require('../assets/images/user.png')}
          />
        </Pressable>
        <Pressable onPress={() => {}} style={{ alignSelf: 'center' }}>
          <Text
            style={{
              fontSize: 35,
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
        <Pressable onPress={onbtn1}>
          <Text
            style={[
              {
                fontSize: 20,
                color: '#aaa',
                fontWeight: '600',
                paddingBottom: 8,
              },
              page === 0
                ? {
                    borderBottomWidth: 3,
                    borderBottomColor: COLORS.blue,
                    color: COLORS.black,
                  }
                : {},
            ]}>
            News
          </Text>
        </Pressable>
        <Pressable onPress={onbtn2}>
          <Text
            style={[
              {
                fontSize: 20,
                color: '#aaa',
                fontWeight: '600',
                paddingBottom: 8,
              },
              page === 1
                ? {
                    borderBottomColor: COLORS.blue,
                    borderBottomWidth: 3,
                    color: COLORS.black,
                  }
                : {},
            ]}>
            MarketPlace
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
