/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import * as Progress from 'react-native-progress';
import pause from '../../assets/images/pause.png';
import play from '../../assets/images/play.png';

//ts-ignore
import Video, { OnLoadData, OnProgressData } from 'react-native-video';
import { HOST } from '../../utils/metric';
const PostVideo = ({ video }: { video: string }) => {
  const { width, height } = useWindowDimensions();
  console.log('video', video);
  let [paused, setPause] = useState(true);
  const handleFocus = () => {
    setPause(!paused);
  };

  const [heightVideo, setHeightVideo] = useState(0);
  const [_widthVideo, setWidthVideo] = useState(0);
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
        // marginTop: 5,
        width: width - 26,
        height: width - 20,
        borderRadius: 5,
        overflow: 'hidden',
        // maxHeight: height / 2,
      }}>
      <Video
        onTouchEnd={handleFocus}
        source={{
          uri: HOST + video,
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
      {paused && (
        <View
          style={{
            width: 50,
            height: 50,
            backgroundColor: '#0005',
            padding: 10,
            borderRadius: 99,
            position: 'absolute',
            margin: 'auto',
            right: (width - 20) / 2 - 25,
            top: (width - 20) / 2 - 25,
          }}>
          {paused ? (
            <Image
              source={play}
              resizeMode="contain"
              style={{
                // backgroundColor: '#0005',
                width: '100%',
                height: '100%',
                // alignItems: 'center',
                // justifyContent: 'center',
                // transform: [{ translateX: 25, translateY: 25 }],
              }}
            />
          ) : (
            <Image
              source={pause}
              resizeMode="cover"
              style={{
                width: 0,
                height: 0,
              }}
            />
          )}
        </View>
      )}
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
          height={6}
          color="purple"
          borderColor="#0000"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
