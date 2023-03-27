import { FlashList } from '@shopify/flash-list';
import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
type ActivitySchema = {
  id: string;
  name: string;
  description: string;
  picture: string;
};

type ArrayActivity = ActivitySchema[];

const { width, height } = Dimensions.get('window');
const ItemActivity = ({ navigation }: any) => {
  const ItemsActivty: ArrayActivity = [
    {
      id: '6415453465',
      name: 'Music',
      description: 'Discover the new Music',
      picture:
        'https://images.pexels.com/photos/2228466/pexels-photo-2228466.jpeg',
    },
    {
      id: '6447544465',
      name: 'Sport',
      description: 'Discover the new Sport',
      picture:
        'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '6415457865',
      name: 'Animals',
      description: 'Discover the Animals',
      picture:
        'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '641654665465',
      name: 'Cinema',
      description: 'Discover the new cinema',
      picture:
        'https://images.pexels.com/photos/7991378/pexels-photo-7991378.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  ];

  const ItemView = (props: { item: ActivitySchema , navigation :any }) => {
    const { item } = props;
    return (
      <View
        style={{
          borderRadius: 10,
          overflow: 'hidden',
          width: '100%',
          height: height / 5,
          backgroundColor: 'red',
          marginBottom: 10,
        }}>
        <Pressable
          onPress={() => {
            navigation.navigate('Activity');

            console.log('je suis');
            
          }}>
          <ImageBackground
            source={{ uri: item.picture }}
            style={{
              width: '100%',
              height: '100%',
            }}>
            <View style={{ margin: 20 }}>
              <Text style={{ fontSize: 25, fontWeight: '900', color: 'white' }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 15, fontWeight: '400', color: 'white' }}>
                {item.description}
              </Text>
            </View>
          </ImageBackground>
        </Pressable>
      </View>
    );
  };
  return (
    <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 15 }}>
      <View style={styles.header}>
        <View style={styles.topHeader}>
          <Image
            style={styles.icon}
            source={require('../assets/images/user.png')}
          />
          <Image
            style={styles.icon1}
            source={require('../assets/images/settings.png')}
          />
        </View>
        <View style={styles.bottomHeader}>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            <Text style={{ fontSize: 22, color: 'black', fontWeight: '400' }}>
              Hello,
            </Text>
            <Text style={{ fontSize: 22, color: 'black', fontWeight: '900' }}>
              Jhon !
            </Text>
          </View>
          <View style={{ paddingTop: 10 }}>
            <Text style={{ fontSize: 15, color: 'black', fontWeight: '300' }}>
              Welcome for the activity introduce to the activities
            </Text>
          </View>
        </View>
      </View>
      <FlashList
        data={ItemsActivty}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={height / 5}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ItemView item={item} navigation={navigation} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {},
  icon: {
    width: 40,
    height: 40,
  },
  icon1: {
    width: 30,
    height: 30,
  },
  body: {},
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomHeader: {
    paddingVertical: 20,
  },
});
export default ItemActivity;
