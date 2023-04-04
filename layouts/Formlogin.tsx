import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { Input } from '../components/Inputs';
import { COLORS } from '../themes/colors';
// import { PropsNaivation } from '../utils/schemaType';
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
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i,
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
    formState: { errors, isValid },
  } = useForm<formSchema>({
    resolver: yupResolver(validationSchema),
  });
  const [dataLogin, setDataLogin] = useState<{
    modelPath: string;
    id: string;
  }>();
  const dispatch = useDispatch();
  const objUser: { [key: string]: string } = { name: 'er' };

  const addPropertyUser = (key: string, value: string) => {
    objUser[key] = value;
  };
  function sendServer(data: formSchema) {
    SQuery.emit('login:user', data, async (res: any) => {
      if (res.error) return console.log(JSON.stringify(res));

      const data = {
        modelPath: 'account',
        id: res.response.loginId,
      };
      let model = await SQuery.Model('account');
      let account = await model.newInstance({
        id: res.response.loginId,
      });

      try {
        if (account === null) {
          return;
        }
        let user = await account.newParentInstance();
        addPropertyUser('userId', user.$id);
        addPropertyUser('accountId', account?.$id);
        addPropertyUser('name', await account['name']);
        addPropertyUser('email', await account['email']);
        addPropertyUser('password', await account['password']);
        addPropertyUser('telephone', await account['telephone']);
        let address = await account['address'];
        addPropertyUser('location', await address['location']);
        addPropertyUser('room', await address['room']);
        addPropertyUser('door', await address['door']);
        addPropertyUser('etage', await address['etage']);
        let building = await user['building'];
        addPropertyUser('buildingName', await building['name']);
        addPropertyUser('city', await building['city']);
        let profile = await account['profile'];
        addPropertyUser('imgProfile', await profile['imgProfile']);
        addPropertyUser('banner', await profile['banner']);
        addPropertyUser('message', await profile['message']);
      } catch (error) {}
      dispatch(addInfoUser(objUser));
      navigation?.navigate('Infoprofile');
    });
  }

  return (
    <View style={styles.form}>
      <Input
        name="email"
        control={control}
        placeholder="entrez votre email"
        icon={1}
      />
      <Input
        name="password"
        control={control}
        icon={0}
        placeholder="saisissez votre mot de passe"
      />

      <View style={styles.btnConnexion}>
        <Text
          onPress={handleSubmit(sendServer)}
          style={[
            styles.textConnexion,
            !isValid && { backgroundColor: '#12347add' },
          ]}>
          LOG IN
        </Text>
      </View>

      <View style={styles.gotoregister}>
        <Text style={styles.simple}>you have don't any account ?</Text>
        <Text
          style={styles.link}
          onPress={() => {
            navigation.navigate('Infoperso');
          }}>
          click here
        </Text>
        <Text style={styles.forgetpsswd}>password forget ?</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    alignItems: 'center',
  },
  forgetpsswd: {
    textAlign: 'center',
    color: COLORS.blue,
    fontSize: 15,
    fontFamily: 'Kurale-Regular',
    // textDecorationLine: 'underline',
    fontWeight: '800',
  },
  gotoregister: {
    flexDirection: 'row',
    marginTop: 20,
    flexWrap: 'wrap',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  simple: {
    fontFamily: 'Kurale-Regular',
    fontSize: 18,
    color: '#777',
  },
  link: {
    color: 'rgb(12 74 110)',
    fontWeight: '900',
    // textDecorationLine: 'underline',
    fontFamily: 'Kurale-Regular',
    fontSize: 16,
  },

  btnConnexion: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  textConnexion: {
    backgroundColor: 'rgb(12 74 110)',
    fontSize: 27,
    borderRadius: 90,
    color: '#fff',
    width: '55%',

    paddingVertical: 5,
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
