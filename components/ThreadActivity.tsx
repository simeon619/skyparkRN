import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { Dimensions } from 'react-native';

import { PostSchema } from '../utils/posts';
import Postcomponent from './Post/Postcomponent';
const { height } = Dimensions.get('window');
const ThreadActivity = ({
  POST_DATA,
  navigation,
}: {
  POST_DATA: PostSchema[];
  navigation: any;
}) => {
  return (
    <FlashList
      data={POST_DATA}
      estimatedItemSize={height / 2.2}
      bounces={false}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
      scrollEventThrottle={16}
      // extraData={}
      keyExtractor={item => item.keyId}
      renderItem={({ item }) => (
        <Postcomponent posts={item} navigation={navigation} key={item.keyId} />
      )}
    />
  );
};

export default ThreadActivity;
