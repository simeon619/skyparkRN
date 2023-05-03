/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dimensions,
  FlatList,
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
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { MagicModalPortal, magicModal } from 'react-native-magic-modal';
import Video from 'react-native-video';
import { useSelector } from 'react-redux';
import neighbord from '../../assets/images/padlock.png';
import world from '../../assets/images/worldwide.png';
import { BottomSheetRefProps } from '../../components/BottomSheet';
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
  const [uris, setUris] = useState<ImageOrVideo[]>([]);
  const { vectorsB, vectorsQ, name } = route.params;
  console.log({ vectorsB, vectorsQ, name });

  const chooseImage = () => {
    ImagePicker.openPicker({
      compressImageQuality: 0.7,
      includeBase64: true,
      forceJpg: true,
      maxFiles: 4,
      multiple: true,
      mediaType: 'any',
    })
      .then(image => {
        setUris(image);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      compressImageQuality: 0.7,
      includeBase64: true,
      maxFiles: 4,
      multiple: true,
      mediaType: 'any',
    })
      .then(image => {
        // image.
        setUris(image);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const ResponseModal = () => (
    <View
      style={{
        // height: 200,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        bottom: 0,
        position: 'absolute',
      }}>
      <View style={styles.line} />
      <Text
        style={{
          fontSize: 21,
          fontFamily: 'Ubuntu-Regular',
          color: '#111',
          // marginLeft: 10,
          paddingVertical: 10,
        }}>
        Choisissez votre audience
      </Text>
      <FlatList
        data={visibilty}
        // estimatedItemSize={80}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              magicModal.hide(() => <ResponseModal />);
            }}
            style={{
              borderBottomWidth: 1,
              borderTopWidth: 1,
              borderBottomColor: '#333',
              borderTopColor: '#333',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingVertical: 10,
              // marginTop: 10,
            }}>
            <Image
              source={item.icon}
              style={{
                width: width * 0.1,
                height: width * 0.1,
                tintColor: '#333',
              }}
            />
            <View>
              <Text
                style={{
                  fontSize: 19,
                  fontFamily: 'Ubuntu-Regular',
                  color: '#333',
                  fontWeight: '700',
                  padding: 1,
                  textTransform: 'capitalize',
                }}>
                {item.visibilty}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Ubuntu-Regular',
                  alignItems: 'center',
                  color: '#333',
                  fontWeight: '400',
                  paddingRight: 21,
                  paddingBottom: 5,
                }}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
  const ref = useRef<BottomSheetRefProps>(null);

  const { control, handleSubmit, getValues } = useForm();

  const User = useSelector((state: any) => state.dataUser);
  console.log(uris);

  async function sendPost() {
    let results;
    if (uris.length > 0) {
      let buffers = uris.map(async uri => {
        return {
          t: uri.mime,
          b: await RNFS.readFile(uri.path, 'base64'),
          s: uri.size,
          n: uri.filename,
        };
      });
      // let buffer = await RNFS.readFile(uri, 'base64');

      results = buffers.map(async bufferPromise => {
        let buffer = await bufferPromise;
        return {
          buffer: buffer.b,
          fileName: buffer.n,
          encoding: 'base64',
          size: buffer.s,
          type: buffer.t,
        };
      });
      const values = [];
      for (const promise of results) {
        try {
          values.push(await promise);
        } catch (error) {
          console.log(error);
        }
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
                file: values?.length > 0 ? { url: [...values] } : undefined,
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
        setUris([]);
        return;
      }
      if (audience === 'quarter') {
        await vectorsQ.update({
          addNew: [
            {
              message: {
                user: User.userId,
                text: postContent,
                file: values?.length > 0 ? { url: [...values] } : undefined,
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
                file: values?.length > 0 ? { url: [...values] } : undefined,
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
      setUris([]);
      navigation.goBack();
    }
    console.log(uris[0]);
  }
  return (
    <>
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
          flex: 1,
          backgroundColor: '#fff',
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
                onPress={() => {
                  magicModal.show(() => <ResponseModal />);
                }}
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

          {uris.length > 0 && (
            <ScrollView
              contentContainerStyle={{
                backgroundColor: '#eee',
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                // width,
              }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {uris.map((uri, i) => (
                <View
                  key={i.toString()}
                  style={[
                    {
                      width: width * 0.45,
                      marginHorizontal: 15,
                      //  SCREEN_HEIGHT: SCREEN_HEIGHTPost,
                      borderColor: '#1115',
                      borderWidth: 1,
                      height: 300,
                      alignItems: 'center',
                    },
                    uris.length === 1 && {
                      width,
                      marginHorizontal: 0,
                    },
                  ]}>
                  {uri.mime?.includes('image') ? (
                    <FastImage
                      resizeMode={FastImage.resizeMode.cover}
                      source={{ uri: uri.path }}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  ) : (
                    <Video
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                      }}
                      source={{ uri: uri.path }}
                    />
                  )}
                </View>
              ))}
            </ScrollView>
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
      <MagicModalPortal />
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // backgroundColor: COLORS.white,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: '#459',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 2,
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
  BodyContain: {},
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
export default Post;
