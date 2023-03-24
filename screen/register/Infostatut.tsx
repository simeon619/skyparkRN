import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Formstatut} from '../../layouts/Formstatut';
import {COLORS} from '../../themes/colors';
import { verticalScale} from '../../themes/metrics'
export const Infoperso = ({navigation} :any) => {
  return (
    <View style={styles.containerFormPerso}>
      <Text style={styles.descrText}  >Veuillez renseignez les champs ci dessous</Text>
      <View style={styles.containerForm}>
        <Formstatut navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerFormPerso: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLogin,
  },
  descrText : {
    fontSize :  verticalScale(22),
    textAlign : 'center',
    color : COLORS.blue
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
    backgroundColor: COLORS.backgroundLogin,
  },
});
