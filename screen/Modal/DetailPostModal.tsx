/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';

import ImagePicker from 'react-native-image-crop-picker';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useSelector } from 'react-redux';
import { PostItem } from '../../components/Post/Postcomponent';
import { COLORS } from '../../themes/colors';
import SQuery from '../../utils/squery/SQueryClient';
const { width, height: HS } = Dimensions.get('window');

const DetailPost = ({ route, navigation }: { route: any; navigation: any }) => {
  const inputRef = useRef<TextInput>(null);

  const [text, setText] = useState('');
  const [channelPost, setChannelPost] = useState<any>(null);
  const [uri, setUri] = useState('');
  const User = useSelector((state: any) => state.dataUser);

  const Comments = useSelector((state: any) => state.commentPost);

  let showComment = Comments[route.params.id].results;
  const Commen = useSelector((state: any) => state.commentPost);
  const height = useSharedValue(0);
  const handleContentSizeChange = useCallback((event: any) => {
    const newHeight = event.nativeEvent.contentSize.height;
    height.value = withTiming(newHeight, { duration: 100 });
  }, []);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: height.value,
      maxHeight: HS * 0.15,
    };
  });
  console.log({ Commen });

  const chooseImage = () => {
    ImagePicker.openPicker({})
      .then(image => {
        setUri(image.path);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const send = async () => {
    let fileImage: any;
    if (uri) {
      let buffer = await RNFS.readFile(uri, 'base64');
      fileImage = {
        buffer,
        fileName: 'img',
        encoding: 'base64',
        size: 10000,
        type: 'image/jpg',
      };
    }
    try {
      SQuery.emit(
        'post:comments',
        {
          id: route.params.id,
          newPostData: {
            message: {
              text: text,
              file: fileImage ? { url: [fileImage] } : undefined,
            },
          },
          modelPath: 'post',
          property: 'comments',
        },
        (result: any) => {
          if (result.error) {
            console.log('ERROR DE', result);
          }

          // console.log({ UPDATE: result.response });
        },
      );
      setText('');
      setUri('');
    } catch (error) {
      console.log(error);
    }
  };
  const offset = useSharedValue(HS * 0.06);

  const offsetAnime = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value }],
    };
  });
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', Kevent => {
      offset.value = withTiming(0);
    });
    Keyboard.addListener('keyboardDidHide', Kevent => {
      offset.value = withTiming(HS * 0.06);
    });
  }, []);
  const scrollViewRef = useRef<FlatList>(null);

  useLayoutEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [Comments]);

  return (
    <View style={{ flex: 1, backgroundColor: '#eee' }}>
      <StatusBar backgroundColor={'#eee'} barStyle={'dark-content'} />
      <View
        style={{
          height: 40,
          borderBottomColor: 'grey',
          borderBottomWidth: 0.2,
          backgroundColor: '#eee',
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 10,
          columnGap: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{ width: 20, height: 20, tintColor: 'black' }}
            source={require('../../assets/images/comment.png')}
          />
          <Text style={{ fontSize: 20, color: 'black' }}>
            {' '}
            {/* {Comments?.length}{' '} */}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{ width: 20, height: 20, tintColor: 'black' }}
            source={require('../../assets/images/like_post.png')}
          />
          <Text style={{ fontSize: 20, color: 'black' }}> 0 </Text>
        </View>
      </View>
      <FlatList
        data={showComment}
        renderItem={({ item, index }) => <PostItem item={item} i={index} />}
        keyExtractor={(item, index) => index.toString()}
        ref={scrollViewRef}
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-end',
          padding: 10,
          backgroundColor: '#ffffff',
        }}
        inverted={true}
        ListHeaderComponent={<View style={{ height: HS * 0.07 }} />}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            // width,
            backgroundColor: '#ebeaea',
          },
          offsetAnime,
        ]}>
        {!!uri && (
          <View style={{ alignItems: 'center', marginVertical: 5 }}>
            <Image
              style={{ width: width * 0.7, height: width * 0.4 }}
              source={{ uri }}
              resizeMode="cover"
            />
          </View>
        )}
        <Animated.View
          style={[
            {
              // width: width,
              borderColor: 'black',
              borderWidth: 0.1,
              borderRadius: 20,
              backgroundColor: '#fff0',
              flexDirection: 'row',
              justifyContent: 'center',
              width: width * 0.9,
              marginLeft: 20,
            },
            animatedStyles,
          ]}>
          <TextInput
            ref={inputRef}
            onChangeText={setText}
            placeholder="Your comment..."
            placeholderTextColor="grey"
            value={text}
            multiline={true}
            autoFocus={route.params.showKeyBoard}
            scrollEnabled={true}
            focusable={true}
            onContentSizeChange={handleContentSizeChange}
            style={{
              fontSize: width * 0.05,
              color: '#444',
              backgroundColor: '#fff',
              fontFamily: 'Ubuntu-Regular',
              paddingHorizontal: width * 0.05,
              // paddingVertical: width * 0.03,
              // marginTop: 2,
              borderRadius: 10,
              width: '100%',
            }}
          />
        </Animated.View>

        <View
          style={[
            {
              justifyContent: 'space-between',
              alignItems: 'baseline',
              flexDirection: 'row',
              width,
              // gap: width * 0.5,
              backgroundColor: '#ebeaea',
            },
          ]}>
          <View
            style={[
              {
                flexDirection: 'row',
                gap: width * 0.04,
                paddingLeft: width * 0.02,
                paddingVertical: width * 0.025,
              },
            ]}>
            <Pressable
              onPress={() => {
                chooseImage();
              }}>
              <Image
                style={{
                  width: width * 0.07,
                  height: width * 0.07,
                  tintColor: '#777',
                }}
                source={require('../../assets/images/camera_post.png')}
              />
            </Pressable>

            <Image
              style={{
                width: width * 0.07,
                height: width * 0.07,
                tintColor: '#777',
              }}
              source={require('../../assets/images/gif.png')}
            />
            <Image
              style={{ width: width * 0.07, height: width * 0.07 }}
              source={require('../../assets/images/smile_post.png')}
            />
          </View>
          <Pressable style={[{ paddingRight: 15 }]} onPress={() => send()}>
            <Image
              style={[
                {
                  width: width * 0.08,
                  height: width * 0.08,
                  tintColor: COLORS.blue,
                },
                !text && { tintColor: 'grey' },
              ]}
              source={require('../../assets/images/send_post.png')}
            />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};
