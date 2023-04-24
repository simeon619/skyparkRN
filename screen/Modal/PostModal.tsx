/* eslint-disable react-native/no-inline-styles */
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dimensions,
  // Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import neighbord from '../../assets/images/padlock.png';
import world from '../../assets/images/worldwide.png';
import BottomSheet, { BottomSheetRefProps } from '../../components/BottomSheet';
import { InputPost } from '../../components/Inputs';
import { COLORS } from '../../themes/colors';
import { HOST } from '../../utils/metric';
// const { width, height: SCREEN_HEIGHT } = Dimensions.get('screen');
const { width } = Dimensions.get('window');
const visibilty = [
  {
    visibilty: 'quarter',
    description: 'Tout le monde pourra voir cette publication',
    icon: world,
  },
  {
    visibilty: 'building',
    description: 'Vos voisin uniquement verrons cette publication',
    icon: neighbord,
  },
];
const Post = ({ navigation, route }: { navigation: any; route: any }) => {
  const [audience, setAudience] = useState('building');
  const [heightPost, setHeightPost] = useState(0);
  const [uri, setUri] = useState('');
  const { vectorsB, vectorsQ, name } = route.params;
  console.log({ vectorsB, vectorsQ, name });

  const chooseImage = () => {
    ImagePicker.openPicker({
      // compressImageQuality: 0.2,
    })
      .then(image => {
        setUri(image.path);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      compressImageQuality: 0.1,
    })
      .then(image => {
        setUri(image.path);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (uri) {
      Image.getSize(uri, height => {
        setHeightPost(height / 3);
      });
    }
  }, [uri]);

  const ref = useRef<BottomSheetRefProps>(null);
  const onPress = useCallback(() => {
    const isActive = ref?.current?.isActive();
    if (isActive) {
      ref?.current?.scrollTo(0);
    } else {
      ref?.current?.scrollTo(-280);
    }
  }, []);

  // const modalStyle = useAnimatedStyle(() => {
  //   const u1 = !isShow
  //     ? {
  //         translateY: withDelay(100, withSpring(isShow ? 0 : SCREEN_HEIGHT)),
  //       }
  //     : { translateY: withSpring(isShow ? 0 : SCREEN_HEIGHT) };

  //   const u2 = !isShow ? 'none' : 'flex';
  //   return {
  //     transform: [u1],
  //   };
  // });

  const { control, handleSubmit, getValues } = useForm();

  const User = useSelector((state: any) => state.dataUser);

  async function sendPost() {
    let fileImage;
    if (uri) {
      let buffer = await RNFS.readFile(uri, 'base64');
      fileImage = {
        // ...uri,
        buffer,
        fileName: 'img',
        encoding: 'base64',
        size: 10000,
        type: 'image/jpg',
      };
      // console.log(buffer, uri);
    }
    const postContent = getValues('post');
    if (name) {
      setAudience(name);
      await vectorsQ.update({
        addNew: [
          {
            message: {
              user: User.userId,
              text: postContent,
              file: fileImage ? { url: [fileImage] } : undefined,
            },
            likeCount: 0,
          },
        ],
        paging: {
          page: 1,
          limit: 3,
          sort: {
            createdAt: -1,
          },
        },
      });
      navigation.goBack();
      setUri('');
      return;
    }
    if (audience === 'quarter') {
      await vectorsQ.update({
        addNew: [
          {
            message: {
              user: User.userId,
              text: postContent,
              file: fileImage ? { url: [fileImage] } : undefined,
            },
            likeCount: 0,
          },
        ],
        paging: {
          page: 1,
          limit: 3,
          sort: {
            createdAt: -1,
          },
        },
      });
    } else if (audience === 'building') {
      await vectorsB.update({
        addNew: [
          {
            message: {
              user: User.userId,
              text: postContent,
              file: fileImage ? { url: [fileImage] } : undefined,
            },
            likeCount: 0,
          },
        ],
        paging: {
          page: 1,
          limit: 3,
          sort: {
            createdAt: -1,
          },
        },
      });
    }
    setUri('');
    navigation.goBack();
  }

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#fff' }}>
        <SafeAreaView
          onTouchStart={() => {
            if (ref?.current?.isActive()) {
              ref?.current?.scrollTo(0);
              //   onPress();
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            padding: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 5,
              justifyContent: 'space-between',
              borderBottomWidth: 0.4,
              backgroundColor: '#fff',
              borderBottomColor: '#777',
            }}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                style={{ height: 35, width: 35 }}
                source={require('../../assets/images/arrowback.png')}
              />
            </Pressable>
            {
              <Pressable onPress={handleSubmit(sendPost)}>
                <Text
                  style={[
                    {
                      color: 'white',
                      fontSize: 18,
                      backgroundColor: COLORS.blue,
                      paddingHorizontal: 20,
                      paddingVertical: 5,
                      marginVertical: 5,
                      fontFamily: 'Ubuntu-Regular',
                      alignSelf: 'center',
                      fontWeight: '700',
                      borderRadius: 25,
                    },
                  ]}>
                  Publish
                </Text>
              </Pressable>
            }
          </View>
          <ScrollView style={{ flex: 1 }}>
            <View
              style={{
                width: '100%',
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
                gap: 10,
              }}>
              <Image
                style={styles.avatarPost}
                resizeMode="contain"
                source={
                  User.imgProfile[0]
                    ? { uri: HOST + User.imgProfile[0] }
                    : require('../../assets/images/user.png')
                }
              />

              {!name ? (
                <TouchableOpacity
                  onPress={onPress}
                  style={{
                    borderColor: COLORS.blue,
                    borderWidth: 1,

                    borderRadius: 5,
                    padding: 5,
                    zIndex: 200,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Ubuntu-Regular',
                      fontSize: 15,
                      textTransform: 'uppercase',
                    }}>
                    {audience}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    borderColor: COLORS.blue,
                    borderWidth: 1,
                    backgroundColor: COLORS.blue,
                    borderRadius: 5,
                    padding: 5,
                    zIndex: 200,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: 'Ubuntu-Regular',
                      fontSize: 15,
                      textTransform: 'uppercase',
                    }}>
                    {'  Post In '}
                    {name}
                  </Text>
                </View>
              )}
            </View>
            <InputPost
              control={control}
              name="post"
              placeholder="What's up write..."
            />

            {uri && (
              <View
                style={[
                  {
                    width: width * 0.95,
                    //  SCREEN_HEIGHT: SCREEN_HEIGHTPost,
                    maxHeight: heightPost,
                  },
                ]}>
                <Image
                  resizeMode="contain"
                  source={{ uri }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </View>
            )}
          </ScrollView>

          {/* <View style={{ height: 40, width: '100%' }}></View> */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              // height: 0,
              borderTopColor: COLORS.blue,
              borderTopWidth: 0.4,
              paddingVertical: 5,
              backgroundColor: 'white',
              paddingHorizontal: 15,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Pressable onPress={openCamera}>
                <Image
                  style={styles.icon}
                  source={require('../../assets/images/camera.png')}
                />
              </Pressable>

              <Pressable onPress={chooseImage}>
                <Image
                  style={styles.icon}
                  source={require('../../assets/images/gallery.png')}
                />
              </Pressable>

              <Pressable>
                <Image
                  style={styles.icon}
                  source={require('../../assets/images/location.png')}
                />
              </Pressable>
              <Pressable>
                <Image
                  style={styles.icon}
                  source={require('../../assets/images/ballot.png')}
                />
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
        <BottomSheet ref={ref}>
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <Text
              style={{
                fontSize: 21,
                fontFamily: 'Ubuntu-Regular',
                color: '#fff',
                marginLeft: 10,
              }}>
              Choisissez votre audience
            </Text>
            <FlashList
              data={visibilty}
              estimatedItemSize={80}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    ref?.current?.scrollTo(0);
                    setAudience(item.visibilty);
                  }}
                  style={{
                    borderBottomWidth: 1,
                    borderTopWidth: 1,
                    borderBottomColor: 'white',
                    borderTopColor: 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    padding: 20,
                    marginTop: 10,
                  }}>
                  <Image
                    source={item.icon}
                    style={{
                      width: width * 0.1,
                      height: width * 0.1,
                      tintColor: 'white',
                    }}
                  />
                  <View>
                    <Text
                      style={{
                        fontSize: 17,
                        fontFamily: 'Ubuntu-Regular',
                        color: 'white',
                        fontWeight: '700',
                        padding: 1,
                        textTransform: 'capitalize',
                      }}>
                      {item.visibilty}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: 'Ubuntu-Regular',
                        alignItems: 'center',
                        color: 'white',
                        fontWeight: '400',
                        padding: 1,
                      }}>
                      {item.description}
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          </View>
        </BottomSheet>
      </GestureHandlerRootView>
    </>
  );
};

export default Post;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // backgroundColor: COLORS.white,
  },
  textAreaContainer: {
    borderColor: '#555',
    borderWidth: 1,
    padding: 15,
  },
  placeholder: { fontSize: 16 },
  textArea: {
    padding: 15,
    justifyContent: 'flex-start',
  },
  icon: {
    height: 25,
    width: 25,
    // padding: 15,
    tintColor: COLORS.blue,
  },
  avatar: {
    height: 50,
    width: 50,
  },
  avatarPost: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: 99,
  },
  wrapper: {},
  separator: {
    height: 4,
    width: '100%',
    backgroundColor: 'red',
  },
  BodyContain: {
    // flex : 8
  },

  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
