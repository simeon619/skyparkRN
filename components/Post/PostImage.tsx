/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { useWindowDimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { HOST } from '../../utils/metric';
//ts-ignore
const PostImages = ({ image }: { image: string }) => {
  const { width } = useWindowDimensions();

  return (
    <>
      <FastImage
        style={[
          { width: width - 26, height: width - 20 },
          {
            // borderWidth: 1,
            borderColor: '#549',
            borderRadius: 5,
          },
        ]}
        // resizeMethod={'auto'}

        resizeMode={FastImage.resizeMode.cover}
        source={{
          priority: FastImage.priority.normal,
          uri: image
            ? HOST + image
            : 'https://images.pexels.com/photos/6307706/pexels-photo-6307706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        }}
      />
    </>
  );
};

export default PostImages;