// const PostItem = ({ item, i }: { item: commentSchema; i: number }) => {
//   return (
//     <View
//       style={{
//         maxWidth: width * 0.9,
//         marginVertical: 10,
//         alignSelf: 'flex-start',
//       }}>
//       <View
//         style={{
//           flexDirection: 'row',
//           columnGap: 5,
//           alignItems: 'flex-start',
//         }}>
//         <Image
//           style={{
//             height: width * 0.11,
//             width: width * 0.11,
//             borderRadius: 99,
//           }}
//           source={
//             item.picUser
//               ? { uri: HOST + item.picUser }
//               : require('../../assets/images/user.png')
//           }
//         />
//         <View>
//           <View
//             style={{
//               borderColor: '#4442',
//               borderWidth: 0.4,
//               alignSelf: 'flex-start',
//               borderRadius: 10,
//               maxWidth: width * 0.9 - width * 0.11,
//               padding: 5,
//               elevation: 1,
//               backgroundColor: 'white',
//             }}>
//             <Text
//               style={{
//                 color: '#444',
//                 fontSize: width * 0.035,
//                 fontFamily: 'Ubuntu-Bold',
//               }}>
//               {item.name}
//             </Text>
//             <Text
//               style={{
//                 fontSize: width * 0.045,
//                 color: '#444',
//                 textAlignVertical: 'bottom',
//                 // elevation: 1,
//                 fontFamily: 'Ubuntu-Light',
//               }}>
//               {item.commentaire}
//             </Text>
//           </View>

//           <View>
//             <View style={{ flexDirection: 'row', gap: 15, marginVertical: 4 }}>
//               <TouchableOpacity>
//                 <Text
//                   style={{
//                     color: '#444',
//                     fontSize: 14,
//                     fontFamily: 'Ubuntu-Bold',
//                   }}>
//                   {' '}
//                   Like{' '}
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity>
//                 <Text
//                   style={{
//                     color: '#444',
//                     fontSize: 14,
//                     fontFamily: 'Ubuntu-Bold',
//                   }}>
//                   Response
//                 </Text>
//               </TouchableOpacity>
//             </View>
//             <Text
//               style={{
//                 color: 'grey',
//                 fontSize: 13,
//                 fontFamily: 'Ubuntu-Regular',
//               }}>
//               {formatDistance(new Date(item.time), new Date(), {
//                 addSuffix: true,
//                 includeSeconds: true,
//                 locale: fr,
//               })}
//             </Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };
export default DetailPost;

// const styles = StyleSheet.create({});
