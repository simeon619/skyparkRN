/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
// import { useSelector } from 'react-redux';

import { useSelector } from 'react-redux';
import Thread from '../components/Thread';
import HeaderProfile from '../components/profile/HeaderProfile';
import SQuery from '../utils/squery/SQueryClient';
const Profile = ({ navigation }: { navigation: any }) => {
  const [refreshing, setRefreshing] = useState(false);
  // let Post = useSelector((state: any) => state.postData);
  useEffect(() => {
    if (refreshing) {
      //fetch data
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    initPostUser();
  }, []);
  // let allUserPost: any[] = [];
  const [allUserPost, setAllUserPost] = useState<any[]>([]);
  const initPostUser = async () => {
    console.log('GRACE');

    await SQuery.emit('post:allUserPost', {}, (res: any) => {
      console.log(res.response.items, '87888888');
      // setAllUserPost(prev => [...prev, ...res.response.items]);
    });
  };
  // const User = useSelector((state: any) => state.dataUser);
  const ListPostQuarter: any = useSelector((state: any) => state.postQuarter);
  let arr: any[] = [];
  for (let key in ListPostQuarter) {
    arr = arr.concat(ListPostQuarter[key].results);
  }
  console.log({ allUserPost });

  return (
    <ScrollView style={styles.main}>
      <HeaderProfile navigation={navigation} />
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
        }}>
        <Thread
          POST_DATA={arr}
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
    // flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 190,
    borderTopRightRadius: 190,
  },
});
