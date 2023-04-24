/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import bg from '../../../assets/images/chatBg.jpg';
import { COLORS } from '../../../themes/colors';
import { HOST, calculeDate } from '../../../utils/metric';
import SQuery from '../../../utils/squery/SQueryClient';
const { width, height: HS } = Dimensions.get('window');
const Discussion = ({ navigation, route }: { navigation: any; route: any }) => {
  const inputRef = useRef<TextInput>(null);

  const User = useSelector((state: any) => state.dataUser);
  const [user, setUser] = useState(route.params.user || route.params.contact);
  const vectors = route.params.vectors;
  const height = useSharedValue(40);
  const [text, setText] = useState('');
  const [showMessages, setShowMessages] = useState<any[]>([]);
  useEffect(() => {
    getMessages();
    // console.log({ vectors });
  }, []);
  const getMessages = async () => {
    await vectors.update({ paging: { sort: { createdAt: 1 } } });

    await vectors.when('update', async (data: any) => {
      if (!data.added[0]) {
        return;
      }
      let postModel = await SQuery.Model('post');
      let post = await postModel.newInstance({
        id: data.added[0],
      });
      let message = await post.message;
      let date = await message.createdAt;
      let MessageText = await message.text;
      let right = User.accountId === (await message.account).$id;
      let newMessage = [{ text: MessageText, right, date }];
      setShowMessages(prev => [...prev, ...newMessage]);
    });
    let messages = await vectors.page();
    let promises = messages.items.map(async (message: any) => {
      return new Promise(async res => {
        let messageModel = await SQuery.Model('message');
        let messageInstance = await messageModel.newInstance({
          id: message.message,
        });
        let MessageText = await messageInstance.text;
        let date = await messageInstance.createdAt;
        let right = User.accountId === (await messageInstance.account).$id;
        res({ text: MessageText, right, date });
      });
    });

    const results = await Promise.allSettled(promises);
    const newMessages = results
      .filter((result: any) => result.status === 'fulfilled')
      .map((result: any) => result.value);

    setShowMessages(prevMessages => [...newMessages, ...prevMessages]);
  };
  const handleContentSizeChange = useCallback((event: any) => {
    const newHeight = event.nativeEvent.contentSize.height;
    height.value = withTiming(newHeight, { duration: 100 });
  }, []);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: height.value,
      maxHeight: HS * 0.17,
    };
  });
  const sendMessage = async () => {
    let fileImage;

    await vectors.update({
      addNew: [
        {
          message: {
            user: User.userId,
            text,
            file: fileImage ? { url: [fileImage] } : undefined,
          },
          likeCount: 0,
        },
      ],
    });

    setText('');
  };

  const scrollViewRef = useRef<FlatList>(null);

  useLayoutEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [showMessages]);
  return (
    <ImageBackground source={bg} style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.blue} barStyle={'light-content'} />
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: COLORS.blue,
          justifyContent: 'space-between',
          height: 55,
          maxWidth: width,
          elevation: 99,
          zIndex: 99,
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: COLORS.blue,
            gap: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 6,
              gap: 5,
              paddingLeft: 5,
            }}>
            <Pressable
              style={{
                width: 30,
                height: 30,
                alignSelf: 'center',
              }}
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={require('../../../assets/images/arrowback.png')}
                style={{
                  tintColor: 'white',
                  width: width * 0.08,
                  height: width * 0.08,
                }}
              />
            </Pressable>

            <Image
              source={
                user.picUser
                  ? { uri: HOST + user.picUser }
                  : require('../../../assets/images/user.png')
              }
              style={{
                width: width * 0.11,
                height: width * 0.11,
                borderRadius: 99,
                alignSelf: 'center',
              }}
            />
          </View>

          <View style={{ justifyContent: 'center', gap: 2 }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: 'white',
                width: width * 0.35,
                fontSize: width * 0.055,
                fontFamily: 'Ubuntu-Regular',
              }}>
              {user.nameUser}
            </Text>
            <Text
              style={{
                color: '#ccc',
                fontSize: width * 0.035,
                fontFamily: 'Ubuntu-Regular',
              }}>
              Last seen{' '}
              {new Date(Number.parseInt(user.timestamp, 10)).toLocaleString(
                'ru-RU',
                {
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                },
              )}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: width * 0.059,
            marginRight: width * 0.02,
          }}>
          <Image
            source={require('../../../assets/images/video.png')}
            style={{
              width: width * 0.06,
              height: width * 0.06,
              tintColor: 'white',
            }}
          />
          <Image
            source={require('../../../assets/images/telephone.png')}
            style={{
              width: width * 0.055,
              height: width * 0.055,
              tintColor: 'white',
            }}
          />

          <Image
            source={require('../../../assets/images/option.png')}
            style={{
              width: width * 0.06,
              height: width * 0.06,
              tintColor: 'white',
            }}
          />
        </View>
      </View>

      <FlatList
        data={showMessages}
        renderItem={({ item, index }) => <MessageItem item={item} i={index} />}
        keyExtractor={(item, index) => index.toString()}
        ref={scrollViewRef}
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        ListFooterComponent={<View style={{ height: HS * 0.07 }} />}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-evenly',
          backgroundColor: 'white',
          position: 'absolute',
          bottom: 0,
          left: 1,
          right: 1,
          // width: width * 0.99,
        }}>
        <Pressable
          style={{
            aspectRatio: 1,
            width: width * 0.07,
            alignSelf: 'flex-end',
            marginLeft: width * 0.05,
            marginBottom: width * 0.02,
          }}
          onPress={() => {}}>
          <Image
            source={require('../../../assets/images/smile.png')}
            style={{
              tintColor: '#aaa',
              width: '100%',
              height: '100%',
            }}
          />
        </Pressable>

        <Animated.View style={[animatedStyles, { alignSelf: 'flex-end' }]}>
          {/* <SafeAreaView style={{}}> */}
          <TextInput
            ref={inputRef}
            onChangeText={setText}
            placeholder="Write something..."
            placeholderTextColor="#aaa"
            value={text}
            multiline={true}
            autoFocus={true}
            scrollEnabled={true}
            onContentSizeChange={handleContentSizeChange}
            style={{
              fontSize: width * 0.05,
              color: '#666',
              // paddingVertical: width * 0.09,
              fontFamily: 'Ubuntu-Regular',
              width: width * 0.7,
              marginLeft: width * 0.05,
            }}
          />
          {/* </SafeAreaView> */}
        </Animated.View>

        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-end',
            gap: 5,
            marginRight: width * 0.02,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (!text) {
                console.log('file');
              }
            }}
            style={{
              width: width * 0.1,
              height: width * 0.1,
              padding: width * 0.01,
            }}>
            <Image
              source={require('../../../assets/images/attach-file.png')}
              style={[
                {
                  tintColor: '#aaa',
                  width: '100%',
                  height: '100%',
                },
                text ? { opacity: 0 } : { opacity: 1 },
              ]}
            />
          </TouchableOpacity>
          <View
            style={{
              padding: width * 0.01,
              width: width * 0.095,
              height: width * 0.095,
              marginRight: width * 0.04,
            }}>
            {text ? (
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  sendMessage();
                }}>
                <Image
                  source={require('../../../assets/images/send.png')}
                  style={{
                    width: '100%',
                    height: '100%',
                    tintColor: 'grey',
                  }}
                />
              </TouchableOpacity>
            ) : (
              <Image
                source={require('../../../assets/images/microphone.png')}
                style={{
                  width: '100%',
                  height: '100%',
                  tintColor: 'grey',
                }}
              />
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};
const MessageItem = ({ item, i }: { item: any; i: number }) => {
  return (
    <View
      style={[
        {
          padding: 3,

          margin: 10,
          maxWidth: '80%',
          flexDirection: 'row',
          columnGap: 4,
          elevation: 99,
        },
        item.right
          ? {
              alignSelf: 'flex-end',
              backgroundColor: '#dff',
              // borderTopLeftRadius: 10,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }
          : {
              alignSelf: 'flex-start',
              backgroundColor: '#fff',
              borderTopRightRadius: 10,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            },
      ]}>
      <View
        style={{
          flexDirection: 'column',
          // gap: 10,
        }}>
        <Text
          style={{
            fontSize: width * 0.045,
            fontFamily: 'Roboto-Regular',
            color: '#444',
          }}>
          {item.text}
        </Text>
        <Text
          style={{
            fontSize: width * 0.033,
            fontFamily: 'Roboto-Regular',
            alignSelf: 'flex-end',
            color: '#5559',
          }}>
          {calculeDate(item.date)}
        </Text>
      </View>
    </View>
  );
};
export default Discussion;

// const styles = StyleSheet.create({});
