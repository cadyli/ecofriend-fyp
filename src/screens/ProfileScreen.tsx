import {Navigation} from 'react-native-navigation';
import {View, Text, Alert, TouchableOpacity} from 'react-native';
import tw from '../../tailwind';
import DiamondIcon from 'react-native-vector-icons/Ionicons';
import RightArrow from 'react-native-vector-icons/SimpleLineIcons';
import EditIcon from 'react-native-vector-icons/MaterialIcons';
import {useEffect, useState} from 'react';
import Avatar from '../components/Avatar';
import LoadingScreen from '../components/Loading';
import {getProfile, signOut, updateProfile} from '../requests';

const ProfileScreen = (props: {session: any; componentId: string}) => {
  const {session, componentId} = props;
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [points, setPoints] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState('');

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
    <View style={tw`flex h-full bg-light-blue py-10 flex-col justify-between`}>
      <View
        style={tw`flex flex-col items-center justify-center w-3/4 mx-auto gap-4`}>
        <View style={tw`flex flex-col items-center justify-center gap-2 mb-3`}>
          <View style={tw`relative`}>
            <View>
              <Avatar
                size={200}
                url={avatarUrl}
                onUpload={(url: string) => {
                  (async () => {
                    try {
                      setLoading(true);
                      setAvatarUrl(url);
                      await updateProfile({
                        username,
                        points,
                        avatar_url: url,
                        session,
                      });
                    } catch (error) {
                      // Handle error
                    } finally {
                      setLoading(false);
                    }
                  })();
                }}
              />
            </View>
          </View>
          <View style={tw`flex flex-row`}>
            <Text style={tw`text-white font-bold text-xl`}>{username}</Text>
            <TouchableOpacity
              onPress={() => {
                Alert.prompt(
                  'Edit Username',
                  'Enter your new username:',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'OK',
                      onPress: (text?: string) => {
                        if (text) {
                          (async () => {
                            try {
                              setLoading(true);
                              setUsername(text);
                              await updateProfile({
                                username: text,
                                points,
                                avatar_url: avatarUrl,
                                session,
                              });
                            } catch (error) {
                              // Handle error
                            } finally {
                              setLoading(false);
                            }
                          })();
                        }
                      },
                    },
                  ],
                  'plain-text',
                  username,
                );
              }}>
              <EditIcon name="edit" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={tw`flex flex-row justify-between bg-white px-4 py-3 w-full`}
          onPress={() =>
            Navigation.push(componentId, {
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
          <View style={tw`flex flex-row gap-2 items-center`}>
            <DiamondIcon
              name="diamond-outline"
              size={25}
              color={tw.color('primary-blue')}
            />
            <View style={tw`flex flex-col`}>
              <Text style={tw`font-bold`}>{points}</Text>
              <Text style={tw`text-xs`}>Total points</Text>
            </View>
          </View>
          <RightArrow name="arrow-right" size={22} color="black" />
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => signOut(setLoading)}>
          <Text style={tw`text-center underline italic`}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;
