import { NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Activity: undefined;
  ItemActivity: undefined;
  Infoperso: undefined;
  Infoprofile: undefined;
  drawer: undefined;
  Formlogin: undefined;
  bottomTabs: undefined;
  Stack : undefined
};

export type PropsNavigation = {
  navigation: NavigationProp<RootStackParamList>;
};
