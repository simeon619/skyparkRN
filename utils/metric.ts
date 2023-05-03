/* eslint-disable react-hooks/rules-of-hooks */
// import { useDispatch } from "react-redux";
// import { addPostServer } from "../wharehouse/store";
// import { PostSchema } from "./posts";
// import SQuery from "./squery/SQueryClient";

import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import { store } from '../wharehouse/store';
import { PostSchema } from './posts';
import SQuery from './squery/SQueryClient';

// import React from 'react'
export const RATIO_HEADER = 13;
export const HOST = 'http://192.168.1.5:3500';
export type commentSchema = {
  time: string;
  name: string;
  picUser: string;
  like: number;
  commentaire: string;
  images: string[];
};
export const COMMENT_CACHE_CHANNEL: any = {};
const COMMENT_CACHE_RESULT: any = {};
function useRedux(type: any, payload: any) {
  const dispatch = store.dispatch;
  dispatch({ type, payload });
}
export const InitPostComments = async (id: string) => {
  if (id in COMMENT_CACHE_RESULT) {
    console.log('IN_CACHE');
    return;
  }
  console.log('OUT_CACHE');
  const postModel = await SQuery.Model('post');
  const post = await postModel.newInstance({ id });
  console.log({ post });

  const comments = await post?.comments;
  COMMENT_CACHE_CHANNEL[id] = { comments };
  comments.when('update', async (data: any) => {
    if (!data.added[0]) {
      return;
    }
    let post = await postModel.newInstance({
      id: data.added[0],
    });
    let message = await post.message;
    let account = await message.account;
    let name = await account.name;
    let profile = await account.profile;
    let picUser = (await profile.imgProfile)[0];
    let like = await post.likeCount;
    let commentaire = await message.text;
    let time = await message.createdAt;
    const file = await message.file;
    let urlArray: any;
    if (file) {
      urlArray = await file.url;
    }
    let resultCache = COMMENT_CACHE_RESULT[id].results;
    COMMENT_CACHE_RESULT[id].results = resultCache.concat([
      { name, picUser, like, commentaire, time, images: urlArray },
    ]);

    useRedux('comment/addComment', { ...COMMENT_CACHE_RESULT });
  });

  const data = await comments.page();
  let promises = data.items.map(async (item: any) => {
    return new Promise(async res => {
      let Modelpost = await SQuery.Model('post');
      let comment = await Modelpost.newInstance({ id: item._id });
      let message = await comment.message;
      let account = await message.account;
      let name = await account.name;
      let profile = await account.profile;
      let picUser = (await profile.imgProfile)[0];
      const file = await message.file;
      let urlArray;
      if (file) {
        urlArray = await file.url;
      }

      let like = await comment.likeCount;
      let commentaire = await message.text;
      let time = await message.createdAt;
      // const commenttss = await post.comments;
      res({
        time,
        name,
        picUser,
        like,
        commentaire,
        images: urlArray,
      });
    });
  });

  let results = (await Promise.allSettled(promises))
    .filter((f: any) => !!f.value)
    .map((v: any) => v.value);
  COMMENT_CACHE_RESULT[id] = { results };
  useRedux('comment/addComment', { ...COMMENT_CACHE_RESULT });
};
export const COMMENT_CACHE_CHANNEL_ACTIVITY: any = {};
const COMMENT_CACHE_RESULT_ACTIVITY: any = {};
export async function initPostActivity(
  nameActivity: string,
  iconActivity: string,
  vectorsChannelActivity: any,
  idActivity: string,
) {
  if (idActivity in COMMENT_CACHE_RESULT_ACTIVITY) {
    console.log('IN_CACHE');
    return;
  }
  console.log('OUT_CACHE');
  COMMENT_CACHE_CHANNEL_ACTIVITY[idActivity] = {
    vectors: vectorsChannelActivity,
  };
  vectorsChannelActivity.when('update', async (item: any) => {
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
      Math.random() * 1000000000000,
    ).toString();
    let meltResult = COMMENT_CACHE_RESULT_ACTIVITY[idActivity].results;

    COMMENT_CACHE_RESULT_ACTIVITY[idActivity].results = meltResult.concat([
      {
        id: Id,
        keyId: randomCommentAuthorId,
        author: {
          id: accountId,
          name,
          picture: imgProfile ? imgProfile : '',
        },
        content: text,
        iconActivity,
        nameActivity,
        images: urlArray,
        likes: like,
        timestamp,
      },
    ]);
    useRedux('postQuarter/addPostQuarter', {
      ...COMMENT_CACHE_RESULT_ACTIVITY,
    });
  });
  let data = await vectorsChannelActivity.update({
    paging: { sort: { createdAt: 1 } },
  });
  let results: PostSchema[] = (
    await getNewData(data, iconActivity, nameActivity)
  )
    .filter(p => !!p.value)
    .map(p => p.value);
  COMMENT_CACHE_RESULT_ACTIVITY[idActivity] = {
    results,
    icon: iconActivity,
    name: nameActivity,
  };

  useRedux('postQuarter/addPostQuarter', {
    ...COMMENT_CACHE_RESULT_ACTIVITY,
  });
}
async function getNewData(
  data: any,
  iconActivity: string,
  nameActivity: string,
): Promise<any[]> {
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
      const KeyId = Math.floor(Math.random() * 1000000000000).toString();
      const postGet: PostSchema = {
        id: Id,
        keyId: KeyId,
        author: {
          id: accountId,
          name,
          picture: imgProfile ? imgProfile : '',
        },
        iconActivity,
        nameActivity,
        content: text,
        images: urlArray,
        likes: like,
        timestamp,
      };
      return postGet;
    }),
  );
}
// const COMMENT_CAHE_LIMIT: any = {};
// export const initLimitComment = async (id: string, setCommentLimit: any) => {
//   if (id in COMMENT_CAHE_LIMIT) {
//     console.log('IN_CACHE_LIMIT');
//     setCommentLimit(COMMENT_CAHE_LIMIT[id].results);
//     return;
//   }
//   const postModel = await SQuery.Model('post');
//   const post = await postModel.newInstance({ id });
//   const comments = await post?.comments;
//   comments.when('update', async (data: any) => {
//     if (!data.added[0]) {
//       return;
//     }
//     let post = await postModel.newInstance({
//       id: data.added[0],
//     });
//     let message = await post.message;
//     console.log({ message });
//     let account = await message.account;
//     let name = await account.name;
//     let profile = await account.profile;
//     let picUser = (await profile.imgProfile)[0];
//     const like: number = await new Promise(res => {
//       SQuery.emit('post:like', { postId: data.added[0] }, (result: any) => {
//         if (result.error) {
//           return res(0);
//         }
//         res(result.response);
//       });
//     });
//     let commentaire = await message.text;
//     let time = await message.createdAt;
//     const file = await message.file;
//     let urlArray: any;
//     if (file) {
//       urlArray = await file.url;
//     }
//     const refresComment = (prev: any) => {
//       let result = [
//         ...prev,
//         ...[{ name, picUser, like, commentaire, time, images: urlArray }],
//       ];
//       return (COMMENT_CAHE_LIMIT[id] = { result });
//     };

