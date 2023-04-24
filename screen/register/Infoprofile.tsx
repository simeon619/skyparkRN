/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
// import Modal from 'react-native-modal';
import { Pressable } from 'react-native';
import RNFS from 'react-native-fs';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS } from '../../themes/colors';
import { normalize } from '../../themes/metrics';
import { HOST } from '../../utils/metric';
import { PropsNavigation } from '../../utils/schemaType';
import SQuery from '../../utils/squery/SQueryClient';
// import { PropsNaivation } from '../../utils/schemaType';
let model = null;
let account = null;
let profile: any = null;
export const Infoprofile = (props: PropsNavigation) => {
  const { navigation } = props;

  const [visible, setVisible] = useState(false);
  const close = () => setVisible(false);
  let User = useSelector((state: any) => state.dataUser);
  const [uri, setUri] = useState('');
  const [name, setName] = useState<string>(User?.name);
  const [status, setStatus] = useState('Locataire');
  const [room, setRoom] = useState(User?.room);
  const [door, setDoor] = useState(User?.door);
  const [etage, setEtage] = useState(User?.etage);
  const [email, setEmail] = useState(User?.email);
  const [telephone, setTelephone] = useState(User?.telephone);
  const [city, setCity] = useState(User?.city);
  const [buildingName, setBuildingName] = useState(User?.buildingName);

  const refresh = async () => {
    model = await SQuery.Model('account');
    account = await model.newInstance({
      id: User.accountId,
    });

    profile = await account.profile;
    let img = await profile.imgProfile;

    setUri(img[0] ? HOST + img[0] : '');
    account?.when('refresh:name', setName);
    account?.when('refresh:telephone', setTelephone);
    account?.when('refresh:email', setEmail);
    account?.when('refresh:status', setStatus);
    profile?.when('refresh:imgProfile', (imageProfile: string[]) => {
      setUri(imageProfile[0] ? HOST + imageProfile[0] : '');
    });
    // setUri(User.imgProfile);
  };
  useEffect(() => {
    refresh();
  }, []);

  const [translateY] = useState(new Animated.Value(0));
  const showModal = () => {
    setVisible(true);
  };

  const chooseImage = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: 'photo',
      compressImageQuality: 0.5,
      // smartAlbums: ,
    })
      .then(async (image: ImageOrVideo) => {
        let buffer = await RNFS.readFile(image.path, 'base64');
        let fileImage = {
          ...image,
          buffer,
          fileName: 'img',
          encoding: 'base64',
        };
        profile.imgProfile = [fileImage];
      })
      .catch(e => {
        console.log(e);
      })
      .finally(close);
  };
  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(async image => {
        let buffer = await RNFS.readFile(image.path, 'base64');
        let fileImage = {
          ...image,
          buffer,
          fileName: 'img',
          encoding: 'base64',
        };
        profile.imgProfile = [fileImage];
        setUri(image.path);
      })
      .catch(e => {
        console.log(e);
      })
      .finally(close);
  };

  const hideModal = () => {
    setVisible(false);
  };
  console.log(uri);

  return (
    <ScrollView
      style={{
        backgroundColor: 'white',
        flex: 1,
        alignContent: 'center',
      }}>
      <StatusBar
        hidden={false}
        backgroundColor={'white'}
        barStyle={'dark-content'}
      />
      <View style={styles.containHeader}>
        <Text style={styles.TextHeader}>Profile</Text>
      </View>
      <View style={styles.containProfile}>
        <TouchableOpacity onPress={showModal}>
          <Image
            style={styles.avatar}
            resizeMode="contain"
            source={uri ? { uri } : require('../../assets/images/user.png')}
          />
        </TouchableOpacity>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.status}>Locataire</Text>
      </View>
      <View style={styles.AddressContain}>
        <View style={styles.room}>
          <Text style={styles.valueAdress}>{room}</Text>
          <Text style={styles.titleAdress}>Flat</Text>
        </View>
        <View style={styles.door}>
          <Text style={styles.valueAdress}>{door}</Text>
          <Text style={styles.titleAdress}>Entrance</Text>
        </View>
        <View style={styles.stair}>
          <Text style={styles.valueAdress}>{etage}</Text>
          <Text style={styles.titleAdress}>Floor</Text>
        </View>
      </View>

      <Text style={styles.txtHeader} />
      <View style={styles.squareProfile}>
        <View style={styles.containIcon}>
          <Image
            style={styles.icon1}
            source={require('../../assets/images/email.png')}
          />
          <Text style={styles.icontxt}>{email}</Text>
        </View>
        <View style={styles.containIcon}>
          <Image
            style={styles.icon1}
            source={require('../../assets/images/telephone.png')}
          />
          <Text style={styles.icontxt}>{telephone}</Text>
        </View>
        <View style={styles.containIcon}>
          <Image
            style={styles.icon1}
            source={require('../../assets/images/home-address.png')}
          />
          <Text style={styles.icontxt}>{city}</Text>
        </View>
        <View style={styles.containIcon}>
          <Image
            style={styles.icon1}
            source={require('../../assets/images/building.png')}
          />
          <Text style={styles.icontxt}>{buildingName}</Text>
        </View>
      </View>
      <Text
        style={styles.BtnNext}
        onPress={() => {
          navigation.navigate('Drawer');
        }}>
        NEXT
      </Text>
      <Text style={styles.Phrase}>
        Verifiez que les informations sont correctes
      </Text>
      <View
        onTouchEnd={hideModal}
        style={{
          height: 0,
          width: 0,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
        }}>
        <Modal
          visible={visible}
          onRequestClose={hideModal}
          transparent={true}
          animationType="slide"
          onDismiss={hideModal}>
          <SafeAreaView style={styles.options}>
            <Pressable style={styles.option} onPress={chooseImage}>
              <Image
                source={require('../../assets/images/image.png')}
                style={styles.optionSelect}
              />
              <Text style={styles.optionSelectText}>Library </Text>
            </Pressable>
            <Pressable style={styles.option} onPress={openCamera}>
              <Image
                source={require('../../assets/images/diaphragm.png')}
                style={styles.optionSelect}
              />
              <Text style={styles.optionSelectText}>Camera</Text>
            </Pressable>
          </SafeAreaView>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  options: {
    height: 80, // définir la hauteur de la vue modale
    width: '99%', // définir la largeur de la vue modale
    backgroundColor: '#555',
    borderRadius: 99,
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // borderTopWidth: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  avatar: {
    paddingTop: 20,
    height: 90,
    width: 90,
    borderRadius: 100,
    padding: 20,
  },
  optionSelect: {
    marginVertical: 10,
    height: 30,
    width: 30,
    tintColor: 'white',
  },

  optionSelectText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '400',
    textAlign: 'center',
    fontFamily: 'Unbuntu-Regular',
  },

  option: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  containHeader: {
    alignItems: 'center',
    marginVertical: 15,
  },
  TextHeader: {
    color: COLORS.black,
    fontSize: 25,
    letterSpacing: 5,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  containProfile: {
    alignItems: 'center',
  },
  name: {
    color: COLORS.black,
    fontSize: 25,
    letterSpacing: 2,
    marginTop: 10,
    fontWeight: '700',
  },
  status: {
    color: COLORS.black,
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: 1.5,
  },
  AddressContain: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  titleAdress: {
    color: COLORS.black,
    fontSize: 20,
    fontWeight: '300',
    letterSpacing: 2,
  },
  valueAdress: {
    color: COLORS.black,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  squareProfile: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
    padding: 5,
    elevation: 1,
  },

  squarePr2: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: COLORS.purple,
  },
  icontxt: {
    color: COLORS.black,
    fontSize: normalize(15),
    letterSpacing: 1,
    fontWeight: '700',
  },
  txtHeader: {
    color: COLORS.black,
    backgroundColor: COLORS.backgroundInput,
    fontSize: 5,
    textAlign: 'center',
    marginBottom: 25,
    textTransform: 'uppercase',
  },
  icon1: {
    height: 15,
    width: 15,
    padding: 13,
  },
  containIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 3,
    paddingBottom: 2,
    gap: 1,
    borderBottomColor: COLORS.purple,
    borderBottomWidth: 5,
  },
  BtnNext: {
    color: COLORS.white,
    backgroundColor: COLORS.black,
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 30,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  Phrase: {
    color: COLORS.black,
    textAlign: 'center',
    fontSize: 15,
    marginTop: 20,
  },
  room: {},
  door: {},
  stair: {},
});
