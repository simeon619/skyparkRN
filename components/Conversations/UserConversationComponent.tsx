/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { listUserSchema } from '../../screen/Conversations';
import { HOST } from '../../utils/metric';
import SQuery from '../../utils/squery/SQueryClient';
const { width, height } = Dimensions.get('window');
const UserConversation = ({
  user,
  navigation,
}: {
  user: listUserSchema;
  navigation: any;
}) => {
  const [vectors, setVectors] = useState(null);
  useEffect(() => {
    const warmChannel = async () => {
      const channelModel = await SQuery.Model('channel');
      const ChannelInstance = await channelModel.newInstance({
        id: user.idChannel,
      });

      setVectors(await ChannelInstance.vectors);
    };

    warmChannel();
  }, []);

  return (
    <Pressable
      onPress={() => {
        navigation.getParent().navigate('discussion', { user, vectors });
      }}
      style={styles.container}>
      <Image
        source={
          user.picUser
            ? { uri: HOST + user.picUser }
            : require('../../assets/images/user.png')
        }
        style={{
          width: width * 0.13,
          aspectRatio: 1,
          // borderRadius: 99,
          borderRadius: 30,
          marginRight: 10,
        }}
      />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {user.nameUser}
          </Text>
          <Text style={styles.subTitle}>
            {new Date(Number.parseInt(user.timestamp, 10)).toLocaleString(
              'ci-FR',
              {
                hour: 'numeric',
                minute: 'numeric',
              },
            )}
          </Text>
        </View>
        <Text style={styles.subTitle} numberOfLines={2}>
          {user.lastMessage}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserConversation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: height * 0.01,
  },
  image: {
    width: width * 0.15,
    aspectRatio: 1,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  name: {
    fontWeight: 'bold',
    flex: 1,
    color: 'black',
    fontSize: width * 0.045,
  },
  subTitle: {
    color: 'grey',
  },
});
