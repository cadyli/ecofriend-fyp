import React, {useState} from 'react';
import {Navigation} from 'react-native-navigation';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Linking,
  ScrollView,
} from 'react-native';
import DirectionsIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from '../../tailwind';
import WeatherComponent from '../components/WeatherComponent';

function ViewChallengeScreen(props: {
  homeComponentId: string;
  challengeId: number;
  challengeTitle: string;
  challengeImage: string;
  challengeDescription: string;
  challengeDiamondCount: number;
  componentId: string;
  challengeType: string;
  challengePark: number;
  challengeShape: number;
  startLat: number;
  startLong: number;
  session: any;
  username: string;
  points: number;
  avatarUrl: string;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
}) {
  const {
    homeComponentId,
    challengeId,
    challengeTitle,
    challengeImage,
    challengeDescription,
    challengeDiamondCount,
    challengeType,
    challengePark,
    challengeShape,
    startLat,
    startLong,
    session,
    username,
    points,
    avatarUrl,
    setPoints,
  } = props;

  const [isTruncated, setIsTruncated] = useState(true);

  // Open google maps/apple maps to navigate to the park
  const openGps = (lat: number, lng: number) => {
    const scheme = Platform.select({
      ios: 'maps://0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${lat},${lng}`;
    const label = challengeTitle;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <View style={tw`flex h-full bg-light-blue`}>
      {/* Top component */}
      <View style={tw`relative`}>
        <Image
          source={{uri: challengeImage}}
          style={{width: '100%', height: 200}}
          resizeMode="cover"
        />
        <View
          style={tw`absolute -bottom-5 left-0 right-0 flex flex-row items-center justify-center gap-4`}>
          <TouchableOpacity
            style={tw`rounded-full bg-white p-2 `}
            onPress={() => openGps(startLat, startLong)}>
            <DirectionsIcon
              name="directions"
              size={26}
              color={tw.color('primary-blue')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={tw`mt-10`}>
        {/* Challenge title and description */}
        <View style={tw`mb-3 mx-7`}>
          <Text style={tw`font-bold text-white text-2xl `}>
            {challengeTitle}
          </Text>
          <Text
            style={tw`text-white text-md mt-2`}
            numberOfLines={isTruncated ? 3 : undefined}>
            {challengeDescription}
          </Text>
          {isTruncated && (
            <TouchableOpacity onPress={() => setIsTruncated(false)}>
              <Text style={tw`text-white text-md mt-2`}>...more</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Weather component */}
        <View>
          <View style={tw`mx-7 mt-3 w-25`}>
            <Text style={tw`text-white text-lg font-bold`}>Conditions</Text>
            <View style={tw`border-b border-white mt-2 w-full`}></View>
          </View>
          <WeatherComponent startLat={startLat} startLong={startLong} />
        </View>
        {/* Start challenge button */}
        <TouchableOpacity
          style={tw`m-10`}
          onPress={() =>
            Navigation.push(props.componentId, {
              component: {
                name: 'ParkChallenge',
                passProps: {
                  homeComponentId: homeComponentId,
                  challengePark: challengePark,
                  challengeShape: challengeShape,
                  challengeDiamondCount: challengeDiamondCount,
                  challengeId: challengeId,
                  challengeTitle: challengeTitle,
                  challengeType: challengeType,
                  session: session,
                  username: username,
                  usersPoints: points,
                  avatarUrl: avatarUrl,
                  setPoints: setPoints,
                },
                options: {
                  topBar: {
                    title: {
                      text: challengeTitle,
                    },
                    backButton: {
                      showTitle: false,
                    },
                  },
                },
              },
            })
          }>
          <View style={tw`bg-white px-6 py-4 mx-auto`}>
            <Text style={tw`text-primary-blue font-bold`}>
              START CHALLENGE{' '}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default ViewChallengeScreen;
