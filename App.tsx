import React from 'react';
import {Text, View} from 'react-native';
import tw from 'twrnc';

function App(): JSX.Element {
  return (
    <View style={tw`flex h-full justify-center items-center`}>
      <Text style={tw` text-black dark:text-white`}>Hello</Text>
    </View>
  );
}

export default App;
