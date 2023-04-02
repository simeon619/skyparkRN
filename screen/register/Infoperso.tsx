import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Formperso } from '../../layouts/Formperso';
import { COLORS } from '../../themes/colors';
export const Infoperso = ({ navigation }: any) => {
  return (
    <View style={styles.containerFormPerso}>
      <View style={styles.containerForm}>
        <Formperso navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerFormPerso: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLogin,
    justifyContent: 'center',
  },

  containerSvg: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLogin,
  },
  containerForm: {
    width: '95%',
    flex: 40,
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundLogin,
  },
});
