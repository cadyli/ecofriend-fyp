import {View, Text, Image, TouchableOpacity} from 'react-native';
import tw from '../../tailwind';
import DiamondIcon from 'react-native-vector-icons/Ionicons';
import supabase from '../../supabase/supabase';
import {useEffect, useState} from 'react';
import {formatDateTime} from '../utils/helper';
import LoadingScreen from '../components/Loading';
import {Navigation} from 'react-native-navigation';
import {getProfile} from '../requests';

const ActivityHistoryScreen = (props: {session: any; componentId: string}) => {
  const {session, componentId} = props;
  const [completedChallenges, setCompletedChallenges] = useState<
    (targettype | null)[]
  >([]);

  interface targettype {
    completionDateTime: string;
    title: string;
    diamondCount: number;
  }

  const [loading, setLoading] = useState(true);

  const getCompletedChallenges = async () => {
    const {data, error} = await supabase
      .from('CompletedChallenges_v2')
      .select(
        `
      completionDateTime,
      challengePoints,
      Challenge:challengeID (
        title)`,
      )
      .eq('userID', session.user.id);

    if (error) {
      console.error('Fetch request failed:', error);
      return;
    }

    const tempCompletedChallenges = data;
    const flattenedData: (targettype | null)[] = tempCompletedChallenges.map(
      item => {
        if (item.Challenge) {
          return {
            completionDateTime: item.completionDateTime,
            title: (item.Challenge as unknown as {title: string}).title,
            diamondCount: item.challengePoints,
          };
        }
        return null;
      },
    );
    setCompletedChallenges(flattenedData);
  };

  const fetchData = async () => {
    setLoading(true);
    if (session) {
      await getCompletedChallenges();
    }
    setLoading(false);
  };

  const [points, setPoints] = useState(0);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profile = await getProfile(session);
      if (profile) {
        setPoints(profile.points);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchProfile();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={tw`flex h-full bg-light-blue py-10`}>
      {completedChallenges && completedChallenges.length > 0 ? (
        <View>
          {/* Total diamonds */}
          <View style={tw`flex flex-row mx-auto items-center`}>
            <Text style={tw`font-bold text-md`}>Total: {points}</Text>
            <DiamondIcon
              name="diamond-outline"
              size={15}
              color={tw.color('black')}
            />
          </View>
          <View
            style={tw`flex flex-col justify-between items-center h-full mt-3`}>
            {/* Completed challenges information */}
            <View style={tw`flex flex-col gap-4 w-7/8 items-center mx-auto`}>
              {completedChallenges.map(completedChallenge => {
                return (
                  <View
                    style={tw`flex flex-row justify-between bg-white p-4 w-full rounded-md`}
                    key={completedChallenge?.title}>
                    <View style={tw`flex flex-col`}>
                      <Text style={tw`font-bold text-sm`}>
                        {completedChallenge?.title}
                      </Text>
                      <Text style={tw`text-xs`}>
                        {completedChallenge &&
                          formatDateTime(
                            completedChallenge?.completionDateTime,
                          )}
                      </Text>
                    </View>
                    <View style={tw`flex flex-row items-center justify-center`}>
                      <Text style={tw`text-primary-blue font-bold text-md`}>
                        +{completedChallenge?.diamondCount}
                      </Text>
                      <DiamondIcon
                        name="diamond-outline"
                        size={15}
                        color={tw.color('primary-blue')}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
            {/* Redeem Button */}
            <TouchableOpacity
              style={tw`m-20`}
              onPress={() =>
                Navigation.push(props.componentId, {
                  component: {
                    name: 'Redeem',
                    passProps: {
                      session: session,
                    },
                  },
                })
              }>
              <View style={tw`bg-white px-10 py-4 mx-auto`}>
                <Text style={tw`text-primary-blue text-md font-bold`}>
                  Redeem
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : loading ? (
        <LoadingScreen />
      ) : (
        <View
          style={tw`flex h-full py-3 px-8 items-center bg-light-blue gap-6`}>
          <Text style={tw`text-white text-lg`}>
            Oh no, you have no completed challenges!
          </Text>
          <Image
            source={require('../assets/images/tired.png')}
            style={tw`w-50 h-50`}
          />
          <Text style={tw`text-white px-8 text-lg`}>
            Return to home screen to start exploring our challenges!
          </Text>
          <TouchableOpacity
            onPress={() => {
              Navigation.pop(componentId);
            }}>
            <View style={tw`bg-white px-6 py-4 mx-auto`}>
              <Text style={tw`text-primary-blue text-md font-bold`}>
                Go to Home Screen
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ActivityHistoryScreen;
