import { StyleSheet, Text,Dimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlashList } from '@shopify/flash-list';
import { POST_DATA } from '../posts';
import Postcomponent from '../components/Post/Postcomponent';
import { RATIO_HEADER } from '../utils/metric';
const { width, height } = Dimensions.get('window');
let HEADER_HEIGHT = (RATIO_HEADER * height) / 100;
const Activity = () => {
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
      if (refreshing) {
        //fetch data
        setRefreshing(false);
      }
    }, [refreshing]);
  return (
    <View>
          <FlashList
          key={2}
          data={POST_DATA}
          estimatedItemSize={height / 2.3}
          bounces={true}
          refreshing={refreshing}
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
          onRefresh={() => setRefreshing(true)}
          scrollEventThrottle={16}
          // extraData={}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Postcomponent posts={item} key={item.id} />
          )}
        />
    </View>
  )
}

export default Activity

const styles = StyleSheet.create({})