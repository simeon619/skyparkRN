/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import ContactsComponent from '../../../components/Conversations/ContactsComponent';
import { COLORS } from '../../../themes/colors';
import SQuery from '../../../utils/squery/SQueryClient';
const { width } = Dimensions.get('window');

const Contact = ({ navigation }: { navigation: any }) => {
  let [listContact, setListContact] = useState<any[]>([]);
  const User = useSelector((state: any) => state.dataUser);
  useEffect(() => {
    getInfoUser();
  }, []);
  let getInfoUser = async () => {
    let userList: any[] = [];
    const model = await SQuery.Model('user');
    const modeluser = await model.newInstance({ id: User.userId });

    const Building = await modeluser.extractor('./account/address/building/');
    for (
      let index = 0;
      index < (await (await Building.users).page()).totalPages;
      index++
    ) {
      (await (await Building.users).page(index)).items.forEach((user: any) => {
        console.log({ user });

        userList.push(user);
      });
    }
    if (userList.length !== 0) {
      getListContact(userList);
    }
  };

  const getListContact = async (Listcontact: any) => {
    const accountModel = await SQuery.Model('account');
    // const messengerModel = await SQuery.Model('messenger');

    const promises = Listcontact.map((contact: any) => {
      return new Promise(async res => {
        const { account: accountId } = contact;

        const account = await accountModel.newInstance({ id: accountId });
        // const messenger = await messengerModel.newInstance({
        //   id: messengerId,
        // });

        const name = await account.name;
        const profile = await account.profile;
        const message = await profile.message;
        const imgProfile = (await profile.imgProfile)[0];
        // const discussions = await messenger.listDiscussion;

        res({
          timestamp: Date.now().toString(),
          nameUser: name,
          message,
          picUser: imgProfile,
          id: accountId,
        });
      });
    });

    let userList = (await Promise.allSettled(promises))
      .filter((p: any) => !!p?.value)
      .map((p: any) => p.value);

    setListContact(prev => [...prev, ...userList]);
  };
  return (
    <View>
      <StatusBar backgroundColor={COLORS.blue} barStyle={'light-content'} />
      <View
        style={{
          width,
          // height: HS * 0.07,
          backgroundColor: COLORS.blue,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: width * 0.05,
            alignItems: 'center',
            columnGap: width * 0.05,
          }}>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              style={styles.icon1}
              source={require('../../../assets/images/arrowback.png')}
            />
          </Pressable>

          <View style={{ alignItems: 'flex-start' }}>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: width * 0.065,
                color: 'white',
              }}>
              Contact
            </Text>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: width * 0.035,
                color: 'white',
              }}>
              {listContact.length} contacts
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            columnGap: width * 0.065,
            marginRight: width * 0.025,
          }}>
          <Image
            style={styles.icon1}
            source={require('../../../assets/images/search_active.png')}
          />
          <Image
            style={styles.icon1}
            source={require('../../../assets/images/option.png')}
          />
        </View>
      </View>
      <ScrollView>
        {listContact.map(contact => (
          <ContactsComponent
            contact={contact}
            navigation={navigation}
            key={contact.id}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  icon1: {
    width: width * 0.08,
    height: width * 0.08,
    tintColor: 'white',
  },
});
export default Contact;
