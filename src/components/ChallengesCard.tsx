import React from 'react';
import {Navigation} from 'react-native-navigation';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import tw from '../../tailwind';
import DiamondIcon from 'react-native-vector-icons/Ionicons';

interface ChallengesCardProps {
  homeComponentId: string;
  challengeId: number;
  isCompleted: boolean;
  diamondCount: number;
  title: string;
  description: string;
  imageName: any;
  type: string; // either shape or park
  park: number;
  startLat: number;
  startLong: number;
  shape: number;
  session: any;
  username: string;
  points: number;
  avatarUrl: string;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
}

const ChallengesCard = (props: ChallengesCardProps) => {
  const {
    homeComponentId,
    challengeId,
    isCompleted,
    diamondCount,
    title,
    description,
    imageName,
    type,
    park,
    shape,
    startLat,
    startLong,
    session,
    username,
    points,
    avatarUrl,
    setPoints,
  } = props;

  return (
    <TouchableOpacity
      disabled={isCompleted}
      onPress={() =>
        Navigation.push(homeComponentId, {
          component: {
            name: 'ViewChallenge',
            passProps: {
              homeComponentId: homeComponentId,
              challengeId: challengeId,
              challengeTitle: title,
              challengeImage: imageName,
              challengeDescription: description,
              challengeDiamondCount: diamondCount,
              challengeType: type,
              challengePark: park,
              challengeShape: shape,
              startLat: startLat,
              startLong: startLong,
              session: session,
              username: username,
              points: points,
              avatarUrl: avatarUrl,
              setPoints: setPoints,
            },
            options: {
              topBar: {
                title: {
                  text: title,
                },
              },
            },
          },
        })
      }
      style={tw`flex flex-col rounded-2xl w-full h-80 overflow-hidden ${
        isCompleted ? 'z-10 bg-white bg-opacity-40' : 'bg-white'
      }`}>
      <View style={tw`flex h-3/5 w-full relative`}>
        {imageName && (
          <Image
            source={{uri: imageName}}
            style={tw`absolute h-full w-full`}
            resizeMode="cover"
          />
        )}
        <View
          style={tw`absolute h-full w-full ${
            isCompleted ? 'bg-gray-400 bg-opacity-50' : ''
          }`}></View>
        <View
          style={tw`absolute top-2 right-2 flex flex-row gap-1 bg-white h-8 w-16 items-center justify-center rounded-md`}>
          <DiamondIcon
            name="diamond-outline"
            size={18}
            color={tw.color('primary-blue')}
          />
          <Text style={tw`font-bold text-sm`}>{diamondCount}</Text>
        </View>
      </View>
      <View style={tw`flex flex-1 flex-col items-start justify-center px-8`}>
        <Text
          style={tw`text-md font-bold ${isCompleted ? 'text-gray-500' : ''}`}>
          {title}
        </Text>
        <Text
          style={tw`text-sm pb-1  ${isCompleted ? 'text-gray-500' : ''}`}
          numberOfLines={2}
          ellipsizeMode="tail">
          {description}
        </Text>
        <View style={tw`h-5 bg-primary-blue px-3 mt-3`}>
          {isCompleted ? (
            <Text style={tw`text-sm text-white font-bold m-auto`}>DONE</Text>
          ) : (
            <Text style={tw`text-sm text-white font-bold m-auto`}>
              THIS WEEK'S CHALLENGE
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChallengesCard;
