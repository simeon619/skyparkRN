/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MagicModalPortal, magicModal } from 'react-native-magic-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { contactShema } from '../../screen/Modal/Conversation/ContactModal';
import { HOST } from '../../utils/metric';
const SIZE_PROFILE = 80;
const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HeaderProfile = ({ navigation }: { navigation: any }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isNotify, setIsNotify] = useState(false);
  const listContact: contactShema[] = useSelector(
    (state: any) => state.contact,
  );

  const toggleNotify = (value: boolean) => {
    setIsNotify(value);
  };
  const ResponseModal = () => (
    <SafeAreaView style={styles.options}>
      <Pressable
        style={styles.item}
        onPress={() => {
          toggleNotify(true);
          magicModal.show(() => <ResponseModal />);
        }}>
        <Image
          style={{
            width: width * 0.075,
            height: width * 0.075,
            borderRadius: 99,
          }}
          source={require('../../assets/images/notifications.png')}
        />
        <Text
          style={{
            fontSize: 19,
            textAlign: 'justify',
            color: '#222',
            width: width * 0.85,
          }}>
          Active les notifications pour Jean
        </Text>
      </Pressable>
      <Pressable
        style={styles.item}
        onPress={() => {
          toggleNotify(false);
          magicModal.hide(() => <ResponseModal />);
        }}>
        <Image
          style={{
            width: width * 0.075,
            height: width * 0.075,
            borderRadius: 99,
          }}
          source={require('../../assets/images/silent.png')}
        />
        <Text style={{ fontSize: 19, color: '#222', width: width * 0.85 }}>
          Desactivez les notifications pour Jean
        </Text>
      </Pressable>
    </SafeAreaView>
  );
  const [visible, setVisible] = useState(false);

  const hideModal = () => {
    setVisible(false);
  };
  const showModal = () => {
    setVisible(true);
  };
  let User = useSelector((state: any) => state.dataUser);
  return (
    <>
      <View
        style={{
          position: 'relative',
          zIndex: 99,
          backgroundColor: 'white',
          // marginBottom: SIZE_PROFILE / 2,
        }}>
        <View style={{}}>
          <Image
            source={require('../../assets/images/banner1.jpg')}
            style={{ width: '100%', height: SCREEN_HEIGHT * 0.2 }}
          />
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              paddingHorizontal: 12,
              top: 10,
              width,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                backgroundColor: '#0009',
                padding: 5,
                borderRadius: 50,
              }}>
              <Image
                style={{
                  width: width * 0.07,
                  height: width * 0.07,
                  tintColor: '#fff',
                }}
                source={require('../../assets/images/arrowback.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#0009',
                padding: 5,
                borderRadius: 50,
              }}>
              <Image
                style={{
                  width: width * 0.07,
                  height: width * 0.07,
                  tintColor: '#ccc',
                }}
                source={require('../../assets/images/option.png')}
              />
            </TouchableOpacity>
          </View>
          <Image
            style={styles.avatar}
            resizeMode="contain"
            source={
              User?.imgProfile[0]
                ? { uri: HOST + User.imgProfile[0] }
                : require('../../assets/images/user.png')
            }
          />
        </View>
        <View
          style={{
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 10,
              marginLeft: SIZE_PROFILE * 0.05,
            }}>
            <Text
              style={{
                color: '#459',
                fontSize: 20,
                fontFamily: 'Ubuntu-Bold',
              }}>
              Ophelia Coleman
            </Text>
            <Text
              style={{
                fontSize: 14,
                // marginVertical: 1,
                color: '#444a',
                fontFamily: 'Ubuntu-Regular',
                textAlign: 'center',
              }}>
              @user4654564654564
            </Text>
          </View>
          {/*
      <Text
        style={{
          fontSize: 16,
          marginVertical: 8,
          color: '#999',
          fontFamily: 'Ubuntu-Regular',
          textAlign: 'center',
        }}>
        Skypark, Building 1
      </Text> */}
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '700',
              color: '#459c',
              fontSize: 15,
              fontFamily: 'Ubuntu-Regular',
              marginTop: 16,
            }}>
            I'm postive person. I love to travel and eat. Always available for
            chat
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 20,
            alignItems: 'center',
            marginVertical: 15,
          }}>
          <View
            style={{
              borderColor: '#4444',
              borderWidth: 1,
              padding: 10,
              borderRadius: 99,
            }}>
            <Image
              style={{
                width: width * 0.07,
                height: width * 0.07,
                tintColor: '#459',
              }}
              source={require('../../assets/images/chat.png')}
            />
          </View>
          <Pressable
            onPress={() => {
              // toggleNotify();
              magicModal.show(() => <ResponseModal />);
            }}
            style={[
              {
                backgroundColor: '#fff',
                paddingHorizontal: 30,
                paddingVertical: 10,
                borderRadius: 50,
                gap: 5,
                // maxWidth: 140,
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: '#459',
                borderWidth: 1,
              },
              isNotify && {
                backgroundColor: '#459',
                borderColor: '#459',
                borderWidth: 1,
              },
            ]}>
            {isNotify ? (
              <Image
                style={[
                  {
                    width: width * 0.065,
                    height: width * 0.065,

                    tintColor: '#fff',
                  },
                ]}
                source={require('../../assets/images/notifications.png')}
              />
            ) : (
              <Image
                style={[
                  {
                    width: width * 0.065,
                    height: width * 0.065,
                    tintColor: '#459',
                  },
                ]}
                source={require('../../assets/images/silent.png')}
              />
            )}
          </Pressable>
          <View
            style={{
              borderColor: '#4444',
              borderWidth: 1,
              padding: 10,
              borderRadius: 99,
            }}>
            <Image
              style={{
                width: width * 0.07,
                height: width * 0.07,
                tintColor: '#459',
              }}
              source={require('../../assets/images/share.png')}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 10,
            // gap: 15,s
          }}>
          <View style={styles.ContainStat}>
            <Text style={styles.textStat}>870</Text>
            <Text style={styles.titleStat}>Posts</Text>
          </View>
          <View
            style={[
              styles.ContainStat,
              {
                borderRightWidth: 1,
                borderRightColor: '#ccc',
                borderLeftColor: '#ccc',
                borderLeftWidth: 1,
                paddingHorizontal: 30,
                marginHorizontal: 30,
              },
            ]}>
            <Text style={styles.textStat}>80k</Text>
            <Text style={styles.titleStat}>Notifiers</Text>
          </View>
          <View style={styles.ContainStat}>
            <Text style={styles.textStat}>470K</Text>
            <Text style={styles.titleStat}>Like</Text>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: '#eee',
            borderBottomWidth: 8,
            borderTopColor: '#eee',
            borderTopWidth: 8,
            paddingVertical: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginLeft: 5,
              marginRight: 15,
              marginBottom: 10,
              elevation: 99,
            }}>
            <Text
              style={{
                fontSize: 17,
                color: '#459',
                fontFamily: 'Roboto-Regular',
              }}>
              Habitants
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#45f',
                fontFamily: 'Roboto-Regular',
              }}>
              View all
            </Text>
          </View>
          <FlatList
            horizontal={true}
            nestedScrollEnabled={true}
            data={listContact}
            renderItem={({ item }) => (
              <View style={{ maxWidth: width * 0.3, marginHorizontal: 10 }}>
                <View style={{ alignItems: 'center' }}>
                  <Image
                    source={
                      item.picUser
                        ? { uri: HOST + item.picUser }
                        : require('../../assets/images/user.png')
                    }
                    style={{
                      width: width * 0.13,
                      height: width * 0.13,
                      borderRadius: 99,
                    }}
                  />
                </View>
                <View
                  style={{
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    rowGap: 5,
                    flex: 1,
                  }}>
                  <Text numberOfLines={1} style={styles.name}>
                    {item.nameUser}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      </View>
      {Platform.OS === 'android' && (
        <SafeAreaView mode="padding" edges={['bottom']} />
      )}
      <MagicModalPortal />
    </>
  );
};

