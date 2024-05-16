import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import tw from '../../tailwind';

const LoadingScreen = () => {
  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default LoadingScreen;
