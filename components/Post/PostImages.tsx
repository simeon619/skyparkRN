import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
const { width, height } = Dimensions.get('window');
//ts-ignore
import Video from 'react-native-video';
const PostImages = ({ images }: { images: string[] }) => {
  const renderImage = (imageUri: string, index: number, style: any) => (
      <Image
        key={index}
        style={[styles[style], {borderWidth :1 , borderColor :'#efefee'}]}
        source={{
          uri: imageUri
            ? imageUri
            : 'https://images.pexels.com/photos/6307706/pexels-photo-6307706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        }}
      />
  );
  return (
    <View style={styles.container}>
      {images.map((image, index, images) =>
        renderImage(image, index, `s${images.length}To${index+1}`),
      )}
    </View>
  );
};

const styles: any = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    width,
    height: height / 2,
  },
  //********* */
  s1To1: {
    width: '100%',
    height: '100%',
  },
  //********* */
  s2To1: {
    width: '50%',
    height: '100%',
  },
  s2To2: {
    width: '50%',
    height: '100%',
  },
  //********* */
  s3To1: {
    width: '50%',
    height: '100%',
  },
  s3To2: {
    width: '50%',
    height: '50%',
  },
  s3To3: {
    width: '50%',
    height: '50%',
  },
  //********** */
  s4To1: {
    width: '50%',
    height: '100%',
  },
  s4To2: {
    width: '50%',
    height: '33.33%',
  },
  s4To3: {
    width: '50%',
    height: '33.33%',
  },
  s4To4: {
    width: '50%',
    height: '33.33%',
  },
});

export default PostImages;
