import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../themes/colors';
import PostModal from '../PostModal';
const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HeaderProfile = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleModal = () => {
    setIsVisible(prev => !prev);
  };
  return (
    <View style={{ backgroundColor: 'white' }}>
      <Image
        source={require('../../assets/images/banner1.jpg')}
        style={{ width: '100%', height: 200 }}
      />

      <View style={styles.cadre}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 99,
              transform: [{ translateY: -50 }],
            }}>
            <Image
              style={{ width: '100%', height: '100%', paddingHorizontal: 20 }}
              source={require('../../assets/images/user.png')}
            />
          </View>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Ubuntu-Regular',
              fontSize: 20,
              fontWeight: '700',
              transform: [{ translateY: -40 }],
            }}>
            Jean gnagniri
          </Text>
        </View>

        <View
          style={{
            // width: '100%',
            // height: 50,
            flexDirection: 'row',
            alignItems: 'baseline',
            // alignContent: 'center',
            justifyContent: 'space-around',
            // overflow: 'hidden',
            borderTopColor: COLORS.blue,
            borderTopWidth: 1,
            transform: [{ translateY: -20 }],
          }}>
          <View style={[styles.icon]}>
            <Image
              style={{ width: '100%', height: '100%', tintColor: COLORS.blue }}
              source={require('../../assets/images/edit.png')}
            />
          </View>
          <View
            style={{
              height: 35,
              width: 2,
              backgroundColor: COLORS.blue,
              transform: [{ translateY: 10  }],
            }}></View>
          <View style={[styles.icon]}>
            <Image
              style={{ width: '100%', height: '100%', tintColor: COLORS.blue }}
              source={require('../../assets/images/profileUser.png')}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          padding: 20,
          transform: [{ translateY: -SCREEN_HEIGHT * 0.07 }],
          borderBottomWidth: 0.4,
          borderBottomColor: COLORS.blue,
        }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            style={styles.icon1}
            source={require('../../assets/images/activityUser.png')}
          />
          <Text style={styles.text}>Profile</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Image
            style={styles.icon1}
            source={require('../../assets/images/userProfile.png')}
          />
          <Text style={styles.text}>Profile</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Image
            style={styles.icon1}
            source={require('../../assets/images/friends.png')}
          />
          <Text style={styles.text}>Friends</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 15,
          gap: 10,
          transform: [{ translateY: -SCREEN_HEIGHT * 0.05 }],
        }}>
        <View style={styles.icon3}>
          <Image
            style={{ width: '100%', height: '100%' }}
            source={require('../../assets/images/user.png')}
          />
        </View>
        <TouchableOpacity onPress={toggleModal}>
          <View
            style={{
              borderColor: 'grey',
              borderRadius: 90,
              borderWidth: 0.4,
              width: width * 0.75,
              height: 40,
              paddingHorizontal: 15,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: '#555',
                fontSize: 18,
              }}>
              What's new Jean ?
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {<PostModal toggleModal={toggleModal} isShow={isVisible} />}
    </View>
  );
};

export default HeaderProfile;

const styles = StyleSheet.create({
  icon1: {
    width: 27,
    height: 27,
    tintColor: COLORS.blue,
  },
  icon3: {
    width: width * 0.1,
    height: width * 0.1,
    tintColor: COLORS.blue,
  },
  text: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 17,
    color: COLORS.blue,
  },
  cadre: {
    // height: SCREEN_HEIGHT * 0.2,
    width: width * 0.95,
    backgroundColor: 'white',
    borderRadius: 20,
    borderBottomColor: COLORS.blue,
    borderBottomWidth: 2,
    elevation: 10,
    alignSelf: 'center',
    transform: [{ translateY: -SCREEN_HEIGHT * 0.08 }],
  },
  icon: {
    width: 25,
    height: 25,
  },
});