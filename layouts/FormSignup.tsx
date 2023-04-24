/* eslint-disable react-native/no-inline-styles */
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Image, StyleSheet, Text, View } from 'react-native';
// import { useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { Input2 } from '../components/Inputs';
import SQuery from '../utils/squery/SQueryClient';
import { addInfoUser } from '../wharehouse/store';
type formSchema = {
  name: string;
  firstName: string;
  email: string;
  tel: number;
  password: string;
  Password: string;
  // status: 'locataire' | 'proprio' | 'habitant' | 'resident';
  // age: string; // 17.07.1999
  // sexe: 'feminin' | 'masculin';
};

export const FormSignup = ({ navigation }: { navigation?: any }) => {
  const validationSchema = yup
    .object({
      code: yup
        .string()
        .min(3, 'minimum trois caractere')
        .max(10, 'trop de caractere')
        .required('Veuillez saisir votre code recu'),
      email: yup
        .string()
        .matches(
          new RegExp(
            /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i,
          ),
          'Veuillez saisir une adresse email valide',
        )
        .required('Veuillez saisir une adresse email'),
      Password: yup
        .string()
        .min(2, 'Doit fait au moins six caracteres')
        .required('Mot de passe est requis'),
      confirmPassword: yup
        .string()
        .required('Veuillez confirmez votre mot de passe')
        .oneOf([yup.ref('Password')], 'mot depasse ne corresponde pas'),
    })
    .required();

  const {
    control,
    handleSubmit,
    // formState: { isValid },
  } = useForm<formSchema>({
    resolver: yupResolver(validationSchema),
  });
  const dispatch = useDispatch();
  const objUser: { [key: string]: string } = { name: '' };
  const addPropertyUser = (key: string, value: string) => {
    objUser[key] = value;
  };

  function sendServer(data: formSchema) {
    let destData = { password: data.Password, email: data.email };
    console.log({ destData });

    SQuery.emit('login:user', destData, async (res: any) => {
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
      <Input2 name="code" control={control} icon={3} placeholder="CODE" />
      <Input2 name="email" control={control} placeholder="EMAIL" icon={1} />
      <Input2
        name="Password"
        control={control}
        icon={0}
        placeholder="PASSWORD"
      />
      <Input2
        name="confirmPassword"
        control={control}
        icon={0}
        placeholder="CONFIRM PASSWORD"
      />
      <View
        style={{
          alignSelf: 'flex-end',
          borderRadius: 90,
          backgroundColor: 'yellow',
          overflow: 'hidden',
          marginTop: 10,
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
                // !isValid && { backgroundColor: COLORS.bluefade },
              ]}>
              SIGN UP
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
  descrText: {
    fontSize: 30,
    textAlign: 'left',
    fontFamily: 'Roboto-Regular',
    color: 'black',
  },
  btnConnexion: {
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
});
