import {Navigation} from 'react-native-navigation';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MemoriesScreen from './src/screens/MemoriesScreen';
import ActivityHistoryScreen from './src/screens/ActivityHistoryScreen';
import ViewChallengeScreen from './src/screens/ViewChallengeScreen';
import ParkChallengeScreen from './src/screens/ParkChallengeScreen';
import LoginScreen from './src/screens/LoginScreen';
import supabase from './supabase/supabase';
import RegisterScreen from './src/screens/RegisterScreen';
import ActivitySummaryScreen from './src/screens/ActivitySummaryScreen';
import RedeemScreen from './src/screens/RedeemScreen';
import MemoriesImageScreen from './src/screens/MemoriesImageScreen';

Navigation.registerComponent('Home', () => HomeScreen);
Navigation.registerComponent('Profile', () => ProfileScreen);
Navigation.registerComponent('Memories', () => MemoriesScreen);
Navigation.registerComponent('MemoriesImage', () => MemoriesImageScreen);
Navigation.registerComponent('ActivityHistory', () => ActivityHistoryScreen);
Navigation.registerComponent('ViewChallenge', () => ViewChallengeScreen);
Navigation.registerComponent('ParkChallenge', () => ParkChallengeScreen);
Navigation.registerComponent('Login', () => LoginScreen);
Navigation.registerComponent('Register', () => RegisterScreen);
Navigation.registerComponent('ActivitySummary', () => ActivitySummaryScreen);
Navigation.registerComponent('Redeem', () => RedeemScreen);


const loginRoot = {
  root: {
    stack: {
      children: [
        {
          component: {
            name: 'Register',
            options: {
              topBar: {
                visible: false,
              },
            },
          },
        },
      ],
    },
  },
};

Navigation.events().registerAppLaunchedListener(async () => {
  Navigation.setRoot(loginRoot);
  const session = await supabase.auth.getSession();
  console.log('from the index, session: ', session);
  if (session.data.session) {
    Navigation.setRoot({
      root: {
        stack: {
          children: [
            {
              component: {
                name: 'Home',
                passProps: {
                  session: session.data.session,
                },
                options: {
                  topBar: {
                    visible: false,
                  },
                },
              },
            },
          ],
        },
      },
    });
  } else {
    console.log("there isn't a session! setting root as login");
    Navigation.setRoot(loginRoot);
  }
});
