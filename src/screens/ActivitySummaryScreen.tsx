import React, {useEffect} from 'react';
import {Navigation} from 'react-native-navigation';
import {Text, TouchableOpacity, View} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import DiamondIcon from 'react-native-vector-icons/Ionicons';
import ParkIcon from 'react-native-vector-icons/MaterialIcons';
import TimeIcon from 'react-native-vector-icons/MaterialIcons';
import MedalIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {formatDistance, formatTime} from '../utils/helper';
import tw from '../../tailwind';

interface Coordinate {
  latitude: number;
  longitude: number;
}

const ActivitySummaryScreen = (props: {
  challengeTitle: string;
  homeComponentId: string;
  componentId: string;
  distanceTravelled: number;
  rewards: number;
  routeCoordinates: Coordinate[];
  completionDateTime: string;
  timeElapsed: number;
}) => {
  const {
    challengeTitle,
    homeComponentId,
    distanceTravelled,
    rewards,
    routeCoordinates,
    completionDateTime,
    timeElapsed,
  } = props;

  // Custom backbutton
  useEffect(() => {
    const navigationButtonPressedListener =
      Navigation.events().registerNavigationButtonPressedListener(
        ({buttonId}) => {
          if (buttonId === 'RNN.back') {
            Navigation.popTo(homeComponentId);
          }
        },
      );
    return () => {
      navigationButtonPressedListener.remove();
    };
  }, []);

  return (
    <View style={tw`h-full bg-light-blue py-5 flex flex-col gap-4`}>
      <View style={tw`flex flex-row gap-3 pl-5 pb-5`}>
        <ParkIcon name="park" size={30} color="white" />
        <View style={tw`flex flex-col gap-1`}>
          <Text style={tw`text-white font-bold text-md`}>{challengeTitle}</Text>
          <Text style={tw`text-white`}>{completionDateTime}</Text>
        </View>
      </View>
      {routeCoordinates && routeCoordinates.length > 0 && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={tw`h-1/2`}
          initialCamera={{
            center: {
              latitude: routeCoordinates[0].latitude,
              longitude: routeCoordinates[0].longitude,
            },
            pitch: 0,
            heading: 150,
            altitude: 1000,
            zoom: 16,
          }}
          zoomEnabled={true}>
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={2}
            strokeColor="red"
          />
        </MapView>
      )}
      <View
        style={tw`flex flex-row items-center px-5 bg-white p-5 -mt-4 gap-2 p-4 bg-opacity-90`}>
        <MedalIcon name="medal-outline" size={25} color={'black'} />
        <Text style={tw`text-black text-md font-bold text-center`}>
          Way to go!
        </Text>
      </View>
      <View style={tw`flex flex-row justify-between px-5 `}>
        <View style={tw`flex flex-row`}>
          <TimeIcon name="timelapse" size={25} color="white" />
          <View style={tw`flex flex-col`}>
            <Text style={tw`text-white text-center text-md font-bold`}>
              {formatTime(timeElapsed)}
            </Text>
            <Text style={tw`text-white text-center text-md`}>Time</Text>
          </View>
        </View>

        <View style={tw`flex flex-row`}>
          <TimeIcon name="directions-walk" size={25} color="white" />
          <View style={tw`flex flex-col`}>
            <Text style={tw`text-white text-center text-md font-bold`}>
              {formatDistance(distanceTravelled)}
            </Text>
            <Text style={tw`text-white text-center text-md`}>km</Text>
          </View>
        </View>

        <View style={tw`flex flex-row`}>
          <DiamondIcon name="diamond-outline" size={25} color="white" />
          <View style={tw`flex flex-col`}>
            <Text style={tw`text-white text-center text-md font-bold`}>
              {rewards}
            </Text>
            <Text style={tw`text-white text-center text-md`}>diamonds</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={tw`border border-white mx-5 py-2`}>
        <Text style={tw`text-white text-center text-md`}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

ActivitySummaryScreen.options = {
  topBar: {
    backButton: {
      title: 'Home Screen',
      showTitle: true,
    },
    leftButtons: [
      {
        id: 'backButton',
        icon: DiamondIcon,
      },
    ],
  },
  popGesture: false,
};

export default ActivitySummaryScreen;
