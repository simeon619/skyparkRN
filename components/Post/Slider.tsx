/* eslint-disable react/no-unstable-nested-components */
import React, { useRef, useState } from 'react';
import { FlatList, View, useWindowDimensions } from 'react-native';
import PostImage from './PostImage';
import PostVideo from './PostVideo';
// const { height, width } = Dimensions.get('window');
//ts-ignore
const Slider = ({ images }: { images: string[] }) => {
  const { width } = useWindowDimensions();
  const ShowMedia = ({ image }: { image: string }) => {
    return (
      <>
        {image.endsWith('.jpg') || image.endsWith('.jpeg') ? (
          <PostImage image={image} />
        ) : (
          <PostVideo video={image} />
        )}
      </>
    );
  };
  console.log({ images });
  const [slideIndexPost, setSlideIndexPost] = useState<number>(0);
  const onViewableItemsChanged = useRef((item: any) => {
    const index = item.viewableItems[0].index;
    console.log(slideIndexPost);
    setSlideIndexPost(index);
  });
  const viewabilityConfig = useRef({
    itemVisiblePercentTreshold: 50,
  });
  console.log(slideIndexPost);

  return (
    <View>
      <FlatList
        horizontal={true}
        nestedScrollEnabled={true}
        pagingEnabled={true}
        bounces={true}
        onContentSizeChange={(w, h) => {
          console.log({ w, h });
        }}
        // getItemCount={data => data.length}
        showsHorizontalScrollIndicator={false}
        data={images}
        keyExtractor={_item => (Math.random() * 9999999).toString()}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        renderItem={({ item }) => <ShowMedia image={item} />}
      />
      {/* {images.length > 0 && (
        <View
          style={{
            width,
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 2,
          }}>
          {images.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: slideIndexPost === index ? '#333' : '#aaa',
                  marginVertical: 5,
                }}
              />
            );
          })}
        </View>
      )} */}
    </View>
  );
};

// const styles: any = StyleSheet.create({
//   container: {
//     // flexWrap: 'wrap',
//     flex: 1,
//     // width: '100%',
//     // maxHeight: height / 2.2,
//     // borderRadius: 99,
//     // paddingBottom: 15,
//   },
//   //********* */
//   s1To1: {
//     // width: width - 20,
//     // width : 'auto',
//     // height: width - 20,
//     // justifyContent: 'center',
//     // alignContent: 'center',
//     // alignItems: 'center',
//     // flexDirection: 'row',
//     alignSelf: 'flex-end',
//   },
//   //********* */
//   s2To1: {
//     width: '50%',
//     height: '100%',
//   },
//   s2To2: {
//     width: '50%',
//     height: '100%',
//   },
//   //********* */
//   s3To1: {
//     width: '50%',
//     height: '100%',
//   },
//   s3To2: {
//     width: '50%',
//     height: '50%',
//   },
//   s3To3: {
//     width: '50%',
//     height: '50%',
//   },
//   //********** */
//   s4To1: {
//     width: '50%',
//     height: '100%',
//   },
//   s4To2: {
//     width: '50%',
//     height: '33.33%',
//   },
//   s4To3: {
//     width: '50%',
//     height: '33.33%',
//   },
//   s4To4: {
//     width: '50%',
//     height: '33.33%',
//   },
// });

export default Slider;
