import React, { useRef, useState } from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import * as Progress from 'react-native-progress';
import pause from '../../assets/images/pause.png';
import play from '../../assets/images/play.png';
const { width, height } = Dimensions.get('window');
//ts-ignore
import Video, { OnLoadData, OnProgressData } from 'react-native-video';
const PostVideo = ({ video }: { video: string }) => {
  console.log('video', video);
  let [paused, setPause] = useState(true);
  const handleFocus = (e: GestureResponderEvent) => {
    setPause(!paused);
  };

  const [heightVideo, setHeightVideo] = useState(0);
  const [widthVideo, setWidthVideo] = useState(0);
  const [lengthVideo, setLengthVideo] = useState(0);
  const handleLoad = (data: OnLoadData) => {
    setWidthVideo(data.naturalSize.width);
    setHeightVideo(data.naturalSize.height);
    console.log(data.naturalSize.height);
  };

  function handleProgress(data: OnProgressData): void {
    setLengthVideo(data.currentTime / data.playableDuration);
  }

  return (
    <View
      style={{
        width,
        height: heightVideo,
        maxHeight: height / 2,
      }}>
      <Video
        onTouchEnd={handleFocus}
        source={{
          uri: 'https://joy.videvo.net/videvo_files/video/premium/video0236/small_watermarked/NO%20MR_STOCK%20FOOTAGE%20NO%20MR%20(985)_preview.webm',
        }}
        onLoad={handleLoad}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
        onProgress={handleProgress}
        // fullscreen={true}

        // controls={!paused}
        repeat={true}
        // onLoad={time}
        paused={paused}
        resizeMode="cover"
      />
      <View>
        {paused ? (
          <Image source={play} style={{ width: 15, height: 15 }} />
        ) : (
          <Image source={pause} style={{ width: 15, height: 15 }} />
        )}
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: -1,
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}>
        <Progress.Bar
          progress={lengthVideo}
          width={width}
          animated={true}
          useNativeDriver={true}
          height={3}
          color="purple"
          borderColor="#0000"
        />
      </View>
    </View>
  );
};

const styles: any = StyleSheet.create({
  container: {},
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
