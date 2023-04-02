import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { Input } from '../components/Inputs';
import { COLORS } from '../themes/colors';
import { addInfoUser } from '../wharehouse/store';

type formSchema = {
  name: string;
  firstName: string;
  email: string;
  tel: number;
  password: string;
  status: 'locataire' | 'proprio' | 'habitant' | 'resident';
  // age: string; // 17.07.1999
  // sexe: 'feminin' | 'masculin';
};

export const Formperso = ({ navigation }: { navigation?: any }) => {
  const validationSchema = yup
    .object({
      code: yup
        .string()
        .min(3, 'minimum trois caractere')
        .max(10, 'trop de caractere')
        .required('Veuillez saisir votre code recu'),
      password: yup
        .string()
        .min(2, 'Doit fait au moins six caracteres')
        .required('Mot de passe est requis'),
      confirmPassword: yup
        .string()
        .required('Veuillez confirme votre mot de passe')
        .oneOf([yup.ref('password')], 'mot depasse ne corespondes pas'),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<formSchema>({
    resolver: yupResolver(validationSchema),
  });

  const dispatch = useDispatch();
  function submit(data: formSchema) {
    dispatch(addInfoUser(data));
    navigation.navigate('Infoprofile');
  }

  return (
    <View style={styles.form}>
      <Text style={styles.descrText}>
        Veuillez renseignez les champs ci dessous
      </Text>
      <Input
        name="code"
        control={control}
        icon={0}
        placeholder="entrez le code d'inscription"
      />
      <Input
        name="password"
        control={control}
        icon={0}
        placeholder="entrez votre mot de passe"
      />
      <Input
        name="confirmPassword"
        control={control}
        icon={0}
        placeholder="confirmez votre mot de passe"
      />
      <View style={styles.btnNext}>
        <Text
          onPress={handleSubmit(submit)}
          style={[styles.textNext, !isValid && { backgroundColor: '#123' }]}>
          Suivant
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    // flex: 1,
    padding: 5,
  },

  btnNext: {
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
  },
  descrText: {
    fontSize: 22,
    textAlign: 'center',
    color: COLORS.blue,
  },
  btnConnexion: {
    marginTop: 10,
  },
  textNext: {
    backgroundColor: COLORS.blue,
    marginVertical: 12,
    fontSize: 30,
    borderRadius: 90,
    color: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 5,
    textAlign: 'center',
  },
});
