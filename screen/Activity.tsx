/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import ThreadActivity from '../components/ThreadActivity';
import { HOST } from '../utils/metric';
import { PostSchema } from '../utils/posts';
import SQuery from '../utils/squery/SQueryClient';

const Activity = ({ route, navigation }: { route: any; navigation: any }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [vectors, setVectors] = useState(null);
  const [postActivties, setPostActivties] = useState<PostSchema[]>([]);
  console.log({ navigation });

  useEffect(() => {
    if (refreshing) {
      //fetch data
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    initData();
  }, []);

  async function initData() {
    let channelModel = await SQuery.Model('channel');
    let channel = await channelModel.newInstance({
      id: route.params.channelId,
    });
    let vectorsArrayinstance = await channel.vectors;

    setVectors(vectorsArrayinstance);
    let data = await vectorsArrayinstance.update({
      paging: { sort: { createdAt: 1 } },
    });
    vectorsArrayinstance.when('update', async (item: any) => {
      if (item.added.length === 0) {
        return;
      }
      const Id = item.added[0];

      let postModel = await SQuery.Model('post');
      let post = await postModel.newInstance({ id: Id });
      let message = await post.message;
      let account = await message.account;
      let name = await account.name;
      const profile = await account.profile;
      const imgProfile = (await profile.imgProfile)[0];
      let text = await message.text;
      const file = await message.file;
      let urlArray;
      if (file) {
        urlArray = await file.url;
      }
      const date = new Date(await message.createdAt);
      const timestamp = date.getTime().toString();
      const like: number = await new Promise(res => {
        SQuery.emit('post:like', { postId: Id }, (result: any) => {
          if (result.error) {
            return res(0);
          }
          res(result.response);
        });
      });

      const accountId = account.$id;
      const randomCommentAuthorId = Math.floor(
        Math.random() * 999999999999,
      ).toString();
      // if (uri) images.push(uri);

      const poste: PostSchema = {
        id: Id,
        keyId: randomCommentAuthorId,
        author: {
          id: accountId,
          name,
          picture: imgProfile ? HOST + imgProfile : '',
        },
        type: 'image',
        content: text,
        images: urlArray,
        likes: like,

        timestamp,
      };

      setPostActivties(prev => [...prev, poste]);
    });

    let storePost: PostSchema[] = (await getNewData(data))
      .filter(p => !!p.value)
      .map(p => p.value);
    setPostActivties((prev: any) => [...prev, ...storePost]);
  }
  async function getNewData(data: any): Promise<any[]> {
    return await Promise.allSettled(
      data.items.map(async (item: any) => {
        const Id = item._id;

        const postModel = await SQuery.Model('post');
        const post = await postModel.newInstance({ id: Id });
        const message = await post.message;
        const account = await message.account;
        const name = await account.name;
        const text = await message.text;
        const profile = await account.profile;
        const imgProfile = (await profile.imgProfile)[0];
        const file = await message.file;
        let urlArray;
        if (file) {
          urlArray = await file.url;
        }

        const like: number = await new Promise(res => {
          SQuery.emit('post:like', { postId: Id }, (result: any) => {
            if (result.error) {
              return res(0);
            }
            res(result.response);
          });
        });
        const date = new Date(await message.createdAt);
        const timestamp = date.getTime().toString();
        const accountId = account.$id;
        const KeyId = Math.floor(Math.random() * 99999999).toString();
        const postGet: PostSchema = {
          id: Id,
          keyId: KeyId,
          author: {
            id: accountId,
            name,
            picture: imgProfile ? HOST + imgProfile : '',
          },
          type: 'image',
          content: text,
          images: urlArray,
          likes: like,
          timestamp,
        };
        return postGet;
      }),
    );
  }
  return (
    <View style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
      <Pressable
        onPress={() => {
          navigation.navigate('post', {
            name: route.params.nameActivity,
            vectorsQ: vectors,
          });
        }}
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
            textAlign: 'center',
          }}>
          Welcome {route.params.nameUser} to {route.params.nameActivity}
        </Text>
      </View>
      <ThreadActivity POST_DATA={postActivties} navigation={navigation} />
    </View>
  );
};

export default Activity;
