import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Platform, Text, TouchableOpacity, View} from 'react-native';
import {formatDistance, formatTime} from '../utils/helper';
import PauseIcon from 'react-native-vector-icons/Ionicons';
import StopIcon from 'react-native-vector-icons/Ionicons';
import DiamondIcon from 'react-native-vector-icons/Ionicons';
import CameraIcon from 'react-native-vector-icons/Ionicons';
import PlayIcon from 'react-native-vector-icons/Ionicons';
import tw from '../../tailwind';
import {
  launchCamera,
  ImagePickerResponse,
  CameraOptions,
} from 'react-native-image-picker';
import supabase from '../../supabase/supabase';
import {decode} from 'base64-arraybuffer';
import LoadingScreen from './Loading';

interface ChallengeStatusBarProps {
  timeElapsed: number;
  distanceTravelled: number;
  reward: number;
  onPressEndActivity: () => void;
  isPaused: boolean;
  onPressPauseFunction: () => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChallengeStatusBar({
  timeElapsed,
  distanceTravelled,
  reward,
  onPressEndActivity,
  isPaused,
  onPressPauseFunction,
  setLoading,
}: ChallengeStatusBarProps) {
  const [firstImageUploaded, setFirstImageUploaded] = useState(false);

  useEffect(() => {
    if (firstImageUploaded) {
      Alert.alert(
        'Way to go!',
        'Capture more photos and view them in the Memories tab after completing the challenge!',
      );
      setFirstImageUploaded(false);
    }
  }, [firstImageUploaded]);

  async function sendImageToDB(source: string) {
    // Upload the image to supabase bucket
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000000)}.jpg`;
    const {data, error} = await supabase.storage
      .from('memories')
      .upload(fileName, decode(source), {
        contentType: 'image/jpeg',
      });

    if (error) {
      console.error('Error uploading image: ', error);
    } else {
      console.log('Image uploaded successfully');
    }
    if (!firstImageUploaded) {
      setFirstImageUploaded(true);
      Alert.alert(
        'Way to go!',
        'Capture more photos and view them in the Memories tab after completing the challenge!',
      );
    }
    // Update the "memories" table
    // get today's date in the format "yyyy-mm-dd"
    const today = new Date().toISOString().split('T')[0];
    const {error: updateError} = await supabase.from('memories').insert([
      {
        creationDate: today,
        imageFilePath: `memories/${fileName}`,
      },
    ]);

    if (updateError) {
      console.error('Error updating table: ', updateError);
    }
  }

  return (
    <View
      style={tw`bg-light-blue w-full h-55 absolute bottom-0 self-center rounded-lg`}>
      <View style={tw`flex flex-row mx-auto gap-3 -mt-4`}>
        <TouchableOpacity
          style={tw`rounded-full bg-white h-14 w-14`}
          onPress={useCallback(() => {
            const options = {
              mediaType: 'photo',
              includeBase64: true,
              maxHeight: 2000,
              maxWidth: 2000,
            };
            setLoading(true);
            launchCamera(
              options as CameraOptions,
              (response: ImagePickerResponse) => {
                setLoading(false);
                if (response.didCancel) {
                  console.log('User cancelled image picker');
                } else if (response.errorCode) {
                  console.log('ImagePicker Error: ', response.errorCode);
                } else if (
                  response.assets &&
                  response.assets.length > 0 &&
                  response.assets[0].base64
                ) {
                  const source = response.assets[0].base64;
                  sendImageToDB(source);
                } else {
                  console.log('Response is: ', response);
                }
              },
            );
          }, [])}>
          <CameraIcon
            name="camera"
            size={32}
            style={tw`m-auto`}
            color={tw.color('primary-blue')}
          />
        </TouchableOpacity>
      </View>
      <View
        style={tw`relative bottom-4 bg-white bg-opacity-70 h-5/7 mx-auto rounded w-4/5`}>
        <View style={tw`flex flex-row justify-between mx-12 mt-7`}>
          {/* Time */}
          <View style={tw`flex flex-col items-center`}>
            <Text style={tw`font-bold text-xl`}>{formatTime(timeElapsed)}</Text>
            <Text style={tw`font-bold text-xs`}>Time</Text>
          </View>
          {/* Distance */}
          <View style={tw`flex flex-col items-center`}>
            <Text style={tw`font-bold text-xl`}>
              {formatDistance(distanceTravelled)}km
            </Text>
            <Text style={tw`font-bold text-xs`}>Distance</Text>
          </View>
          {/* Reward */}
          <View style={tw`flex flex-col items-center`}>
            <View style={tw`flex flex-row items-center gap-1`}>
              <DiamondIcon
                name="diamond-outline"
                size={18}
                color={tw.color('primary-blue')}
              />
              <Text style={tw`font-bold text-xl`}>{reward}</Text>
            </View>
            <Text style={tw`font-bold text-xs`}>Diamond</Text>
          </View>
        </View>
        <View
          style={tw`bottom-7 absolute flex flex-row w-4/5 gap-4 h-10 self-center justify-center items-center`}>
          <TouchableOpacity
            style={tw`w-1/2 bg-primary-blue h-full rounded-md`}
            onPress={() => {
              onPressPauseFunction();
            }}>
            {isPaused ? (
              <PlayIcon
                name="play"
                size={27}
                color="white"
                style={tw`m-auto`}
              />
            ) : (
              <PauseIcon
                name="pause"
                size={27}
                color="white"
                style={tw`m-auto`}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`w-1/2 bg-primary-orange h-full rounded-md`}
            onPress={() => {
              // Stop logic here
              Alert.alert(
                'Complete Challenge?',
                'Are you sure you want to end the challenge? ',
                Platform.OS === 'ios'
                  ? [
                      {
                        text: 'Yes',
                        onPress: () => {
                          console.log('Cancel pressed');
                          onPressEndActivity();
                        },
                        style: 'cancel',
                      },
                      {
                        text: 'No',
                        style: 'cancel',
                      },
                    ]
                  : [
                      {
                        text: 'End Quest',
                        onPress: () => {
                          console.log('Cancel pressed');
                          onPressEndActivity();
                        },
                        style: 'cancel',
                      },
                      {text: 'Resume'},
                    ],
              );
            }}>
            <StopIcon
              name="stop-sharp"
              size={23}
              color="white"
              style={tw`m-auto`}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default ChallengeStatusBar;
