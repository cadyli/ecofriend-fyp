import React, {useEffect, useState} from 'react';
import {Navigation} from 'react-native-navigation';
import LinearGradient from 'react-native-linear-gradient';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import tw from '../../tailwind';
import ProfileIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import DiamondIcon from 'react-native-vector-icons/Ionicons';
import ChallengesCard from '../components/ChallengesCard';
import {
  getChallenges,
  getCompletedChallenges,
  getFilePath,
  getImageUrls,
  getProfile,
} from '../requests';
import LoadingScreen from '../components/Loading';
import CountdownTimer from '../components/CountdownTimer';

interface HomeScreenProps {
  componentId: string;
  session: any;
}

const HomeScreen = (props: HomeScreenProps) => {
  const {session, componentId} = props;
  const [challenges, setChallenges] = useState<any[]>([]);
  const [imageUrls, setImageUrls] = useState<any[]>([]);
  const [username, setUsername] = useState<string>('');
  const [points, setPoints] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const fetchedChallenges = await getChallenges();
      if (fetchedChallenges) {
        setChallenges(fetchedChallenges);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImageUrls = async () => {
    try {
      setLoading(true);
      const fetchedImageUrls = await getImageUrls();
      if (fetchedImageUrls) {
        const bucketNames = fetchedImageUrls.map((imagePaths: any) => {
          if (imagePaths) {
            return imagePaths['imagePath'].split('/')[0];
          }
          return null;
        });
        const imageNames = fetchedImageUrls.map((imagePaths: any) => {
          if (imagePaths) {
            return imagePaths['imagePath'].split('/')[1];
          }
          return null;
        });
        const urls: string[] = [];
        for (let i = 0; i < bucketNames.length; i++) {
          const url: any = await getFilePath(bucketNames[i], imageNames[i]);
          if (url) {
            urls.push(url);
          }
        }
        setImageUrls(urls);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
    fetchImageUrls();
  }, []);

  const [completedChallenges, setCompletedChallenges] = useState<Set<any>>(
    new Set(),
  );

  const fetchCompletedChallenges = async () => {
    setLoading(true);
    const data = await getCompletedChallenges(session);
    if (data) {
      setCompletedChallenges(new Set(data.map(item => item.challengeID)));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompletedChallenges();
  }, [points]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profile = await getProfile(session);
      if (profile) {
        setUsername(profile.username);
        setPoints(profile.points);
        setAvatarUrl(profile.avatar_url);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username, points, avatarUrl]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <LinearGradient
      colors={[
        '#5DABC2',
        'rgba(188, 213, 220, 0.99)',
        'rgba(183, 211, 219, 0.00)',
      ]}
      style={tw`bg-primary-blue flex py-7 px-5 flex-1`}>
      <SafeAreaView style={tw`flex-1 my-0`}>
        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`pb-16`}
          showsVerticalScrollIndicator={false}>
          <View style={{height: Dimensions.get('window').height}}>
            {/* Top bar: Left icon is Profile Screen, Right Icon is Challenge History Screen */}
            <View style={tw`flex flex-row justify-between`}>
              <TouchableOpacity
                style={tw`items-center justify-center`}
                onPress={() =>
                  Navigation.push(props.componentId, {
                    component: {
                      name: 'Profile',
                      options: {
                        topBar: {
                          title: {
                            text: 'Profile',
                          },
                        },
                      },
                      passProps: {
                        session: session,
                      },
                    },
                  })
                }>
                <ProfileIcon name="account-circle" size={40} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`items-center justify-center `}
                onPress={() =>
                  Navigation.push(props.componentId, {
                    component: {
                      name: 'ActivityHistory',
                      options: {
                        topBar: {
                          title: {
                            text: 'Challenge History',
                          },
                        },
                      },
                      passProps: {
                        session: session,
                      },
                    },
                  })
                }>
                <View
                  style={tw`flex flex-row gap-1 bg-white h-8 px-2 items-center justify-center rounded-md`}>
                  <DiamondIcon
                    name="diamond-outline"
                    size={22}
                    color={tw.color('primary-blue')}
                  />
                  <Text style={tw`font-bold text-lg`}>{points}</Text>
                </View>
              </TouchableOpacity>
            </View>
            {/* My Memories Screen in the center with sun image below */}
            <View
              style={tw`flex flex-col items-center justify-center gap-3 h-160`}>
              <TouchableOpacity
                onPress={() =>
                  Navigation.push(props.componentId, {
                    component: {
                      name: 'Memories',
                      options: {
                        topBar: {
                          title: {
                            text: 'Memories',
                          },
                        },
                      },
                      passProps: {
                        session: session,
                      },
                    },
                  })
                }>
                <View style={tw`rounded-2xl bg-opacity-45 bg-black p-4`}>
                  <Text style={tw`text-white font-bold`}>
                    MY MEMORIES {'>'}{' '}
                  </Text>
                </View>
              </TouchableOpacity>
              <Image
                source={require('../assets/images/cuate.png')}
                style={tw`h-60 w-60`}
              />
            </View>
            {/* Scroll down button at the bottom of the screen */}
            <DiamondIcon
              name="chevron-down-sharp"
              size={30}
              color="white"
              style={tw`m-auto pb-10`}
            />
          </View>
          {/* Challenges section with countdown timer and challenges cards below */}
          <View
            style={tw`p-5 flex flex-col items-center justify-center gap-10`}>
            <View style={tw`rounded-2xl bg-opacity-45 bg-black py-3 px-2`}>
              <Text style={tw`text-white font-bold text-sm`}>
                CHALLENGES JUST FOR YOU{' '}
              </Text>
            </View>
            {completedChallenges.size === 3 ? (
              <View style={tw`flex gap-5`}>
                <Image
                  source={require('../assets/images/you-did-it.png')}
                  style={tw`-mt-5 w-40 h-40 mx-auto`}
                />
                <Text style={tw`-mb-4 text-md`}>
                  {' '}
                  You have completed all challenges!{' '}
                </Text>
              </View>
            ) : null}
            <CountdownTimer />
            {challenges.map((dataObject, index) => (
              <ChallengesCard
                homeComponentId={props.componentId}
                key={dataObject.id}
                challengeId={dataObject.id}
                isCompleted={completedChallenges.has(dataObject.id)}
                diamondCount={dataObject.diamondCount}
                title={dataObject.title}
                description={dataObject.description}
                imageName={imageUrls[index]}
                type={dataObject.type}
                park={dataObject.parkID}
                shape={dataObject.shapeID}
                startLat={dataObject.starting_lat}
                startLong={dataObject.starting_long}
                session={session}
                username={username}
                points={points}
                avatarUrl={avatarUrl}
                setPoints={setPoints}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;