//     (initLimitComment as any).setCommentLimit?.(refresComment);
//   });

//   const data = await comments.page();
//   let promises = data.items.map(async (item: any) => {
//     return new Promise(async res => {
//       let Modelpost = await SQuery.Model('post');
//       let comment = await Modelpost.newInstance({ id: item._id });

//       let message = await comment.message;
//       let account = await message.account;
//       let name = await account.name;
//       let profile = await account.profile;
//       let picUser = (await profile.imgProfile)[0];
//       const file = await message.file;
//       let urlArray;
//       if (file) {
//         urlArray = await file.url;
//       }

//       const like: number = await new Promise(res => {
//         SQuery.emit('post:like', { postId: comment.$id }, (result: any) => {
//           if (result.error) {
//             return res(0);
//           }
//           res(result.response);
//         });
//       });
//       let commentaire = await message.text;
//       let time = await message.createdAt;
//       // const commenttss = await post.comments;
//       res({
//         time,
//         name,
//         picUser,
//         like,
//         commentaire,
//         images: urlArray,
//       });
//     });
//   });

//   let results = (await Promise.allSettled(promises))
//     .filter((f: any) => !!f.value)
//     .map((v: any) => v.value);

//   setCommentLimit((prev: any) => {
//     COMMENT_CAHE_LIMIT[id] = { results };
//     return [...prev, ...results];
//   });
// };

