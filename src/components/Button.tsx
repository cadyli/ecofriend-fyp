import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import tw from '../../tailwind';

interface ButtonProps {
  onPressFunction: () => void;
  callToAction: string;
  additionalStyle?: object;
}

function CustomizedButton({
  additionalStyle,
  onPressFunction,
  callToAction,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        tw`w-4/5 mb-4 self-center bg-primary-blue p-4 rounded-full mb-12`,
        additionalStyle,
      ]}
      onPress={onPressFunction}>
      <Text style={tw`text-center text-white text-lg`}>{callToAction}</Text>
    </TouchableOpacity>
  );
}

export default CustomizedButton;
