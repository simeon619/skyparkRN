import React, { useEffect, useRef, useState } from 'react';
import { Easing } from 'react-native';

import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { Header } from '../../components/header';
import Thread from '../../components/Thread';
import { POST_DATA, POST_DATA2 } from '../../posts';
import { RATIO_HEADER } from '../../utils/metric';

const { width, height } = Dimensions.get('window');
export const Home = ({ navigation }: any) => {
  const scrollY = new Animated.Value(0, {
    useNativeDriver: true,
  });

  let HEADER_HEIGHT = (RATIO_HEADER * height) / 100;

  const diffClamp = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);

  const headerY = diffClamp.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT / 1.8],
    extrapolate: "clamp",
    // easing: Easing.bounce
  });

  const swiperRef = useRef<Swiper>(null);
  const [page, setPage] = useState(0);


  const onSwitchPage = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.scrollTo(index);
    }
  };
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (refreshing) {
      //fetch data
      setRefreshing(false);
    }
  }, [refreshing]);

  const handleScrollHeader = (e: number) => {
    scrollY.setValue(e);
  };

  return (
    <SafeAreaView style={styles.main}>
      <Pressable
        style={{
          position: 'absolute',
          padding: 14,
          zIndex: 85,
          bottom: 28,
          right: 25,
          borderRadius: 58,
          backgroundColor: '#05a8',
        }}>
        <Image
          source={require('../../assets/images/newPost.png')}
          style={{
            width: 28,
            height: 28,
          }}
        />
      </Pressable>

      <Animated.View
        style={[
          {
            position: 'absolute',
            backgroundColor: '#eeeeeeee',
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
      <Swiper
        style={styles.wrapper}
        loop={false}
        ref={swiperRef}
        bounces={false}
        // index={page}
        showsPagination={false}
        onIndexChanged={i => setPage(i)}>
        {/* news */}
        <Thread
          POST_DATA={POST_DATA}
          handleScrollHeader={handleScrollHeader}
          refreshing={refreshing}
          setRefreshing={setRefreshing}
        />
        {/* Market */}
        <Thread
          POST_DATA={POST_DATA2}
          handleScrollHeader={handleScrollHeader}
          refreshing={refreshing}
          setRefreshing={setRefreshing}
        />
      </Swiper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // backgroundColor: COLORS.white,
  },
  avatar: {
    height: 50,
    width: 50,
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
  // HeaderContain: {
  //   position: 'absolute',
  //   backgroundColor: 'purple',
  //   zIndex : 1,
  //   elevation : 1000,
  //   left: 0,
  //   right: 0,
  //   top: 0,
  //   height: HEADER_HEIGHT,
  //   transform : [{translateY : headerY}]
  // },

  // wrapper: {},
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
