import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import PostModal from '../components/PostModal';
import Thread from '../components/Thread';
import { RATIO_HEADER } from '../utils/metric';
import { POST_DATA } from '../utils/posts';
const { width, height } = Dimensions.get('window');
let HEADER_HEIGHT = (RATIO_HEADER * height) / 100;
const Activity = ({ route }: { route: any }) => {
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (refreshing) {
      //fetch data
      setRefreshing(false);
    }
  }, [refreshing]);

  const [isVisible, setIsVisible] = useState(false);
  const toggleModal = () => {
    setIsVisible(prev => !prev);
  };
  return (
    <View style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
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
            source={require('../assets/images/newPost.png')}
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
            textAlign : 'center',    
          }}>
          {' '}
          Welcome {route.params.nameUser} to {route.params.nameActivity}
        </Text>
      </View>
      <Thread
        POST_DATA={POST_DATA}
        refreshing={refreshing}
        setRefreshing={setRefreshing}
      />
        <PostModal toggleModal={toggleModal} isShow={isVisible} />
    </View>
  );
};

export default Activity;

const styles = StyleSheet.create({});
