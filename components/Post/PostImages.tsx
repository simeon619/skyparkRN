import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
const { width, height } = Dimensions.get('window');
//ts-ignore
const PostImages = ({ images }: { images: string[] }) => {
  const renderImage = (imageUri: string, index: number, style: any) => (
    <Image
      key={index}
      style={[styles[style], { borderWidth: 1, borderColor: '#efefee' }]}
      resizeMethod={'scale'}
      resizeMode={'contain'}
      source={{
        uri: imageUri
          ? imageUri
          : 'https://images.pexels.com/photos/6307706/pexels-photo-6307706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      }}
    />
  );
  const [imageHeights, setImageHeights] = useState<number[]>([]);

  useEffect(() => {
    const fetchImageHeights = async () => {
      const heights = await Promise.all(
        images.map(imageUri => getImageHeight(imageUri)),
      );
      setImageHeights(heights);
    };
    fetchImageHeights();
  }, [images]);

  const getImageHeight = async (imageUri: string) => {
    return new Promise<number>((resolve, reject) => {
      Image.getSize(
        imageUri,
        (width: number, height: number) => {
          resolve(height);
        },
        (error: any) => {
          reject(error);
        },
      );
    });
  };

  console.log(images);

  return (
    <>
      {images.length > 0 && (
        <View style={styles.container}>
          {images
            .filter(image => image != '')
            .map((image, index, images) =>
              renderImage(image, index, `s${images.length}To${index + 1}`),
            )}
        </View>
      )}
    </>
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
