/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import ThreadActivity from '../components/ThreadActivity';
import { COLORS } from '../themes/colors';
import { COMMENT_CACHE_CHANNEL_ACTIVITY } from '../utils/metric';
import { PostSchema } from '../utils/posts';

const Activity = ({ route, navigation }: { route: any; navigation: any }) => {
  const [refreshing, setRefreshing] = useState(false);

  console.log({ navigation });

  useEffect(() => {
    if (refreshing) {
      //fetch data
      setRefreshing(false);
    }
  }, [refreshing]);
  const ListPostQuarter: any = useSelector((state: any) => state.postQuarter);
  let data = ListPostQuarter[route.params.activityId];
  let Post: PostSchema[] = data?.results;

  return (
    <View style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
      <Pressable
        onPress={() => {
          navigation.navigate('post', {
            name: data.name,
            vectorsQ:
              COMMENT_CACHE_CHANNEL_ACTIVITY[route.params.activityId].vectors,
          });
        }}
        style={{
          position: 'absolute',
          padding: 14,
          zIndex: 85,
          bottom: 28,
          right: 25,
          borderRadius: 58,
          backgroundColor: COLORS.blue,
        }}>
        <Image
          source={require('../assets/images/pen.png')}
          style={{
            width: 28,
            height: 28,
          }}
        />
      </Pressable>
      <View style={{ width: '100%' }}>
        <Text
          style={{
            color: 'black',
            fontFamily: 'Kurale-Regular',
            fontSize: 20,
            textAlign: 'center',
          }}>
          Welcome {route.params.nameUser} to {route.params.nameActivity}
        </Text>
      </View>
      <ThreadActivity POST_DATA={Post} navigation={navigation} />
    </View>
  );
};

export default Activity;
