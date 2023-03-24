import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS } from '../../themes/colors';
const SIZE_PICTURE = 70;
const CustomDrawer = (props: any) => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ImageBackground
        source={require('../../assets/images/banner1.jpg')}
        style={{ padding: SIZE_PICTURE / 6, marginBottom: SIZE_PICTURE / 1.2 }}>
        <View
          style={{
            backgroundColor: '#0000',
            top: SIZE_PICTURE,
            alignItems: 'flex-start',
            borderRadius: 10,
          }}>
          <Image
            source={require('../../assets/images/user.png')}
            style={styles.avatar}
          />
          <Text
            style={{
              color: COLORS.black,
              fontSize: 20,
              alignSelf: 'flex-start',
              fontWeight: '800',
            }}>
            Jules Gregroire
          </Text>
          <Text
            style={{
              color: COLORS.black,
              fontSize: 15,
              alignSelf: 'flex-start',
              fontWeight: '200',
            }}>
            @user1212156
          </Text>
        </View>
      </ImageBackground>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.drawerFooter}>
        <Pressable style={styles.moreItem}>
          <Image
            source={require('../../assets/images/share.png')}
            style={styles.icon}
          />
          <Text style={styles.moreItemText}>Share</Text>
        </Pressable>
        <Pressable style={styles.moreItem}>
          <Image
            source={require('../../assets/images/settings.png')}
            style={styles.icon}
          />
          <Text style={styles.moreItemText}>Settings</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    height: SIZE_PICTURE,
    width: SIZE_PICTURE,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 100,
  },
  icon: { height: 30, width: 30 },
  drawerFooter: {
    borderTopWidth: 1,
    paddingBottom: 10,
    paddingLeft: 10,
    borderTopColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moreItem: {
    paddingTop: 10,
    alignItems: 'center',
  },
  moreItemText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
  },
});

export default CustomDrawer;
