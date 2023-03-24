import { useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import { COLORS } from '../../themes/colors';
import { normalize } from '../../themes/metrics';
export const Infoprofile = (props: any) => {
  const { navigation } = props;
  const [uri, setUri] = useState('');
  const [visible, setVisible] = useState(false);
  const close = () => setVisible(false);
  const open = () => setVisible(true);

  const chooseImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        setUri(image.path);
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
      .then(image => {
        setUri(image.path);
      })
      .catch(e => {
        console.log(e);
      })
      .finally(close);
  };


  return (
    <ScrollView
      style={{
        backgroundColor: COLORS.backgroundLogin,
        margin: 10,
        flex: 1,
        alignContent: 'center',
        elevation: 10,
      }}>
      <View style={styles.containHeader}>
        <Text style={styles.TextHeader}>Profile</Text>
      </View>
      <View style={styles.containProfile}>
        <TouchableOpacity onPress={open}>
          <Image
            style={styles.avatar}
            source={uri ? { uri } : require('../../assets/images/user.png')}
          />
        </TouchableOpacity>
        <Text style={styles.name}>komlan simeon</Text>
        <Text style={styles.status}>Locataire</Text>
      </View>
      <View style={styles.AddressContain}>
        <Animated.View style={styles.room}>
          <Text style={styles.valueAdress}>28</Text>
          <Text style={styles.titleAdress}>Room</Text>
        </Animated.View>
        <View style={styles.door}>
          <Text style={styles.valueAdress}>78</Text>
          <Text style={styles.titleAdress}>Door</Text>
        </View>
        <Animated.View style={styles.stair}>
          <Text style={styles.valueAdress}>16</Text>
          <Text style={styles.titleAdress}>Stairs</Text>
        </Animated.View>
      </View>

      <Text style={styles.txtHeader}></Text>
      <View style={styles.squareProfile}>
        <View style={styles.containIcon}>
          <Image
            style={styles.icon1}
            source={require('../../assets/images/email.png')}
          />
          <Text style={styles.icontxt}>sijean619@gmail.com</Text>
        </View>
        <View style={styles.containIcon}>
          <Image
            style={styles.icon1}
            source={require('../../assets/images/telephone.png')}
          />
          <Text style={styles.icontxt}>+225 0565848273</Text>
        </View>
        <View style={styles.containIcon}>
          <Image
            style={styles.icon1}
            source={require('../../assets/images/home-address.png')}
          />
          <Text style={styles.icontxt}>Rostov-On-Don</Text>
        </View>
        <View style={styles.containIcon}>
          <Image
            style={styles.icon1}
            source={require('../../assets/images/building.png')}
          />
          <Text style={styles.icontxt}>Sublymus E45</Text>
        </View>
      </View>
      <Text
        style={styles.BtnNext}
        onPress={() => {
          console.log('oops');
          navigation.navigate('drawer');
        }}>
        NEXT
      </Text>
      <Text style={styles.Phrase}>
        Verifiez que les informations sont correctes
      </Text>
      <Modal
        isVisible={visible}
        onBackButtonPress={close}
        onBackdropPress={close}
        style={{ justifyContent: 'flex-end', margin: 0 }}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  avatar: {
    paddingTop: 20,
    height: 90,
    width: 90,
    borderRadius: 100,
    padding: 20,
  },
  optionSelect: {
    marginVertical: 10,
    height: 60,
    width: 60,
  },

  optionSelectText: {
    fontSize: 20,
    color: COLORS.black,
    fontWeight: '600',
  },
  options: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  option: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    textTransform : 'capitalize',
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
    textTransform: 'uppercase',
  },
  icon1: {
    height: 15,
    width: 10,
    padding: 13,
  },
  containIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 3,
    paddingBottom: 2,
    gap: 25,
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
