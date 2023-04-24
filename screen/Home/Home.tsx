/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';

import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';

import PagerView from 'react-native-pager-view';
import { useSelector } from 'react-redux';
import Thread from '../../components/Thread';
import { Header } from '../../components/header';
import { COLORS } from '../../themes/colors';
import { HOST, RATIO_HEADER } from '../../utils/metric';
import { PostSchema } from '../../utils/posts';
import SQuery from '../../utils/squery/SQueryClient';
const { height: SCREEN_HEIGHT, width } = Dimensions.get('window');
export const Home = ({ navigation }: any) => {
  const scrollY = new Animated.Value(0, {
    useNativeDriver: true,
  });

  const HEADER_HEIGHT = (RATIO_HEADER * SCREEN_HEIGHT) / 100;

  const diffClamp = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);

  const headerY = diffClamp.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
    // easing: Easing.bounce
  });
  const tX = diffClamp.interpolate({
    inputRange: [0, HEADER_HEIGHT / 2],
    outputRange: [0, 100],
    extrapolate: 'clamp',
    // easing: Easing.bounce
  });
  // const upDown = diffClamp.interpolate({
  //   inputRange: [
  //     0,
  //     HEADER_HEIGHT / 10,
  //     HEADER_HEIGHT / 7,
  //     HEADER_HEIGHT / 5,
  //     HEADER_HEIGHT / 4,
  //     HEADER_HEIGHT / 3,
  //     HEADER_HEIGHT / 2,
  //   ],
  //   outputRange: [1, 1, 1, 1, 1, 1, 0],
  //   extrapolate: 'clamp',
  //   // easing: Easing.bounce
  // });
  const handleScrollHeader = (e: number) => {
    scrollY.setValue(e);
    // navigation.setOptions({ tabBarStyle: { display: 'none' } });
  };

  const swiperRef = useRef<PagerView>(null);
  const [page, setPage] = useState(0);
  const [vectorB, setVectorB] = useState(null);
  const [postBuilding, setPostBuilding] = useState<PostSchema[]>([]);
  const [postQuarter, setPostQuarter] = useState<PostSchema[]>([]);
  const [vectorQ, setVectorQ] = useState(null);
  const onSwitchPage = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.setPage(index);
    }
  };
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    if (refreshing) {
      //fetch data
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    initializePost(
      './account/address/quarter/Thread',
      setVectorQ,
      setPostQuarter,
    );

    initializePost(
      './account/address/building/Thread',
      setVectorB,
      setPostBuilding,
    );
  }, []);

  const User = useSelector((state: any) => state.dataUser);

  const initializePost = async (
    path: string,
    setVector: any,
    setPosts: any,
  ) => {
    const userId = User.userId;
    const model = await SQuery.Model('user');
    const modeluser = await model.newInstance({ id: userId });
    let threadChannel = null;
    try {
      threadChannel = await modeluser.extractor(path);
    } catch (error) {}
    console.log({ threadChannel });
    const vectors = await threadChannel?.vectors;
    setVector(vectors);
    await vectors.update({ paging: { sort: { createdAt: 1 } } });
    vectors.when('update', async (data: any) => {
      if (!data.added[0]) {
        return;
      }
      const Id = data.added[0];

      const postModel = await SQuery.Model('post');
      const post = await postModel.newInstance({ id: Id });
      const message = await post.message;
      const account = await message.account;
      const name = await account.name;
      const profile = await account.profile;
      const imgProfile = (await profile.imgProfile)[0];
      const text = await message.text;
      const file = await message.file;
      let urlArray;
      if (file) {
        urlArray = await file.url;
      }

      const date = new Date(await message.createdAt);
      const timestamp = date.getTime().toString();
      const like: number = await new Promise(res => {
        SQuery.emit('post:like', { postId: Id }, (result: any) => {
          if (result.error) {
            return res(0);
          }
          res(result.response);
        });
      });

      const accountId = account.$id;
      const randomCommentAuthorId = Math.floor(
        Math.random() * 999999999999,
      ).toString();

      const postGet: PostSchema = {
        id: Id,
        keyId: randomCommentAuthorId,
        author: {
          id: accountId,
          name,
          picture: imgProfile ? HOST + imgProfile : '',
        },
        type: 'image',
        content: text,
        images: urlArray,
        likes: like,
        timestamp,
      };
      setPosts((prev: any) => [postGet, ...prev]);
    });

    const data = await vectors.update();

    let storePost: PostSchema[] = (await getNewData(data))
      .filter(p => !!p.value)
      .map(p => p.value);
    setPosts((prev: any) => [...prev, ...storePost]);
  };
  async function getNewData(data: any): Promise<any[]> {
    return await Promise.allSettled(
      data.items.map(async (item: any) => {
        const Id = item._id;
        const postModel = await SQuery.Model('post');
        const post = await postModel.newInstance({ id: Id });

        const message = await post.message;

        const account = await message.account;

        const name = await account.name;

        const text = await message.text;

        const profile = await account.profile;

        const imgProfile = (await profile.imgProfile)[0];

        const file = await message.file;

        let urlArray;
        if (file) {
          urlArray = await file.url;
        }

        const like: number = await new Promise(res => {
          SQuery.emit('post:like', { postId: Id }, (result: any) => {
            if (result.error) {
              return res(0);
            }
            res(result.response);
          });
        });

        const date = new Date(await message.createdAt);
        const timestamp = date.getTime().toString();
        const accountId = account.$id;
        const KeyId = Math.floor(Math.random() * 99999999).toString();
        const postGet: PostSchema = {
          id: Id,
          keyId: KeyId,
          author: {
            id: accountId,
            name,
            picture: imgProfile ? HOST + imgProfile : '',
          },
          type: 'image',
          content: text,
          images: urlArray,
          likes: like,
          timestamp,
        };

        return postGet;
      }),
    );
  }
  return (
    <>
      <SafeAreaView style={styles.main}>
        <StatusBar backgroundColor={'#fff'} />
        <Animated.View
          onTouchEnd={() => {
            navigation.getParent().navigate('post', {
              vectorsB: vectorB,
              vectorsQ: vectorQ,
            });
          }}
          style={{
            position: 'absolute',
            padding: width * 0.04,
            zIndex: 85,
            borderWidth: 1,
            elevation: 99,
            borderColor: '#4444',
            bottom: 28,
            right: 25,
            borderRadius: 58,
            // backgroundColor: '#00cc9944',
            backgroundColor: COLORS.blue,
            transform: [{ translateX: tX }],
          }}>
          <Image
            source={require('../../assets/images/pen.png')}
            style={{
              width: width * 0.07,
              height: width * 0.07,
              tintColor: '#fff',
            }}
          />
        </Animated.View>
        <Animated.View
          style={[
            {
              position: 'absolute',
              backgroundColor: '#fff',
              elevation: 10,
              left: 0,
              right: 0,
              top: 0,
              minHeight: HEADER_HEIGHT, /// au lieu de jouer avec le header joue avec le flex
              zIndex: 2,
              maxHeight: 150,
              transform: [{ translateY: headerY }],
            },
          ]}>
          <Header
            navigation={navigation}
            page={page}
            onSwitchPage={onSwitchPage}
          />
        </Animated.View>
        <PagerView
          style={styles.wrapper}
          initialPage={0}
          pageMargin={190}
          ref={swiperRef}
          onPageSelected={e => {
            setPage(e.nativeEvent.position);
          }}>
          {/* Building */}
          <Thread
            key={0}
            POST_DATA={postBuilding}
            handleScrollHeader={handleScrollHeader}
            refreshing={refreshing}
            navigation={navigation}
            setRefreshing={setRefreshing}
          />
          {/* Neighborhood */}
          <Thread
            key={1}
            POST_DATA={postQuarter}
            navigation={navigation}
            handleScrollHeader={handleScrollHeader}
            refreshing={refreshing}
            setRefreshing={setRefreshing}
          />
        </PagerView>
      </SafeAreaView>
    </>
  );
};

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
  wrapper: { flex: 1 },
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
