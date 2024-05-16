import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {getProfile} from '../requests';
import tw from '../../tailwind';
import DiamondIcon from 'react-native-vector-icons/Ionicons';

function RedeemScreen(props: {session: any; componentId: string}) {
  const {session, componentId} = props;
  const [points, setPoints] = useState(0);
  const [numVouchers, setNumVouchers] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const redeemVoucher = () => {
    if (points < 1000) {
      return;
    }
    setNumVouchers(numVouchers + 1);
    setPoints(points - 1000);
  };

  const removeVoucher = () => {
    if (numVouchers === 0) {
      return;
    }
    setNumVouchers(numVouchers - 1);
    setPoints(points + 1000);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <View
      style={tw`flex justify-between items-center h-full bg-light-blue py-10`}>
      <View style={tw`mx-8`}>
        <View style={tw`flex flex-row mx-auto items-center gap-2 mb-4`}>
          <DiamondIcon
            name="diamond-outline"
            size={25}
            color={tw.color('white')}
          />
          <Text style={tw`font-bold text-2xl text-white`}>
            {points} diamonds
          </Text>
        </View>

        <View
          style={tw`flex flex-row justify-between items-center gap-20 bg-white rounded-md p-3`}>
          <View style={tw`flex flex-col gap-1`}>
            <Text style={tw`font-bold text-md`}>$5 eVoucher</Text>
            <Text style={tw`text-sm`}>1000 diamonds</Text>
          </View>
          <View style={tw`flex flex-row gap-3`}>
            <View style={tw`flex flex-row`}>
              <TouchableOpacity
                style={tw`bg-light-grey w-10 h-7 border-r-2 border-gray-400 justify-center items-center`}
                onPress={() => removeVoucher()}>
                <Text style={tw`text-center text-lg`}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-light-grey w-10 h-7 justify-center items-center`}
                onPress={() => redeemVoucher()}>
                <Text style={tw`text-center text-lg`}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={tw`font-bold text-lg`}>{numVouchers}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity>
        <View style={tw`bg-white px-6 py-4 mx-auto`}>
          <Text style={tw`text-primary-blue text-md font-bold`}>
            Get HPB eVouchers
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default RedeemScreen;
