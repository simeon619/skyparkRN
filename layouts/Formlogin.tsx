import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import * as yup from 'yup';
import { Input } from '../components/Inputs';
//import SQuery from '../utils/squery/SQueryClient';

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

const FormLogin = ({ navigation }: { navigation?: any }) => {
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
  // function sendServer(data: formSchema) {
  //   SQuery.emitLater('login:user', data, async (res: any) => {
  //     if (res.error) return console.log(JSON.stringify(res));

  //     const data = {
  //       modelPath: 'account',
  //       id: res.response.loginId,
  //     };
  //     let model = await SQuery.Model('account');
  //     let account = await model.instance({
  //       id: res.response.loginId,
  //     });
  //     let name = await account['name']
  //     // console.log(account.when());
      
  //     account.when('refresh:name' , (name :string)=>{
  //       console.log(name);
  //     })
  //     console.log(name);
  //     account['name'] = 'GREGROIRE';
  //   });
  // }

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
          // onPress={handleSubmit(sendServer)}
          style={[
            styles.textConnexion,
            !isValid && { backgroundColor: '#12347add' },
          ]}>
          LOG IN
        </Text>
      </View>

      <View style={styles.gotoregister}>
        <Text style={styles.simple}>vous n'avez pas de compte ?</Text>
        <Text
          style={styles.link}
          onPress={() => {
            navigation.navigate('Infoperso');
          }}>
          click here
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    alignItems: 'center',
  },

  gotoregister: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
    alignItems: 'center',
  },

  simple: {
    fontFamily: 'Kurale-Regular',
    fontSize: 18,
  },
  link: {
    color: 'rgb(12 74 110)',
    fontWeight: '900',
    textDecorationLine: 'underline',
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
