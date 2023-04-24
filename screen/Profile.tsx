/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
// import { useSelector } from 'react-redux';

import HeaderProfile from '../components/profile/HeaderProfile';
import Thread from '../components/Thread';
import { POST_DATA } from '../utils/posts';
const Profile = ({ navigation }: { navigation: any }) => {
  const [refreshing, setRefreshing] = useState(false);
  // let Post = useSelector((state: any) => state.postData);
  useEffect(() => {
    if (refreshing) {
      //fetch data
      setRefreshing(false);
    }
  }, [refreshing]);
  return (
    <ScrollView style={styles.main}>
      <HeaderProfile navigation={navigation} />
      <View
        style={{
          width: '100%',
          height: '100%',
          transform: [{ translateY: 0 }],
        }}>
        <Thread
          POST_DATA={POST_DATA}
          refreshing={refreshing}
          setRefreshing={setRefreshing}
          navigation={navigation}
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
