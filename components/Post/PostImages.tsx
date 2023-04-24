/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { HOST } from '../../utils/metric';
const { height } = Dimensions.get('window');
//ts-ignore
const PostImages = ({ images }: { images: string[] }) => {
  const renderImage = (imageUri: string, index: number, style: any) => (
    <FastImage
      key={index}
      style={[
        styles[style],
        {
          borderWidth: 5,
          borderColor: '#fff',
          borderRadius: 20,
        },
      ]}
      // resizeMethod={'auto'}

      resizeMode={FastImage.resizeMode.cover}
      source={{
        priority: FastImage.priority.normal,
        uri: imageUri
          ? HOST + imageUri
          : 'https://images.pexels.com/photos/6307706/pexels-photo-6307706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      }}
    />
  );

  return (
    <>
      {images.length > 0 && (
        <View style={styles.container}>
          {images
            .filter(image => image !== '')
            .map((image, index, imagesArr) =>
              renderImage(image, index, `s${imagesArr.length}To${index + 1}`),
            )}
        </View>
      )}
    </>
  );
};

const styles: any = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    width: '100%',
    maxHeight: height / 2.2,
    borderRadius: 99,
    paddingBottom: 15,
  },
  //********* */
  s1To1: {
    width: '100%',
    // width : 'auto',
    height: '100%',
    // justifyContent: 'center',
    // alignContent: 'center',
    // alignItems: 'center',
    // flexDirection: 'row',
    alignSelf: 'flex-end',
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
