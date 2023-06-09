import React from 'react';
import { FlatList } from 'react-native';

import { PostSchema } from '../utils/posts';
import Postcomponent from './Post/Postcomponent';
// const { height } = Dimensions.get('window');
const ThreadActivity = ({
  POST_DATA,
  navigation,
}: {
  POST_DATA: PostSchema[];
  navigation: any;
}) => {
  console.log(POST_DATA, 'POST_DATA');

  return (
    <FlatList
      data={POST_DATA}
      // estimatedItemSize={height / 2.2}
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
