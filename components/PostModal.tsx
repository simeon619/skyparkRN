import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import { Portal } from 'react-native-paper';
import Animatedr, {
  useAnimatedStyle,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../themes/colors';
import { visibilty } from '../utils/audience';
import { PostSchema } from '../utils/posts';
import { addPost } from '../wharehouse/store';
import BottomSheet, { BottomSheetRefProps } from './BottomSheet';
import { InputPost } from './Inputs';
const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PostModal = ({
  toggleModal,
  isShow,
}: {
  toggleModal: any;
  isShow: boolean;
}) => {
  const [audience, setAudience] = useState('Public');
  const [heightPost, setHeightPost] = useState(0);
  const [uri, setUri] = useState('');
  const chooseImage = () => {
    ImagePicker.openPicker({})
      .then(image => {
        setUri(image.path);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const openCamera = () => {
    ImagePicker.openCamera({})
      .then(image => {
        setUri(image.path);
      })
      .catch(e => {
        console.log(e);
      });
  };
  useEffect(() => {
    if (!!uri) {
      Image.getSize(uri, (width, height) => {
        setHeightPost(height);
      });
    }
  }, [uri]);

  const ref = useRef<BottomSheetRefProps>(null);
  const onPress = useCallback(() => {
    const isActive = ref?.current?.isActive();
    if (isActive) {
      ref?.current?.scrollTo(0);
    } else {
      ref?.current?.scrollTo(-360);
    }
  }, []);

  const modalStyle = useAnimatedStyle(() => {
    const u1 = !isShow
      ? {
          translateY: withDelay(400, withSpring(isShow ? 0 : SCREEN_HEIGHT)),
        }
      : { translateY: withSpring(isShow ? 0 : SCREEN_HEIGHT) };
    return {
      transform: [u1],
    };
  });

  const toggleModalChild = () => {
    toggleModal();
  };

  const { control, handleSubmit, setFocus, reset, register, getValues } =
    useForm();

  useEffect(() => {
    if (!isShow) {
      console.log(getValues('post'));
      Keyboard.dismiss();
      reset({ post: '' });
      setFocus('post');
    } else {
      setFocus('post');
    }
  }, [isShow]);
  let User = useSelector((state: any) => state.dataUser);
  const dispatch = useDispatch();
  let collectPost: PostSchema;
  function sendPost(data: any) {
    let images: string[] = [];
    const userId = User.userId;
    const postId = Math.floor(Math.random() * 999999999).toString();
    const name = User.name ? User.name : 'jean gnaniri';
    const likes = 0;
    const randomCommentAuthorId = Math.floor(
      Math.random() * 1000000000,
    ).toString();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    if (uri) images.push(uri);
    console.log(uri, 'dou tu viens');

    const postContent = getValues('post');

    const post: PostSchema = {
      id: postId,
      author: {
        name: name,
        picture:
          'https://images.pexels.com/photos/14737533/pexels-photo-14737533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
      type: 'image',
      content: postContent,
      images,
      likes,
      comments: [
        {
          author: {
            name: 'Jane Doe',
            id: randomCommentAuthorId,
          },
          content: 'randomCommentContent',
          timestamp,
        },
      ],
      timestamp,
    };
    dispatch(addPost(post));
    toggleModal();

    setUri('');
  }

  // useEffect(() => {
  //   return () => {
  //     reset({ post: 'quoicubeh' });
  //   };
  // }, []);

  return (
    <Portal>
      <Animatedr.View
        style={[
          {
            position: 'absolute',
            zIndex: 99,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
          },
          modalStyle,
        ]}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView
            onTouchStart={e => {
              if (ref?.current?.isActive) ref?.current?.scrollTo(0);
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
              <Pressable onPress={toggleModalChild}>
                <Image
                  style={{ height: 35, width: 35 }}
                  source={require('../assets/images/arrowback.png')}
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
                        paddingVertical: 10,
                        fontFamily: 'Ubuntu-Regular',
                        alignSelf: 'center',
                        fontWeight: '700',
                        borderRadius: 5,
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
                  source={require('../assets/images/user.png')}
                />
                <TouchableOpacity
                  onPress={onPress}
                  style={{
                    borderColor: COLORS.blue,
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 5,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Ubuntu-Regular',
                      fontSize: 15,
                    }}>
                    {audience}
                  </Text>
                </TouchableOpacity>
              </View>
              <InputPost
                control={control}
                name="post"
                placeholder="Whats' up"
                isVisible={isShow}
              />

              {uri && (
                <View
                  style={[
                    {
                      width: '100%',
                      //  SCREEN_HEIGHT: SCREEN_HEIGHTPost,
                      maxHeight: SCREEN_HEIGHT / 1.8,
                    },
                  ]}>
                  <Image
                    resizeMode="cover"
                    source={
                      uri ? { uri } : require('../assets/images/user.png')
                    }
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
                    source={require('../assets/images/camera.png')}
                  />
                </Pressable>

                <Pressable onPress={chooseImage}>
                  <Image
                    style={styles.icon}
                    source={require('../assets/images/gallery.png')}
                  />
                </Pressable>

                <Pressable>
                  <Image
                    style={styles.icon}
                    source={require('../assets/images/location.png')}
                  />
                </Pressable>
                <Pressable>
                  <Image
                    style={styles.icon}
                    source={require('../assets/images/ballot.png')}
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
                      source={require('../assets/images/worldwide.png')}
                      style={{ width: 30, height: 30 }}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 17,
                          fontFamily: 'Ubuntu-Regular',
                          color: 'black',
                          fontWeight: '700',
                        }}>
                        {item.visibilty}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: 'Ubuntu-Regular',
                          color: 'black',
                          fontWeight: '400',
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
      </Animatedr.View>
    </Portal>
  );
};

export default PostModal;

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
    padding: 15,
    tintColor: COLORS.blue,
  },
  avatar: {
    height: 50,
    width: 50,
  },
  avatarPost: {
    height: 40,
    width: 40,
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

  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
