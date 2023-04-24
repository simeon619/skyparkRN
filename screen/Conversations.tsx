/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import UserConversation from '../components/Conversations/UserConversationComponent';
import SQuery from '../utils/squery/SQueryClient';
export type listUserSchema = {
  id: string;
  nameUser: string;
  picUser: string;
  timestamp: string;
  lastMessage: string;
  idChannel: string;
};
const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
const Conversation = ({ navigation }: { navigation: any }) => {
  const User = useSelector((state: any) => state.dataUser);
  const [contacts, setContacts] = useState<any[]>([]);
  useEffect(() => {
    getContact();
  }, []);
  const refreshList = (etat: any) => {
    setContacts(prev => [...etat, ...prev]);
  };
  // const listUser: listUserSchema[] = [
  //   {
  //     timestamp: Date.now().toString(),
  //     id: '326256',
  //     nameUser: 'Messsah Komlan simeon de las carasse',
  //     picUser:
  //       'https://images.pexels.com/photos/15302394/pexels-photo-15302394.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
  //     typeMessage: {
  //       text: 'salut les gars je suys hereux de fait de ca notre utilitaire pricinpale',
  //       video:
  //         'https://joy1.videvo.net/videvo_files/video/free/video0474/large_watermarked/_import_61e8f017b3b2c5.29118448_preview.mp4',
  //       pdf: 'https://profdoc.iddocs.fr/IMG/pdf/billiejoe_javascript_fiches.pdf',
  //     },
  //   },
  //   {
  //     timestamp: Date.now().toString(),
  //     id: '42656',
  //     nameUser: 'Daniel',
  //     picUser:
  //       'https://images.pexels.com/photos/15302394/pexels-photo-15302394.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
  //     typeMessage: {
  //       text: 'salut les gars',
  //       video:
  //         'https://joy1.videvo.net/videvo_files/video/free/video0474/large_watermarked/_import_61e8f017b3b2c5.29118448_preview.mp4',
  //       pdf: 'https://profdoc.iddocs.fr/IMG/pdf/billiejoe_javascript_fiches.pdf',
  //     },
  //   },
  //   {
  //     timestamp: Date.now().toString(),
  //     id: '565465',
  //     nameUser: 'young maman',
  //     picUser:
  //       'https://images.pexels.com/photos/15302394/pexels-photo-15302394.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
  //     typeMessage: {
  //       text: 'salut les gars 4',
  //       video:
  //         'https://joy1.videvo.net/videvo_files/video/free/video0474/large_watermarked/_import_61e8f017b3b2c5.29118448_preview.mp4',
  //       pdf: 'https://profdoc.iddocs.fr/IMG/pdf/billiejoe_javascript_fiches.pdf',
  //     },
  //   },
  //   {
  //     timestamp: Date.now().toString(),
  //     id: '66532',
  //     nameUser: 'Young papa',
  //     picUser:
  //       'https://images.pexels.com/photos/14251082/pexels-photo-14251082.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
  //     typeMessage: {
  //       text: 'salut les gars 2',
  //       video:
  //         'https://joy1.videvo.net/videvo_files/video/free/video0474/large_watermarked/_import_61e8f017b3b2c5.29118448_preview.mp4',
  //       pdf: 'https://profdoc.iddocs.fr/IMG/pdf/billiejoe_javascript_fiches.pdf',
  //     },
  //   },
  //   {
  //     timestamp: Date.now().toString(),
  //     id: '454564564',
  //     nameUser: 'Young papa',
  //     picUser:
  //       'https://images.pexels.com/photos/14251082/pexels-photo-14251082.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
  //     typeMessage: {
  //       text: 'salut les gars 2',
  //       video:
  //         'https://joy1.videvo.net/videvo_files/video/free/video0474/large_watermarked/_import_61e8f017b3b2c5.29118448_preview.mp4',
  //       pdf: 'https://profdoc.iddocs.fr/IMG/pdf/billiejoe_javascript_fiches.pdf',
  //     },
  //   },
  //   {
  //     timestamp: Date.now().toString(),
  //     id: '687',
  //     nameUser: 'Young papa',
  //     picUser:
  //       'https://images.pexels.com/photos/15302394/pexels-photo-15302394.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
  //     typeMessage: {
  //       text: 'salut les gars 2',
  //       video:
  //         'https://joy1.videvo.net/videvo_files/video/free/video0474/large_watermarked/_import_61e8f017b3b2c5.29118448_preview.mp4',
  //       pdf: 'https://profdoc.iddocs.fr/IMG/pdf/billiejoe_javascript_fiches.pdf',
  //     },
  //   },
  //   {
  //     timestamp: Date.now().toString(),
  //     id: '146',
  //     nameUser: 'Young papa',
  //     picUser:
  //       'https://images.pexels.com/photos/15791536/pexels-photo-15791536.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
  //     typeMessage: {
  //       text: 'salut les gars 2',
  //       video:
  //         'https://joy1.videvo.net/videvo_files/video/free/video0474/large_watermarked/_import_61e8f017b3b2c5.29118448_preview.mp4',
  //       pdf: 'https://profdoc.iddocs.fr/IMG/pdf/billiejoe_javascript_fiches.pdf',
  //     },
  //   },
  //   {
  //     timestamp: Date.now().toString(),
  //     id: '16',
  //     nameUser: 'Young papa',
  //     picUser:
  //       'https://images.pexels.com/photos/15302394/pexels-photo-15302394.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
  //     typeMessage: {
  //       text: 'salut les gars 2',
  //       video:
  //         'https://joy1.videvo.net/videvo_files/video/free/video0474/large_watermarked/_import_61e8f017b3b2c5.29118448_preview.mp4',
  //       pdf: 'https://profdoc.iddocs.fr/IMG/pdf/billiejoe_javascript_fiches.pdf',
  //     },
  //   },
  //   {
  //     timestamp: Date.now().toString(),
  //     id: '62',
  //     nameUser: 'Young papa',
  //     picUser:
  //       'https://images.pexels.com/photos/15302394/pexels-photo-15302394.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
  //     typeMessage: {
  //       text: 'salut les gars 2',
  //       video:
  //         'https://joy1.videvo.net/videvo_files/video/free/video0474/large_watermarked/_import_61e8f017b3b2c5.29118448_preview.mp4',
  //       pdf: 'https://profdoc.iddocs.fr/IMG/pdf/billiejoe_javascript_fiches.pdf',
  //     },
  //   },
  // ];
  const getContact = async () => {
    const userMessenger = await SQuery.Model('messenger');

    const MessengerInstance = await userMessenger.newInstance({
      id: User.messengerId,
    });
    console.log(MessengerInstance.listDiscussion);

    (await MessengerInstance.listDiscussion).when(
      'update',
      async (data: any) => {
        if (!data.added[0]) {
          console.log('NULL');
          return;
        }
        console.log(
          '*********************REFRESHING***************************',
        );

        const discussionModel = await SQuery.Model('discussion');
        console.log({ discussionModel });

        const discussionInstance = await discussionModel.newInstance({
          id: data.added[0],
        });
        console.log({ discussionInstance });
        const channel = await discussionInstance.channel;
        const receiver = await discussionInstance.receiver;
        const sender = await discussionInstance.sender;
        const contactAccount =
          sender.$id === User.accountId ? receiver : sender;
        let profile = await contactAccount.profile;
        let nameUser = await contactAccount.name;
        let picUser = (await profile.imgProfile)[0];
        refreshList([
          {
            id: contactAccount.$id,
            picUser,
            nameUser,
            timestamp: Date.now().toString(),
            lastMessage: 'salut',
            idChannel: channel.$id,
          },
        ]);
        if (User.userId !== sender.$id) {
          return;
        }
        const userContact = await contactAccount.newParentInstance();
        const discussions = (await userContact.messenger).listDiscussion;
        await discussions.update({
          addNew: [
            {
              channel: channel.$id,
              sender: User.accountId,
              receiver: receiver.$id,
            },
          ],
          paging: { sort: { createdAt: -1 } },
        });
      },
    );

    let promises = (
      await (await MessengerInstance.listDiscussion).page()
    ).items.map((discussion: any) => {
      return new Promise(async res => {
        const contactAccountId =
          discussion.sender === User.accountId
            ? discussion.receiver
            : discussion.sender;

        const accountModel = await SQuery.Model('account');
        const contactAccount = await accountModel.newInstance({
          id: contactAccountId,
        });
        let profile = await contactAccount.profile;
        let nameUser = await contactAccount.name;
        let picUser = (await profile.imgProfile)[0];

        res({
          id: contactAccount.$id,
          picUser,
          nameUser,
          timestamp: Date.now().toString(),
          lastMessage: 'salut',
          idChannel: discussion.channel,
        });
      });
    });
    let discs = (await Promise.allSettled(promises))
      .filter((f: any) => !!f?.value)
      .map((p: any) => p.value);

    setContacts(prev => [...prev, ...discs]);
  };

  return (
    <SafeAreaView
      style={{ width, height: SCREEN_HEIGHT, backgroundColor: 'white' }}>
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <View
        style={{
          height: 57,
          elevation: 99,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 30,
            color: 'black',
            fontFamily: 'Kurale-Regular',
            alignSelf: 'center',
            marginLeft: 15,
          }}>
          {User?.name ? User.name : 'messah'}
        </Text>
        <View
          style={{
            marginRight: 15,
            flexDirection: 'row',
            alignSelf: 'center',
            gap: 20,
          }}>
          <Pressable
            style={{
              alignSelf: 'flex-end',
            }}
            onPress={() => {
              navigation.getParent()?.navigate('contact');
            }}>
            <Image
              source={require('../assets/images/video_call.png')}
              style={{
                width: 25,
                height: 25,
              }}
            />
          </Pressable>
          <Image
            source={require('../assets/images/start_chat.png')}
            style={{ width: 30, height: 30, alignSelf: 'flex-end' }}
          />
        </View>
      </View>
      <ScrollView
        style={{
          backgroundColor: 'white',
        }}>
        <View
          style={{
            width: '90%',
            backgroundColor: '#ddd',
            flexDirection: 'row',
            gap: 15,
            marginTop: 10,
            alignSelf: 'center',
            borderRadius: 10,
            padding: 6,
            paddingLeft: 15,
          }}>
          <Image
            source={require('../assets/images/search_active.png')}
            style={{
              width: 20,
              height: 20,
              tintColor: 'grey',
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              color: 'grey',
              fontSize: 19,
              fontFamily: 'Ubuntu-Regular',
            }}>
            Search
          </Text>
        </View>
        <View style={{ marginTop: 10, padding: 10 }}>
          <Text
            style={{
              color: 'black',
              fontSize: 18,
              fontFamily: 'Ubuntu-Regular',
            }}>
            Recents conversation
          </Text>
        </View>
        <View>
          {contacts.map(user => (
            <UserConversation
              key={user.id}
              user={user}
              navigation={navigation}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Conversation;
// const styles = StyleSheet.create({});
