import { memo, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { PostSchema } from '../../posts';
import PostImages from './PostImages';
import PostVideo from './PostVideo';
type PostListProps = {
  posts: PostSchema;
};
const { width, height } = Dimensions.get('window');
const PostComponent = (props: PostListProps) => {
  const { posts } = props;
  const [uri, setUri] = useState(posts.author.picture);
  const [timePost, SetTimePost] = useState(+posts.timestamp * 1000);
  const [pics, setPics] = useState<string[] | undefined>(posts.images);
  const [video, setVideo] = useState<string | undefined>(posts.videos);
  const [likes, setLikes] = useState<number>(posts.likes);

  return (
    <View style={{ backgroundColor: '#efefee' }}>
      <View style={{ marginBottom: 10 }}>
        <View style={styles.postHeader}>
          <View style={styles.infoUser}>
            <Image
              style={{
                height: 30,
                width: 30,
              }}
              source={uri ? { uri } : require('../../assets/images/user.png')}
              resizeMode={'contain'}
            />
            <View>
              <Text style={{ color: 'black', fontSize: 16 }}>
                {posts.author.name}
              </Text>
              <Text style={{ color: 'black', fontSize: 11 }}>
                {new Date(timePost).getUTCHours()} h.
              </Text>
            </View>
          </View>
          <View style={styles.settingsPost}>
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontWeight: '900',
                letterSpacing: 2,
              }}>
              ...
            </Text>
          </View>
        </View>
        <View style={{ backgroundColor: 'white', paddingHorizontal: 7 }}>
          <Text
            style={{
              color: 'black',
              fontSize: 15,
              fontWeight: '400',
              marginVertical: 7,
            }}>
            {posts.content.toString()} .
          </Text>
        </View>
        <View>
          {pics && <PostImages images={pics} />}
          {video && <PostVideo video={video} />}
        </View>
        <View style={styles.postFooter}>
          <View style={styles.statsPost}>
            <View style={styles.stats}>
              <Image
                style={styles.like}
                source={require('../../assets/images/like.png')}
              />
              <Text style={styles.stats1}>{likes}</Text>
            </View>
            <View style={styles.stats}>
              <View style={styles.stats}>
                <Image
                  style={styles.like}
                  source={require('../../assets/images/comment1.png')}
                />
                <Text style={styles.stats1}>{likes}</Text>
              </View>
              <View style={styles.stats}>
                <Image
                  style={styles.like}
                  source={require('../../assets/images/share1.png')}
                />
                <Text style={styles.stats1}>{likes}</Text>
              </View>
            </View>
          </View>
          <View style={styles.interactPost}>
            <View style={styles.stats}>
              <Image
                style={styles.like}
                source={require('../../assets/images/like2.png')}
              />
              <Text style={styles.stats1}>Like</Text>
            </View>
            <View style={styles.stats}>
              <Image
                style={styles.like}
                source={require('../../assets/images/comment1.png')}
              />
              <Text style={styles.stats1}>Comment</Text>
            </View>
            <View style={styles.stats}>
              <Image
                style={styles.like}
                source={require('../../assets/images/share1.png')}
              />
              <Text style={styles.stats1}>Partagez</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  like: {
    width: 19,
    height: 19,
  },
  stats: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  stats1 :{ fontSize: 18, fontWeight: '500' , color : 'black'},
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 9,
    paddingTop: 9,
  },
  infoUser: {
    flexDirection: 'row',
    gap: 8,
  },
  settingsPost: {},
  statsPost: {
    borderBottomColor: '#0008',
    borderBottomWidth: 0.8,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  interactPost: {
    paddingVertical: 6,
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },

  postFooter: {
    backgroundColor: 'white',
    paddingHorizontal: '5%',
  },
});

export default memo(PostComponent);
