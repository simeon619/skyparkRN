import { FlashList } from '@shopify/flash-list';
import React from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
} from 'react-native';
import { PostSchema } from '../posts';
import { RATIO_HEADER } from '../utils/metric';
import Postcomponent from './Post/Postcomponent';
const { width, height } = Dimensions.get('window');
const Thread = ({
  POST_DATA,
  refreshing,
  setRefreshing,
  handleScrollHeader,
}: {
  POST_DATA: PostSchema[];
  refreshing: boolean;
  setRefreshing: (value: boolean) => void;
  handleScrollHeader: (e: number) => void;
}) => {
  let HEADER_HEIGHT = (RATIO_HEADER * height) / 100;
  return (
    // Retourner le code JSX
    <FlashList
      data={POST_DATA}
      estimatedItemSize={height / 2.3}
      bounces={true}
      // refreshing={refreshing}
      contentContainerStyle={{
        paddingTop: HEADER_HEIGHT,
        paddingBottom: 20,
      }}
      showsVerticalScrollIndicator={false}
      // onRefresh={() => setRefreshing(true)}
      onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
        handleScrollHeader(e.nativeEvent.contentOffset.y);
      }}
      refreshControl={
        <RefreshControl
          onRefresh={() => setRefreshing(true)}
          refreshing={refreshing}
          colors={['#00ff00']} // couleur verte pour Android
          progressBackgroundColor="#000000" // fond noir pour Android
          tintColor="#00ff00" // couleur verte pour iOS
          title="Chargement..."
          titleColor="#00ff00" // couleur verte pour iOS
        />
      }
      scrollEventThrottle={16}
      // extraData={}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <Postcomponent posts={item} key={item.id} />}
    />
  );
};

export default Thread;
