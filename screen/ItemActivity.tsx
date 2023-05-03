/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { HOST } from '../utils/metric';
import { PropsNavigation } from '../utils/schemaType';
import SQuery from '../utils/squery/SQueryClient';
type ActivitySchema = {
  activityId: string;
  name: string;
  description: string;
  picture: string;
};

type ArrayActivity = ActivitySchema[];

const { height, width } = Dimensions.get('window');
const ItemActivity = (props: PropsNavigation) => {
  const { navigation } = props;
  const [activities, setActivities] = useState<ArrayActivity>([]);

  useEffect(() => {
    setActivities([]);
    initInstance();
  }, []);

  let User = useSelector((state: any) => state.dataUser);
  const initInstance = async () => {
    const userId = User.userId;
    let model = await SQuery.Model('user');
    let user = await model.newInstance({ id: userId });
    let Quarter = await user.extractor('./account/address/quarter');
    let communityActivities = await Quarter.activities;
    (await communityActivities.page()).items.forEach(async (item: any) => {
      let activityModel = await SQuery.Model('activity');
      console.log({ activityModel }, 'activitymodel');
      let activity = await activityModel.newInstance({ id: item._id });
      console.log({ activity });
      let name = await activity.name;
      let description = await activity.description;
      let poster = await activity.poster;
      let picture = (await poster.imgProfile)[0];
      let Activity = {
        activityId: item._id,
        description,
        picture,
        name,
      };
      setActivities(prev => [...prev, Activity]);
    });
  };

  const ItemView = ({ itemActivity }: { itemActivity: ActivitySchema }) => {
    return (
      <View
        style={{
          borderRadius: 10,
          overflow: 'hidden',
          width: '100%',
          height: height / 5,
          backgroundColor: 'red',
          marginBottom: 10,
        }}>
        <Pressable
          onPress={() => {
            navigation.getParent()?.navigate('Activity', {
              activityId: itemActivity.activityId,
            });
          }}>
          <ImageBackground
            source={
              itemActivity.picture
                ? { uri: HOST + itemActivity.picture }
                : require('../assets/images/banner.jpg')
            }
            // source={{
            //   uri: 'https://images.pexels.com/photos/13733057/pexels-photo-13733057.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
            // }}
            style={{
              width: '100%',
              height: '100%',
            }}>
            <View style={{ margin: 20 }}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: '900',
                  color: '#123',
                  backgroundColor: '#fff3',
                }}>
                {itemActivity.name}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '400',
                  color: '#123',
                  backgroundColor: '#fff3',
                }}>
                {itemActivity.description}
              </Text>
            </View>
          </ImageBackground>
        </Pressable>
      </View>
    );
  };
  return (
    <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 15 }}>
      <View style={styles.header}>
        <View style={styles.topHeader}>
          {User.imgProfile ? (
            <Image
              style={styles.icon}
              resizeMode="contain"
              source={{ uri: HOST + User.imgProfile[0] }}
            />
          ) : (
            <Image
              style={styles.icon}
              resizeMode="contain"
              source={require('../assets/images/user.png')}
            />
          )}
          <Image
            style={styles.icon1}
            source={require('../assets/images/settings.png')}
          />
        </View>
        <View style={styles.bottomHeader}>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            <Text style={{ fontSize: 22, color: 'black', fontWeight: '400' }}>
              Hello,
            </Text>
            <Text style={{ fontSize: 22, color: 'black', fontWeight: '900' }}>
              Jhon !
            </Text>
          </View>
          <View style={{ paddingTop: 10 }}>
            <Text style={{ fontSize: 15, color: 'black', fontWeight: '300' }}>
              Welcome for the activity introduce to the activities
            </Text>
          </View>
        </View>
      </View>
      <FlashList
        data={activities}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={height / 5}
        keyExtractor={item => item.activityId}
        renderItem={({ item }) => <ItemView itemActivity={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {},
  icon: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 99,
  },
  icon1: {
    width: 30,
    height: 30,
  },
  body: {},
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomHeader: {
    paddingVertical: 20,
  },
});
export default ItemActivity;