export default HeaderProfile;

const styles = StyleSheet.create({
  textStat: { fontFamily: 'Roboto-Regular', fontSize: 20, color: '#45a' },
  titleStat: { fontFamily: 'Roboto-Regular', fontSize: 15, color: '#444' },
  ContainStat: { alignItems: 'center' },
  item: {
    paddingVertical: 5,
    paddingLeft: 10,
    flexDirection: 'row',
    width,
    alignItems: 'center',
    gap: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 5,
  },
  name: {
    // fontWeight: 'bold',
    flex: 1,
    color: '#444',
    fontFamily: 'Roboto-Regular',
    fontSize: width * 0.045,
    alignSelf: 'center',
  },
  subTitle: {
    color: 'grey',
  },
  avatar: {
    height: SIZE_PROFILE,
    // zIndex: 99,
    borderColor: '#fff',
    borderWidth: 3,
    width: SIZE_PROFILE,
    borderRadius: 100,
    position: 'absolute',
    bottom: -SIZE_PROFILE / 1.6,
    right: width / 1.2,
    transform: [{ translateX: SIZE_PROFILE / 2 }],
  },
  options: {
    // height: 80, // définir la hauteur de la vue modale
    width: '99%', // définir la largeur de la vue modale
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: 'absolute',
    paddingHorizontal: 30,
    // flexDirection: 'row',
    borderColor: '#3335',
    borderWidth: 0.4,
    bottom: 0,
    shadowColor: '#000',
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 1,
    // borderTopWidth: 1,
    alignSelf: 'center',
    rowGap: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
