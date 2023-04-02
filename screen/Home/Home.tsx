import React, { useEffect, useRef, useState } from 'react';

import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

import PagerView from 'react-native-pager-view';
import { useSelector } from 'react-redux';
import { Header } from '../../components/header';
import PostModal from '../../components/PostModal';
import Thread from '../../components/Thread';
import { COLORS } from '../../themes/colors';
import { RATIO_HEADER } from '../../utils/metric';
import { POST_DATA } from '../../utils/posts';
const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
export const Home = ({ navigation }: any) => {
  const scrollY = new Animated.Value(0, {
    useNativeDriver: true,
  });

  let HEADER_HEIGHT = (RATIO_HEADER * SCREEN_HEIGHT) / 100;

  const diffClamp = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);

  const headerY = diffClamp.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT / 1.8],
    extrapolate: 'clamp',
    // easing: Easing.bounce
  });

  const swiperRef = useRef<PagerView>(null);
  const [page, setPage] = useState(0);
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

  const handleScrollHeader = (e: number) => {
    scrollY.setValue(e);
  };

  const [isVisible, setIsVisible] = useState(false);
  const toggleModal = () => {
    setIsVisible(prev => !prev);
  };
  let Post = useSelector((state: any) => state.postData);
  return (
    <>
      <SafeAreaView style={styles.main}>
        <Pressable
          onPress={toggleModal}
          style={{
            position: 'absolute',
            padding: 14,
            zIndex: 85,
            bottom: 28,
            right: 25,
            borderRadius: 58,
            backgroundColor: '#005e',
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
          pageMargin ={19}
          ref={swiperRef}
          onPageSelected={e => {
            setPage(e.nativeEvent.position);
          }}
          >
          {/* Building */}
          <Thread 
            key={0}
            POST_DATA={Post}
            handleScrollHeader={handleScrollHeader}
            refreshing={refreshing}
            setRefreshing={setRefreshing}
          />
          {/* Neighborhood */}
          <Thread
            key={1}
            POST_DATA={POST_DATA}
            handleScrollHeader={handleScrollHeader}
            refreshing={refreshing}
            setRefreshing={setRefreshing}
          />
        </PagerView>
      </SafeAreaView>
      <PostModal toggleModal={toggleModal} isShow={isVisible} />
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
