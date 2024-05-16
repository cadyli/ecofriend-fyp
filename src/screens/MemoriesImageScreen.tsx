import {Image, ImageSourcePropType, Text, View} from 'react-native';
import tw from '../../tailwind';

function MemoriesImageScreen(props: {
  componentId: string;
  imageSource: ImageSourcePropType;
  formattedDate: string;
}) {
  const {imageSource, formattedDate} = props;
  return (
    <View style={tw`flex bg-light-blue`}>
      <Text style={tw`text-white mx-auto mt-8 -mb-4 text-md`}>
        {formattedDate}
      </Text>
      <View style={tw`flex justify-center items-center`}>
        <Image style={tw`w-7/8 h-7/8 border rounded-xl`} source={imageSource} />
      </View>
    </View>
  );
}

export default MemoriesImageScreen;
