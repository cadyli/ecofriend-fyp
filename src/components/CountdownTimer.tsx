import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {formatTimeToDays, getSecondsUntilNextSunday} from '../utils/helper';
import tw from '../../tailwind';

function CountdownTimer() {
  const [countdown, setCountdown] = useState(getSecondsUntilNextSunday());
  const {days, hours, minutes, seconds} = formatTimeToDays(countdown);
  useEffect(() => {
    const timerId = setInterval(() => {
      setCountdown(getSecondsUntilNextSunday());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);
  return (
    <View style={tw`flex flex-col gap-7`}>
      <View>
        <Text style={tw`-mb-8 text-md`}>
          Brand new challenges coming to you soon
        </Text>
      </View>
      <View style={tw`flex-row justify-between gap-2`}>
        <View style={tw`flex flex-col items-center justify-center gap-1`}>
          <View
            style={tw`bg-white h-20 w-16 rounded flex items-center justify-center`}>
            <Text style={tw`text-primary-blue font-bold text-3xl`}>{days}</Text>
          </View>
          <Text style={tw`text-lg`}>Days</Text>
        </View>
        <View style={tw`flex flex-col items-center gap-1`}>
          <View
            style={tw`bg-white h-20 w-16 rounded flex items-center justify-center`}>
            <Text style={tw`text-primary-blue font-bold text-3xl`}>
              {hours}
            </Text>
          </View>
          <Text style={tw`text-lg`}>Hours</Text>
        </View>
        <View style={tw`flex flex-col items-center gap-1`}>
          <View
            style={tw`bg-white h-20 w-16 rounded flex items-center justify-center`}>
            <Text style={tw`text-primary-blue font-bold text-3xl`}>
              {minutes}
            </Text>
          </View>
          <Text style={tw`text-lg`}>Minutes</Text>
        </View>
        <View style={tw`flex flex-col items-center gap-1`}>
          <View
            style={tw`bg-white h-20 w-16 rounded flex items-center justify-center`}>
            <Text style={tw`text-primary-blue font-bold text-3xl`}>
              {seconds}
            </Text>
          </View>
          <Text style={tw`text-lg`}>Seconds</Text>
        </View>
      </View>
    </View>
  );
}

export default CountdownTimer;
