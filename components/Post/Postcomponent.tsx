/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { memo, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MagicModalPortal, magicModal } from 'react-native-magic-modal';

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
import Slider from './Slider';
type PostListProps = {
  posts: PostSchema;
  navigation: any;
};
const { width, height: HS } = Dimensions.get('window');
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
  let builContact = {
    nameUser: posts.author.name,
    picUser: posts.author.picture,
    timestamp: posts.timestamp,
  };
  async function createDiscusion() {
    return await new Promise((resol, rej) => {
      SQuery.emit(
        'messenger:createDiscussion',
        { receiverId: posts.author.id },
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
  const ResponseModal = () => (
    <SafeAreaView style={styles.options}>
      <View style={styles.item}>
        <FastImage
          style={{ width: width * 0.075, aspectRatio: 1 }}
          source={require('../../assets/images/share.png')}
        />
        <View>
          <Text style={styles.itemText}>Share +</Text>
          <Text style={{}}>share the publication with your friends</Text>
        </View>
      </View>
      <View style={styles.item}>
        <FastImage
          style={{ width: width * 0.075, aspectRatio: 1 }}
          source={require('../../assets/images/warning.png')}
        />
        <View>
          <Text style={styles.itemText}>Report</Text>
          <Text style={{}}>
            report the publication it brakes the rules of the community
          </Text>
        </View>
      </View>
      <View style={styles.item}>
        <FastImage
          style={{ width: width * 0.065, aspectRatio: 1 }}
          source={require('../../assets/images/delete.png')}
        />
        <View>
          <Text style={styles.itemText}>Hide publication</Text>
          <Text style={{}}>
            hide the publication so that it is no longer visible
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
  const Comments = useSelector((state: any) => state.commentPost);

  let showComment = Comments[posts.id]?.results;
  // console.log((createDiscusion() as any)?.vectors, 'laladald');
  return (
    <>
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
              source={
                uri
                  ? { uri: HOST + uri }
                  : require('../../assets/images/user.png')
              }
              resizeMode={FastImage.resizeMode.cover}
            />
            <View
              style={{
                rowGap: 1,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  flexDirection: 'row',
                  alignItems: 'baseline',
                  maxHeight: 25,
                  gap: width * 0.02,
                }}>
                <Text
                  numberOfLines={0.5}
                  ellipsizeMode="tail"
                  style={{
                    color: '#112e',
                    fontSize: width * 0.045,
                    // width: width * 0.3,
                    fontFamily: 'Roboto-Bold',
                  }}>
                  {posts.author.name},{' '}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: '#112e',
                    fontSize: width * 0.042,
                    fontFamily: 'Roboto-Bold',
                    // textDecorationLine: 'underline',
                  }}>
                  Building 1
                </Text>
              </Text>
              <View style={{ flexDirection: 'row', columnGap: 5 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 3,
                  }}>
                  <Text
                    style={{
                      color: '#444',
                      fontSize: width * 0.04,
                      fontFamily: 'Roboto-Regular',
                    }}>
                    {posts.nameActivity}
                  </Text>
                  <Image
                    style={{ width: 22, height: 22 }}
                    source={
                      posts.iconActivity
                        ? { uri: HOST + posts.iconActivity }
                        : require('../../assets/images/notifications.png')
                    }
                  />
                </View>
                <Text
                  style={{
                    color: '#112d',
                    fontSize: width * 0.042,
                    fontFamily: 'Roboto-Regular',
                  }}>
                  {calculeDate(+timePost)}
                </Text>
              </View>
            </View>
          </View>
          <Pressable
            onPress={() => {
              magicModal.show(() => <ResponseModal />);
            }}
            style={[styles.settingsPost, { padding: 10 }]}>
            <FastImage
              style={{
                width: width * 0.05,
                height: width * 0.05,
              }}
              source={require('../../assets/images/option.png')}
            />
          </Pressable>
        </View>
        {!!posts.content.toString() && (
          <View
            style={{
              backgroundColor: 'white',
              paddingBottom: 3,
              // marginBottom: 50,
            }}>
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
        <View>{pics && <Slider images={pics} />}</View>
        <View style={styles.postFooter}>
          <View
            style={{
              flexDirection: 'row',
              borderBottomColor: '#ccc9',
              borderTopColor: '#ccc9',
              borderBottomWidth: 1,
              borderTopWidth: 1,
              paddingVertical: 10,
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
                {!plusLike ? <Text>Liked</Text> : <Text>Like</Text>}
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

            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: COLORS.blue,
                paddingVertical: 4,
                paddingHorizontal: 10,
                borderWidth: 1,
                gap: 5,
                borderRadius: 5,
                elevation: 90,
                backgroundColor: '#9490',
              }}
              onPress={async () => {
                navigation.navigate('discussion', {
                  contact: builContact,
                  vectors: await ((await createDiscusion()) as any)?.vectors,
                });
                console.log('contact');
              }}>
              <Text
                style={{
                  color: COLORS.blue,
                  fontFamily: 'Ubuntu-Regular',
                  fontSize: 16,
                }}>
                Contact
              </Text>
              <Image
                style={{
                  tintColor: COLORS.blue,
                  width: 16,
                  aspectRatio: 1,
                }}
                source={require('../../assets/images/chat.png')}
              />
            </Pressable>
          </View>
        </View>
        <View style={{ backgroundColor: '#fffffe', paddingLeft: width * 0.06 }}>
          {showComment?.slice?.(-2)?.map((c: commentSchema, i: number) => (
            <PostItem key={i} item={c} i={i} />
          ))}
          {showComment?.length > 2 ? (
            <Pressable
              onPress={() => {
                navigation.navigate('detailPost', {
                  id: posts.id,
                  showKeyBoard: false,
                });
              }}
              style={{
                paddingHorizontal: 10,
                flexDirection: 'row',
                paddingBottom: 8,
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
              <View>
                <Text
                  style={{
                    color: COLORS.blue,
                    fontSize: 15,

                    fontFamily: 'Ubuntu-Regular',
                  }}>
                  Show all {showComment.length} comments
                </Text>
              </View>
            </Pressable>
          ) : null}
        </View>
      </View>
      <MagicModalPortal />
    </>
  );
};

const styles = StyleSheet.create({
  like: {
    width: 15,
    height: 15,
    tintColor: '#555',
  },
  item: {
    paddingVertical: 5,
    paddingLeft: 10,
    flexDirection: 'row',
    width,
    alignItems: 'center',
    gap: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 5,
  },
  itemText: {
    fontSize: width * 0.055,
    fontFamily: 'Roboto-Regular',
    color: '#222',
  },
  options: {
    // height: 80, // définir la hauteur de la vue modale
    width: '99%', // définir la largeur de la vue modale
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: 'absolute',
    paddingHorizontal: 30,
    // flexDirection: 'row',
    borderColor: '#333',
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
    elevation: 50,
    // borderTopWidth: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
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
  stats: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  stats1: { fontSize: 18, color: '#555', fontFamily: 'Ubuntu-Regular' },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  infoUser: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 5,
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
export const PostItem = ({
  item,
  i,
  setLastHeightComment,
}: {
  item: commentSchema;
  i: number;
  setLastHeightComment?: any;
}) => {
  const onLayout = ({ nativeEvent }: any) => {
    setLastHeightComment?.(nativeEvent.layout.height);
  };

  return (
    <View
      onLayout={onLayout}
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
