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
import { HOST } from '../../utils/metric';
import SQuery from '../../utils/squery/SQueryClient';
const { width, height } = Dimensions.get('window');
const ContactsComponent = ({
  navigation,
  contact,
}: {
  navigation: any;
  contact: any;
}) => {
  const [uri, setUri] = useState(() =>
    contact.picUser ? HOST + contact.picUser : '',
  );
  const [name, setName] = useState<string>(contact.nameUser);
  useEffect(() => {
    const addListener = async () => {
      let model = await SQuery.Model('account');
      let account = await model.newInstance({
        id: contact.id,
      });
      let profile = await account.profile;
      account?.when('refresh:name', setName);
      profile?.when('refresh:imgProfile', (imageProfile: string[]) => {
        setUri(imageProfile[0] ? HOST + imageProfile[0] : '');
      });
    };
    addListener();
  }, []);
  const isNewContact = async () => {
    createDiscusion()
      .then(async (newChannel: any) => {
        navigation.navigate('discussion', {
          contact,
          vectors: await newChannel.vectors,
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  async function createDiscusion() {
    return await new Promise((resol, rej) => {
      SQuery.emit(
        'messenger:createDiscussion',
        { receiverId: contact.id },
        async (res: any) => {
          if (res.error) {
            rej('DISCUSSION CAN BE CREATE');
          }
          resol(
            (await SQuery.Model('channel')).newInstance({
              id: res.response.id,
            }),
          );
        },
      );
    });
  }
  return (
    <Pressable
      onPress={() => {
        isNewContact();
      }}
      style={styles.container}>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <View style={{}}>
          <Image
            source={uri ? { uri } : require('../../assets/images/user.png')}
            style={{
              width: width * 0.13,
              height: width * 0.13,
              borderRadius: 99,
            }}
          />
        </View>

        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
            rowGap: 5,
            flex: 1,
          }}>
          <Text numberOfLines={2} style={styles.name}>
            {name}
          </Text>
          <Text
            numberOfLines={2}
            style={[styles.subTitle, !contact.message && { display: 'none' }]}>
            {contact.message}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ContactsComponent;

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
