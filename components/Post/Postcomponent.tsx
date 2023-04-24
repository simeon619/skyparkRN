/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { memo, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { COLORS } from '../../themes/colors';
import {
  HOST,
  InitPostComments,
  calculeDate,
  commentSchema,
} from '../../utils/metric';
import { PostSchema } from '../../utils/posts';
import SQuery from '../../utils/squery/SQueryClient';
import PostImages from './PostImages';
import PostVideo from './PostVideo';
type PostListProps = {
  posts: PostSchema;
  navigation: any;
};
const { width, height: HS } = Dimensions.get('window');
let GLOBAL: any = {};
const PostComponent = (props: PostListProps) => {
  const { posts, navigation } = props;
  const [uri, setUri] = useState(posts.author.picture);
  const [timePost, SetTimePost] = useState(posts.timestamp);
  const [pics, setPics] = useState<string[] | undefined>(posts.images);
  const [video, setVideo] = useState<string | undefined>(posts.videos);
  const [likes, setLikes] = useState<number>(posts.likes);
  const [plusLike, setPlusLike] = useState(true);

  const toggleLike = () => {
    setPlusLike(prev => !prev);
  };
  useEffect(() => {
    InitPostComments(posts.id);
  }, []);
  const Comments = useSelector((state: any) => state.commentPost);
  let showComment = Comments[posts.id]?.results;

  return (
    <View
      style={{
        paddingHorizontal: 10,
        backgroundColor: 'white',
        paddingTop: 10,
        margin: 3,
        elevation: 1,
        borderRadius: 5,
      }}>
      <View style={styles.postHeader}>
        <View style={styles.infoUser}>
          <FastImage
            style={{
              height: width * 0.11,
              width: width * 0.11,
              borderRadius: 99,
            }}
            source={uri ? { uri } : require('../../assets/images/user.png')}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={{ rowGap: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
                gap: width * 0.02,
              }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: '#112',
                  fontSize: 17,
                  width: width * 0.7,
                  fontFamily: 'Roboto-Bold',
                }}>
                {posts.author.name}
              </Text>
            </View>
            <Text
              style={{
                color: '#112a',
                fontSize: width * 0.04,
                fontFamily: 'Roboto-Regular',
              }}>
              {calculeDate(+timePost)}
            </Text>
          </View>
        </View>
        <View style={styles.settingsPost}>
          <FastImage
            style={{
              width: width * 0.05,
              height: width * 0.05,
            }}
            source={require('../../assets/images/option.png')}
          />
        </View>
      </View>
      {!!posts.content.toString() && (
        <View style={{ backgroundColor: 'white', paddingBottom: 3 }}>
          <Text
            style={[
              {
                color: '#101200',
                fontFamily: 'Roboto-Regular',
                marginVertical: 7,
                marginLeft: 5,
              },
              (pics && pics.length > 0) || video
                ? { fontSize: width * 0.044 }
                : { fontSize: width * 0.045 },
            ]}>
            {posts.content.toString()}
          </Text>
        </View>
      )}
      <View style={{}}>
        {pics && <PostImages images={pics} />}
        {video && <PostVideo video={video} />}
      </View>
      <View style={styles.postFooter}>
        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc9',
            borderTopColor: '#ccc9',
            borderBottomWidth: 1,
            borderTopWidth: 1,
            paddingVertical: 15,
            justifyContent: 'space-around',
          }}>
          <Pressable
            onPress={async () => {
              toggleLike();
              const like: number = await new Promise(res => {
                SQuery.emit(
                  'post:like',
                  { postId: posts.id, like: plusLike },
                  (result: any) => {
                    if (result.error) {
                      return res(0);
                    }
                    res(result.response);
                    setLikes(result.response);
                  },
                );
              });
            }}
            style={[styles.stats, { width: width * 0.15 }]}>
            <Text
              style={[
                {
                  color: COLORS.blue,
                  fontFamily: 'Ubuntu-Regular',
                  fontSize: 16,
                },
                !plusLike && { color: 'green' },
              ]}>
              Like{!plusLike && <Text>d</Text>}
            </Text>
            <Text
              style={[
                styles.Textstats,
                { color: COLORS.blue },
                !plusLike && { color: 'green' },
              ]}>
              {likes}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate('detailPost', {
                id: posts.id,
                showKeyBoard: true,
              });
            }}
            style={styles.stats}>
            <Text
              style={{
                color: '#666',
                fontFamily: 'Ubuntu-Regular',
                fontSize: 16,
              }}>
              Comment
            </Text>
          </Pressable>
          <View style={styles.stats}>
            <Text
              style={{
                color: '#666',
                fontFamily: 'Ubuntu-Regular',
                fontSize: 16,
              }}>
              Share +
            </Text>
          </View>
        </View>
      </View>
      <View style={{ backgroundColor: '#fffffe', paddingLeft: width * 0.06 }}>
        {showComment?.length > 2 ? (
          <View
            style={{
              paddingHorizontal: 10,
              flexDirection: 'row',
              paddingTop: 5,
              gap: 5,
            }}>
            <Image
              style={{
                tintColor: COLORS.blue,
                width: width * 0.05,
                height: width * 0.05,
              }}
              source={require('../../assets/images/eye.png')}
            />
            <Pressable
              onPress={() => {
                navigation.navigate('detailPost', {
                  id: posts.id,
                  showKeyBoard: false,
                });
              }}>
              <Text
                style={{
                  color: COLORS.blue,
                  fontSize: 15,

                  fontFamily: 'Ubuntu-Regular',
                }}>
                Show all {showComment.length} comments
              </Text>
            </Pressable>
          </View>
        ) : null}
        {showComment?.slice?.(-2)?.map((c: commentSchema, i: number) => (
          <PostItem key={i} item={c} i={i} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  like: {
    width: 15,
    height: 15,
    tintColor: '#555',
  },
  Textstats: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Ubuntu-Regular',
    borderColor: '#5555',
    paddingLeft: 4,
    paddingRight: 3,
    borderWidth: 1,
    borderRadius: 999,
  },
  Ilike: {
    width: 18,
    height: 18,
    tintColor: '#555',
  },
  stats: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  stats1: { fontSize: 18, color: '#555', fontFamily: 'Ubuntu-Regular' },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  infoUser: {
    flexDirection: 'row',
    gap: 8,
  },
  settingsPost: {},
  statsPost: {
    borderBottomColor: '#0003',
    borderBottomWidth: 0.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  interactPost: {
    flexDirection: 'row',
    // gap: 20,
    justifyContent: 'space-around',
  },

  postFooter: {
    backgroundColor: 'white',
  },
});
export const PostItem = ({ item, i }: { item: commentSchema; i: number }) => {
  return (
    <View
      style={{
        maxWidth: width * 0.9,
        marginVertical: 10,
        alignSelf: 'flex-start',
      }}>
      <View
        style={{
          flexDirection: 'row',
          columnGap: 5,
          alignItems: 'flex-start',
        }}>
        <Image
          style={{
            height: width * 0.09,
            width: width * 0.09,
            borderRadius: 99,
          }}
          source={
            item.picUser
              ? { uri: HOST + item.picUser }
              : require('../../assets/images/user.png')
          }
        />
        <View>
          <View
            style={{
              // borderColor: '#4442',
              // borderWidth: 0.4,
              alignSelf: 'flex-start',
              borderRadius: 10,
              maxWidth: width * 0.9 - width * 0.11,
              padding: 5,
              elevation: 1,
              backgroundColor: '#eee',
            }}>
            <Text
              style={{
                color: '#112d',
                fontSize: width * 0.039,
                fontFamily: 'Roboto-Bold',
              }}>
              {item.name}
            </Text>
            <Text
              style={{
                fontSize: width * 0.043,
                color: '#333',
                textAlignVertical: 'bottom',
                fontFamily: 'Roboto-Regular',
              }}>
              {item.commentaire}
            </Text>
            {item.images?.length > 0 && (
              <View
                style={{
                  marginVertical: 5,
                  maxWidth: width * 0.6,
                  maxHeight: width * 0.4,
                }}>
                <FastImage
                  style={{
                    borderRadius: 10,
                    width: '100%',
                    height: '100%',
                  }}
                  source={{ uri: HOST + item.images[0] }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              marginVertical: 4,
              alignItems: 'baseline',
            }}>
            <Text
              style={{
                color: '#111a',
                fontSize: 15,
                fontFamily: 'Roboto-Regular',
              }}>
              {/* {!time.split(' ')[3]
                ? time.split(' ')[2]
                  ? time.split(' ')[1]
                  : time.split(' ')[0]
                : time}{' '}
              {!time.split(' ')[3]
                ? time.split(' ')[2]
                  ? time.split(' ')[2][0]
                  : time.split(' ')[1][0]
                : null} */}
              {calculeDate(item.time)}
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  color: '#112a',
                  fontSize: width * 0.04,
                  fontFamily: 'Roboto-Regular',
                }}>
                {' '}
                Like{' '}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('detailPost', {
                //   id: postId,
                //   showKeyBoard: true,
                // });
              }}>
              <Text
                style={{
                  color: '#112b',
                  fontSize: width * 0.04,
                  fontFamily: 'Roboto-Regular',
                }}>
                Response
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
export default memo(PostComponent);
