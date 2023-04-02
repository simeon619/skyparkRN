import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View,Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import PostModal from '../components/PostModal';


import HeaderProfile from '../components/profile/HeaderProfile';
import Thread from '../components/Thread';
import { POST_DATA } from '../utils/posts';
const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
const Profile = () => {
  const [refreshing, setRefreshing] = useState(false);
  let Post = useSelector((state: any) => state.postData);
  useEffect(() => {
    if (refreshing) {
      //fetch data
      setRefreshing(false);
    }
  }, [refreshing]);
  return (
    <ScrollView style={styles.main}>
      
      <HeaderProfile />
      <View style={{ width : '100%' , height: '100%' , transform: [{ translateY: 0}],}} >
      <Thread
        POST_DATA={Post}
        refreshing={refreshing}
        setRefreshing={setRefreshing}
      />
      </View>
   
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'white',
  },
});
