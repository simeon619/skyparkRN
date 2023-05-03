/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MagicModalPortal, magicModal } from 'react-native-magic-modal';
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
  const ResponseModal = () => (
    <SafeAreaView style={styles.options}>
      <View style={styles.item}>
        <Image
          style={{ width: width * 0.075, aspectRatio: 1 }}
          source={require('../../assets/images/pin.png')}
        />
        <Text style={styles.itemText}>Pin this conversation</Text>
      </View>
      <View style={styles.item}>
        <Image
          style={{ width: width * 0.075, aspectRatio: 1 }}
          source={require('../../assets/images/warning.png')}
        />
        <Text style={styles.itemText}>Archive This conversation</Text>
      </View>
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          // setFirstPlan(false);
          SQuery.emit(
            'messenger:removeDiscussion',
            {
              discussionId: user.discussionId,
            },
            (res: any) => {
              console.log('DISCUSSION REMOVED', res);
            },
          );
        }}>
        <Image
          style={{
            width: width * 0.065,
            aspectRatio: 1,
            tintColor: 'red',
          }}
          source={require('../../assets/images/trash.png')}
        />
        <Text style={[styles.itemText, { color: 'red' }]}>
          Delete This conversation
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
  // const [firstPlan, setFirstPlan] = useState(false);
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          navigation.getParent().navigate('discussion', { user, vectors });
        }}
        onLongPress={() => {
          magicModal.show(() => <ResponseModal />);
          // setFirstPlan(true);
          console.log('loll');
        }}
        style={styles.container}>
        <View>
          <Image
            source={
              user.picUser
                ? { uri: HOST + user.picUser }
                : require('../../assets/images/user.png')
            }
            style={{
              // width: width * 0.13,
              height: width * 0.13,
              aspectRatio: 1,
              // borderRadius: 99,
              borderRadius: 30,
              marginRight: 10,
            }}
          />
          {/* {firstPlan && (
            <Image
              style={{
                height: 20,
                width: 20,
                // aspectRatio: 1,
                position: 'absolute',
                right: 5,
                bottom: 0,
              }}
              source={require('../../assets/images/check.png')}
            />
          )} */}
        </View>

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
      </TouchableOpacity>
      <MagicModalPortal />
    </>
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

  item: {
    paddingVertical: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    // width,
    alignItems: 'center',
    gap: 15,
    // backgroundColor: '#fff',
    // marginTop: 5,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: width * 0.055,
    fontFamily: 'Roboto-Regular',
    color: '#123',
  },
  options: {
    // height: 80, // définir la hauteur de la vue modale
    width: '99%', // définir la largeur de la vue modale
    backgroundColor: '#efeffe',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: 'absolute',
    paddingHorizontal: 30,
    // flexDirection: 'row',
    borderColor: '#3335',
    borderWidth: 0.4,
    bottom: 0,
    shadowColor: '#000',
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 1,
    // borderTopWidth: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
