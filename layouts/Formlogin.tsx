/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { Input2 } from '../components/Inputs';
import { COLORS } from '../themes/colors';
import SQuery from '../utils/squery/SQueryClient';
import { addInfoUser } from '../wharehouse/store';
type formSchema = {
  email: string;
  password: string;
};

const validationSchema = yup
  .object({
    email: yup
      .string()
      .matches(
        new RegExp(
          /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i,
        ),
        'Veuillez saisir une adresse email valide',
      )
      .required('Veuillez saisir une adresse email'),
    password: yup
      .string()
      .min(2, 'Doit fait au moins deux caracteres')
      .required('Mot de passe est requis'),
  })
  .required();

const FormLogin = ({ navigation }: any) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm<formSchema>({
    resolver: yupResolver(validationSchema),
  });
  useEffect(() => {
    setValue((name = 'email'), (value = 'ret@gmail.com'));
    setValue((name = 'password'), (value = 'aa'));
    // setFocus((name = 'email'));
  }, []);
  const dispatch = useDispatch();
  const objUser: { [key: string]: string } = { name: '' };

  const addPropertyUser = (key: string, value: string) => {
    objUser[key] = value;
  };
  function sendServer(data: formSchema) {
    SQuery.emit('login:user', data, async (res: any) => {
      if (res.error) {
        return console.log(JSON.stringify(res));
      }
      let model = await SQuery.Model('account');
      let account = await model.newInstance({
        id: res.response.login.id,
      });

      try {
        if (account === null) {
          return;
        }
        console.log(await account.name, '************account******');

        let user = await account.newParentInstance();
        console.log(user, 'USER******');

        addPropertyUser('userId', user.$id);

        let messenger = await user.messenger;
        addPropertyUser('messengerId', await messenger.$id);
        console.log(await messenger.$id, '************listDiscussion******');
        addPropertyUser('accountId', account?.$id);
        addPropertyUser('name', await account.name);
        addPropertyUser('email', await account.email);
        addPropertyUser('password', await account.password);
        addPropertyUser('telephone', await account.telephone);
        let address = await account.address;
        addPropertyUser('location', await address.location);
        addPropertyUser('room', await address.room);
        addPropertyUser('door', await address.door);
        addPropertyUser('etage', await address.etage);
        let building = await address.building;

        addPropertyUser('buildingName', await building.name);
        addPropertyUser('city', await building.city);
        let profile = await account.profile;
        addPropertyUser('imgProfile', await profile.imgProfile);
        addPropertyUser('banner', await profile.banner);
        addPropertyUser('message', await profile.message);
        try {
          // await Keychain.setGenericPassword('USER', JSON.stringify(objUser));
          dispatch(addInfoUser(objUser));
          navigation?.navigate('Infoprofile');
        } catch (error) {
          console.log('Error storing cookie:', error);
        }
      } catch (error) {
        console.log('Error CONNEXION :', error);
      }
    });
  }

  return (
    <View style={styles.form}>
      <Input2 name="email" control={control} placeholder="EMAIL" icon={1} />
      <Input2
        name="password"
        control={control}
        icon={0}
        placeholder="PASSWORD"
      />

      <View
        style={{
          alignSelf: 'flex-end',
          borderRadius: 90,
          backgroundColor: 'yellow',
          overflow: 'hidden',
          marginTop: 50,
        }}>
        <LinearGradient
          colors={['#9922ff', '#9922ff84']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <View style={styles.btnConnexion}>
            <Text
              onPress={handleSubmit(sendServer)}
              style={[
                styles.textConnexion,
                !isValid && { backgroundColor: COLORS.bluefade },
              ]}>
              LOGIN
            </Text>
            <Image
              style={{ width: 20, height: 20, tintColor: 'white' }}
              source={require('../assets/images/right-arrow.png')}
            />
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    alignItems: 'center',
    padding: 10,
  },
  forgetpsswd: {
    textAlign: 'center',
    color: COLORS.blue,
    fontSize: 15,
    fontFamily: 'Kurale-Regular',
    // textDecorationLine: 'underline',
    fontWeight: '800',
  },

  btnConnexion: {
    // marginTop: 15,

    // alignSelf: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 90,
    paddingVertical: 10,
    flexDirection: 'row',
    gap: 10,
  },
  textConnexion: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  error: {
    fontSize: 11,
    color: 'white',
    borderStartColor: '#000',
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#aa061266',
  },
});

export default FormLogin;
