import { FlashList } from '@shopify/flash-list';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Animated, Dimensions, SafeAreaView, StyleSheet } from 'react-native';
import { NativeScrollEvent } from 'react-native/Libraries/Components/ScrollView/ScrollView';
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import Postcomponent from '../../components/Post/Postcomponent';
import { POST_DATA } from '../../posts';
import { RATIO_HEADER } from '../../utils/metric';
const { width, height } = Dimensions.get('window');
const News = ({
  scrollY,
}: {
  scrollY: Dispatch<SetStateAction<Animated.Value>>;
}) => {
  let HEADER_HEIGHT = (RATIO_HEADER * height) / 100;
  const y = new Animated.Value(0, {
    useNativeDriver: true,
  });

  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    if (refreshing) {
      //fetch data
      setRefreshing(false);
    }
  }, [refreshing]);
  //   const handleScroll = (e: number) => {
  //     console.log('lololloo', e);
  //     scrollY(prev => prev);
  //   };
  return (
    <SafeAreaView style={styles.main}>
      <FlashList
        data={POST_DATA}
        estimatedItemSize={10}
        bounces={true}
        refreshing={refreshing}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        onRefresh={() => setRefreshing(true)}
        //   onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
        //     scrollY.setValue(e.nativeEvent.contentOffset.y);
        //   }}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
          let yr: any = e.nativeEvent.contentOffset.y;
          //   console.log(yr);
          scrollY((prev): any => {
            console.log(prev, 'jjj');

            y.setValue(yr);
            return y;
          });
        }}
        scrollEventThrottle={16}
        // extraData={}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Postcomponent posts={item} key={item.id} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width,
  },
});
export default News;