export const calculeDate = (times: any) => {
  let date_timestamp = new Date(times);
  let time = formatDistance(
    date_timestamp.setHours(date_timestamp.getHours() - 4),
    new Date(),
    {
      // addSuffix: true,

      includeSeconds: true,
      locale: fr,
    },
  );
  return time;
};
// const dispatch = useDispatch();
// export const initInstance = async (userId : string , audience : string) => {
//     // const userId = User.userId;
//     let model = await SQuery.Model('user');

//     let user = await model.newInstance({ id: userId });

//     let building = await user[audience];

//     let community = await building['community'];

//     let activities = await community['activities'];

//     let activity = (await (await activities.page()).itemsInstance)[0];

//    let  channel = await activity['channel'];

//    let  vectors = await channel['vectors'];

//     await vectors.update({ paging: { sort: { createdAt: -1 } } });

//     vectors.when('refresh', async (data: any) => {
//       if(data.length === 0) return
//       const Id = data.added[0];

//       console.log('*********ID********', data.added[0]);
//       let postModel = await SQuery.Model('post');
//       let post = await postModel.newInstance({ id: Id });
//       let message = await post['message'];
//       let user = await message['user'];
//       let account = await user['account'];
//       let name = await account['name'];
//       let text = await message['text'];
//       let timestamp = await message['createdAt'];
//       let like = await post['likeCount'];
//       let images: string[] = [];
//       const userId = user.$id;
//       const postId = Id;
//       const randomCommentAuthorId = Math.floor(
//         Math.random() * 999999999999,
//       ).toString();
//     //   if (uri) images.push(uri);

//       const poste: PostSchema = {
//         id: postId,
//         keyId : randomCommentAuthorId,
//         author: {
//           id: userId,
//           name,
//           picture:
//             'https://images.pexels.com/photos/14737533/pexels-photo-14737533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//         },
//         type: 'image',
//         content: text,
//         images,
//         likes: like,
//         comments: [
//           {
//             author: {
//               name: 'Jane Doe',
//               id: randomCommentAuthorId,
//             },
//             content: 'randomCommentContent',
//             timestamp,
//           },
//         ],
//         timestamp,
//       };
//       dispatch(addPostServer(poste));

//     });

//     let data = await vectors.update();
//     let i = 0
//     data.items.forEach(async (item: any) => {
//       const Id = item._id;
//       console.log(Id, '*****************ITEMID*******************', item.createdAt);

//       let postModel = await SQuery.Model('post');
//       let post = await postModel.newInstance({ id: Id });
//       let message = await post['message'];
//       let user = await message['user'];
//       let account = await user['account'];
//       let name = await account['name'];
//       let text = await message['text'];
//       let timestamp = await message['createdAt'];
//       let like = await post['likeCount'];
//       const randomTimestamp = Math.floor(Date.now()).toString();
//       let images: string[] = [];
//       const userId = user.$id
//       const postId = Id;
//       const randomCommentAuthorId = Math.floor(
//         Math.random() * 99999999,
//       ).toString();
//       const KeyId = Math.floor(
//         Math.random() * 99999999,
//       ).toString()
//     //   if (uri) images.push(uri);

//       const poste: PostSchema = {
//         id: postId,
//         keyId : KeyId,
//         author: {
//           id: userId,
//           name,
//           picture:
//             'https://images.pexels.com/photos/14737533/pexels-photo-14737533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//         },
//         type: 'image',
//         content: text,
//         images,
//         likes: like,
//         comments: [
//           {
//             author: {
//               name: 'Jane Doe',
//               id: randomCommentAuthorId,
//             },
//             content: 'randomCommentContent',
//             timestamp,
//           },
//         ],
//         timestamp,
//       };
//       console.log('111@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',i++);
//       dispatch(addPostServer(poste));
//     });

//   };
