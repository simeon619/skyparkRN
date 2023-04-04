import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dimensions,
  Image,
  Modal,
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
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../themes/colors';
import { visibilty } from '../utils/audience';
import { PostSchema } from '../utils/posts';
import SQuery from '../utils/squery/SQueryClient';
import { addPostServer } from '../wharehouse/store';
import BottomSheet, { BottomSheetRefProps } from './BottomSheet';
import { InputPost } from './Inputs';
const { width, height: SCREEN_HEIGHT } = Dimensions.get('screen');
let vectors: any = null;
let channel: any = null;
let i = 0;
const PostModal = ({
  toggleModal,
  isShow,
}: {
  toggleModal: (value: boolean) => void;
  isShow: boolean;
}) => {
  const Posts = useSelector((state: any) => state.postDataServer);
  const [audience, setAudience] = useState('Public');
  const [posts, setPosts] = useState([]);
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
      ref?.current?.scrollTo(-360);
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
  const toggleModalChild = (value: boolean) => {
    toggleModal(value);
  };
  const dispatch = useDispatch();
  const { control, handleSubmit, getValues } = useForm();
  
  let User = useSelector((state: any) => state.dataUser);
 
  useEffect(() => {

    initInstance();
    console.log('EST TU APPELLE PLUSIEUR FOIS', i++);
    
  }, []);
  const initInstance = async () => {
    const userId = User.userId;

    let model = await SQuery.Model('user');

    let user = await model.newInstance({ id: userId });

    let building = await user['building'];

    let community = await building['community'];

    let activities = await community['activities'];


    let activity = (await (await activities.page()).itemsInstance)[0];

    channel = await activity['channel'];

    vectors = await channel['vectors'];

    await vectors.update({ paging: { sort: { createdAt: -1 } } });

    vectors.when('refresh', async (data: any) => {
      if(data.length === 0) return
      const Id = data.added[0];

      console.log('*********ID********', data.added[0]);
      let postModel = await SQuery.Model('post');
      let post = await postModel.newInstance({ id: Id });
      let message = await post['message'];
      let user = await message['user'];
      let account = await user['account'];
      let name = await account['name'];
      let text = await message['text'];
      let timestamp = await message['createdAt'];
      let like = await post['likeCount'];
      let images: string[] = [];
      const userId = user.$id;
      const postId = Id;
      const randomCommentAuthorId = Math.floor(
        Math.random() * 1000000000,
      ).toString();
      if (uri) images.push(uri);

      const poste: PostSchema = {
        id: postId,
        author: {
          id: userId,
          name,
          picture:
            'https://images.pexels.com/photos/14737533/pexels-photo-14737533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        type: 'image',
        content: text,
        images,
        likes: like,
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
      console.log('2222@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

      dispatch(addPostServer(poste));

      /* 
      data.hasNextPage (boolean)
      data.hasprevPage (boolean)
      data.items : Array({docs})
      data.itemInstance : Array({instance})
      data.totalItems
      data.limit
      data.prevPage
      data.nextPage (index)
      data.page(actual index page)
      */
    });

    let data = await vectors.update();
    let i=0
    data.items.forEach(async (item: any) => {
      const Id = item._id;
      console.log(Id, '*****************ITEMID*******************', item.createdAt);

      let postModel = await SQuery.Model('post');
      let post = await postModel.newInstance({ id: Id });
      let message = await post['message'];
      let user = await message['user'];
      let account = await user['account'];
      let name = await account['name'];
      let text = await message['text'];
      let timestamp = await message['createdAt'];
      let like = await post['likeCount'];

      let images: string[] = [];
      const userId = user.$id;
      const postId = Id;
      const randomCommentAuthorId = Math.floor(
        Math.random() * 1000000000,
      ).toString();
      if (uri) images.push(uri);

      const poste: PostSchema = {
        id: postId,
        author: {
          id: userId,
          name,
          picture:
            'https://images.pexels.com/photos/14737533/pexels-photo-14737533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        type: 'image',
        content: text,
        images,
        likes: like,
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
      console.log('111@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',i++);
      dispatch(addPostServer(poste));
    });

  
  };



  async function sendPost(data: any) {
    let images: string[] = [];
    if (uri) images.push(uri);
    const postContent = getValues('post');

    channel['vectors'] = {
      addNew: [
        {
          message: {
            user: User.userId,
            text: postContent,
            fileList: images,
          },
          likeCount: 7,
        },
      ],
      paging: {
        page: 1,
        limit: 3,

        sort: {
          createdAt: -1,
        },
      },
    };
    toggleModal(false);
    setUri('');
  }
  return (
    <Portal>
      <Modal
        style={{
          position: 'absolute',
          zIndex: 199,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
        }}
        onRequestClose={() => {
          toggleModalChild(false);
        }}
        visible={isShow}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView
            onTouchStart={e => {
              if (ref?.current?.isActive()) {
                ref?.current?.scrollTo(0);
                console.log(e.target);
                onPress();
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
                  toggleModalChild(false);
                }}>
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
                  source={require('../assets/images/user.png')}
                />
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
                    }}>
                    {audience}
                  </Text>
                </TouchableOpacity>
              </View>
              <InputPost
                control={control}
                name="post"
                placeholder="What's up write..."
                isVisible={isShow}
              />

              {uri && (
                <View
                  style={[
                    {
                      width: '100%',
                      //  SCREEN_HEIGHT: SCREEN_HEIGHTPost,
                      maxHeight: heightPost,
                    },
                  ]}>
                  <Image
                    resizeMode="center"
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
      </Modal>
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

  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
