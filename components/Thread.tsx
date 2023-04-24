/* eslint-disable react-native/no-inline-styles */
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
} from 'react-native';

import { RATIO_HEADER } from '../utils/metric';
import { PostSchema } from '../utils/posts';
import Postcomponent from './Post/Postcomponent';
const { height } = Dimensions.get('window');
const Thread = ({
  POST_DATA,
  refreshing,
  setRefreshing,
  handleScrollHeader,
  navigation,
}: {
  POST_DATA: PostSchema[];
  refreshing: boolean;
  setRefreshing: (value: boolean) => void;
  handleScrollHeader?: (e: number) => void;
  navigation: any;
}) => {
  let HEADER_HEIGHT = (RATIO_HEADER * height) / 100;

  return (
    <FlashList
      data={POST_DATA}
      estimatedItemSize={height / 2.2}
      bounces={false}
      // refreshing={refreshing}
      contentContainerStyle={
        handleScrollHeader && {
          paddingTop: HEADER_HEIGHT,
          backgroundColor: '#fff8',
          paddingBottom: 20,
        }
      }
      showsVerticalScrollIndicator={false}
      // onRefresh={() => setRefreshing(true)}
      onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (handleScrollHeader) {
          handleScrollHeader(e.nativeEvent.contentOffset.y);
        }
      }}
      nestedScrollEnabled={true}
      refreshControl={
        <RefreshControl
          style={{
            paddingTop: HEADER_HEIGHT,
            paddingBottom: 20,
            position: 'absolute',
            top: 500,
            zIndex: 100,
          }}
          onRefresh={() => setRefreshing(true)}
          refreshing={refreshing}
          colors={['#00ff00']} // couleur verte pour Android
          progressBackgroundColor="#000000" // fond noir pour Android
          tintColor="#00ff00" // couleur verte pour iOS
          title="Loading..."
          titleColor="#00ff00" // couleur verte pour iOS
        />
      }
      scrollEventThrottle={16}
      // extraData={}
      keyExtractor={item => item.keyId}
      renderItem={({ item }) => (
        <Postcomponent posts={item} navigation={navigation} key={item.keyId} />
      )}
    />
  );
};

export default Thread;
