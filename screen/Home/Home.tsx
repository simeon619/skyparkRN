import { FlashList } from '@shopify/flash-list';
import { useEffect, useState } from 'react';

import {
  Animated,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  View,
  Pressable
} from 'react-native';
import Swiper from 'react-native-swiper';
import { Header } from '../../components/header';
import Postcomponent from '../../components/Post/Postcomponent';
import { POST_DATA } from '../../posts';
import { COLORS } from '../../themes/colors';
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
    outputRange: [0, -HEADER_HEIGHT / 1.6],
    extrapolate: 'clamp',
  });
  const [page, setPage] = useState(0);

  const fnPage1 = () => {
    setPage(0);
  };
  const fnPage2 = () => {
    setPage(1);
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
          backgroundColor:'#05a',
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
            backgroundColor: '#ffffffee',
            elevation: 1,
            left: 0,
            right: 0,
            top: 0,
            minHeight: HEADER_HEIGHT, /// au lieu de jouer avec le header joue avec le flex
            zIndex: 2,
            maxHeight: 150,
            // backgroundColor: color,
            transform: [{ translateY: headerY }],
          },
        ]}>
        <Header
          navigation={navigation}
          page={page}
          onbtn1={fnPage1}
          onbtn2={fnPage2}
        />
      </Animated.View>
      <Swiper
        style={styles.wrapper}
        loop={false}
        bounces={false}
        index={page}
        showsPagination={false}
        onIndexChanged={i => setPage(i)}>
        {/* news */}
        <FlashList
          key={1}
          data={POST_DATA}
          estimatedItemSize={height / 2.3}
          bounces={true}
          refreshing={refreshing}
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
          onRefresh={() => setRefreshing(true)}
          onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
            handleScrollHeader(e.nativeEvent.contentOffset.y);
          }}
          scrollEventThrottle={16}
          // extraData={}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Postcomponent posts={item} key={item.id} />
          )}
        />
        {/* Market */}
        <FlashList
          key={2}
          data={POST_DATA}
          estimatedItemSize={height / 2.3}
          bounces={true}
          refreshing={refreshing}
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
          onRefresh={() => setRefreshing(true)}
          onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
            // scrollY.setValue(e.nativeEvent.contentOffset.y);
            handleScrollHeader(e.nativeEvent.contentOffset.y);
          }}
          scrollEventThrottle={16}
          // extraData={}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Postcomponent posts={item} key={item.id} />
          )}
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
