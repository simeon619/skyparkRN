/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */

import { MenuView } from '@react-native-menu/menu';
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
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardInsetsView } from 'react-native-keyboard-insets';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import bg from '../../../assets/images/chatBg.jpg';
import { COLORS } from '../../../themes/colors';
import { HOST, calculeDate } from '../../../utils/metric';
import SQuery from '../../../utils/squery/SQueryClient';
const { width, height: HS } = Dimensions.get('window');
const LAST_ELEMENT_SCROLL = HS * 0.07;
const Discussion = ({ navigation, route }: { navigation: any; route: any }) => {
  const inputRef = useRef<TextInput>(null);

  const User = useSelector((state: any) => state.dataUser);
  const [user, setUser] = useState(route.params.user || route.params.contact);
  const vectors = route.params.vectors;
  const height = useSharedValue(40);
  const [text, setText] = useState('');
  const [showMessages, setShowMessages] = useState<any[]>([]);
  const [lastHeightComment, setLastHeightComment] = useState<number>(0);
  const [scrollAmount, setScrollAmount] = useState(0);
  const [canResizecontent, setCanResizeContent] = useState(false);
  const [Tag, setTag] = useState<any>(() => View);
  useEffect(() => {
    getMessages();
    // console.log({ vectors });
  }, []);
  const refreshListRemoved = (id: string) => {
    setShowMessages(prev => {
      return prev.filter(message => message.postId !== id);
    });
  };
  useEffect(() => {
    if (scrollAmount > lastHeightComment) {
      setCanResizeContent(true);
      setTag(() => KeyboardInsetsView);
    } else {
      setCanResizeContent(false);
      setTag(() => View);
    }
  }, [scrollAmount]);
  console.log({ canResizecontent });

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const maxScroll = contentSize.height - layoutMeasurement.height;
    const invertedScroll = maxScroll - contentOffset.y;
    setScrollAmount(invertedScroll);
  };

  const getMessages = async () => {
    await vectors.update({ paging: { sort: { createdAt: 1 } } });

    await vectors.when('update', async (data: any) => {
      console.log('MESSAGE REMOVED', data);

      if (data.added[0]) {
        let postModel = await SQuery.Model('post');
        let post = await postModel.newInstance({
          id: data.added[0],
        });
        let message = await post.message;
        let date = await message.createdAt;
        let MessageText = await message.text;
        let right = User.accountId === (await message.account).$id;
        let newMessage = [{ text: MessageText, right, date, postId: post.$id }];
        setShowMessages(prev => [...prev, ...newMessage]);
      } else if (data.removed[0]) {
        refreshListRemoved(data.removed[0]);
      }
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
        res({ text: MessageText, right, date, postId: message._id });
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

  const scrollViewRef = useRef<ScrollView>(null);

  useLayoutEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [showMessages]);
  return (
    <ImageBackground
      source={bg}
      style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
      <StatusBar backgroundColor={COLORS.blue} barStyle={'light-content'} />
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: COLORS.blue,
          justifyContent: 'space-between',
          width,
          // position: 'absolute',
          // top: 0,
          zIndex: 999,
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
                user?.picUser
                  ? { uri: HOST + user?.picUser }
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
              {user?.nameUser}
            </Text>
            <Text
              style={{
                color: '#ccc',
                fontSize: width * 0.035,
                fontFamily: 'Ubuntu-Regular',
              }}>
              Last seen{' '}
              {new Date(Number.parseInt(user?.timestamp, 10)).toLocaleString(
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
      <KeyboardInsetsView style={{ flex: 1 }}>
        <ScrollView
          onScroll={handleScroll}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-end',
            marginBottom: 25,
          }}
          ref={scrollViewRef}
          onContentSizeChange={(contentWidth, contentHeight) => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}>
          {showMessages.map((item, index) => (
            <MessageItem
              key={index.toString()}
              item={item}
              i={index}
              setLastHeightComment={setLastHeightComment}
              vectors={vectors}
            />
          ))}
          <View style={{ height: LAST_ELEMENT_SCROLL }} />
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-evenly',
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
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
      </KeyboardInsetsView>
      {Platform.OS === 'android' && (
        <SafeAreaView mode="padding" edges={['bottom']} />
      )}
    </ImageBackground>
  );
};
const MessageItem = ({
  item,
  i,
  vectors,
  setLastHeightComment,
}: {
  item: any;
  i: number;
  vectors: any;
  setLastHeightComment: any;
}) => {
  const onLayout = ({ nativeEvent }: any) => {
    setLastHeightComment?.(nativeEvent.layout.height + 25);
  };
  return (
    <>
      <MenuView
        isAnchoredToRight={item.right}
        title="Menu Title"
        onPressAction={async ({ nativeEvent }) => {
          if (nativeEvent.event === 'Delete') {
            await vectors.update({
              remove: [item.postId],
            });
          }
        }}
        actions={[
          {
            id: 'Delete',
            image: 'ic_menu_add',
            title: '🗑 Delete',
            titleColor: 'black',
          },
          {
            id: 'pin',
            title: '📌 pin',
            titleColor: 'black',
          },
          {
            id: 'respond',
            title: '⬅ respond ',
            titleColor: 'black',
          },
          {
            id: 'copy',
            title: '🗒 copy',
            titleColor: 'black',
          },
        ]}
        shouldOpenOnLongPress={false}>
        <TouchableOpacity
          onLayout={onLayout}
          onPress={e => {}}
          onLongPress={() => {
            console.log('ya koi');
          }}
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
        </TouchableOpacity>
      </MenuView>
    </>
  );
};
const styles = StyleSheet.create({
  options: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',

    marginTop: 22,
    width: '80%',
    // bottom: 0,
    // shadowColor: '#000',
    // overflow: 'hidden',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 50,
    // borderTopWidth: 1,
    // alignSelf: 'center',
    // alignItems: 'center',
    // justifyContent: 'space-around',
    backgroundColor: '#fff',
  },
  item: {
    paddingVertical: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    // width,
    alignItems: 'center',
    gap: 15,
    backgroundColor: '#fff',
    // marginTop: 5,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: width * 0.065,
    fontFamily: 'Roboto-Regular',
    color: '#123',
  },
});
export default Discussion;

// const styles = StyleSheet.create({});
