import React, { useRef, useState } from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
const { width, height } = Dimensions.get('window');
//ts-ignore
import Video, { OnLoadData } from 'react-native-video';
const PostVideo = ({ video }: { video: string }) => {
  console.log('video', video);
  let videoPlayer = useRef<Video>(null);
  let [paused, setPause] = useState(true);
  const handleFocus = (e: GestureResponderEvent) => {
    setPause(!paused);
  };

  const time = (data: OnLoadData) => {
    console.log(data);
  };

  return (
    <View style={styles.container}>
      <Video
        onTouchEnd={handleFocus}
        source={{
          uri: 'https://media.istockphoto.com/id/1472415034/video/repair-work-at-neighbours-concept-irritated-man-at-home-cover-ears-with-pillows-annoyed-by.mp4?s=mp4-640x640-is&k=20&c=mScBfcXlCq0XEXOthwpfMHN20GQ9TdStkd-CphnPBDY=',
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
        // fullscreen={true}
        controls={!paused}
        repeat={true}
        // onLoad={time}
        paused={paused}
        resizeMode="cover"
      />

      {paused ? (
        <Text
          style={{
            fontSize: 25,
            color: 'red',
            zIndex: 100,
            position: 'absolute',
          }}>
          ⏸
        </Text>
      ) : (
        <Text
          style={{
            fontSize: 25,
            letterSpacing: 3,
            color: 'blue',
            zIndex: 100,
            position: 'absolute',
          }}>
          ▶
        </Text>
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

export default PostVideo;
