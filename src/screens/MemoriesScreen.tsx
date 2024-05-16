import {Navigation} from 'react-native-navigation';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import tw from '../../tailwind';
import {CalendarList} from 'react-native-calendars';
import {useEffect, useState} from 'react';
import LoadingScreen from '../components/Loading';
import {getImage, getMemories} from '../requests';

const MemoriesScreen = (props: {session: any; componentId: string}) => {
  const {session, componentId} = props;
  const [memories, setMemories] = useState<retrievedDataType[]>([]);
  const [dateAndImageSources, setDateAndImageSources] =
    useState<resultingDataType>();
  const [key, setKey] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [noMemories, setNoMemories] = useState(false);

  type resultingDataType = {
    [date: string]: ImageSourcePropType;
  };
  type retrievedDataType = {
    creationDate: string;
    imageFilePath: string;
  };

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const data = await getMemories(session);
      console.log('data', data);
      if (data && data.length > 0) {
        setMemories(data);
        const promises = data.map(async memory => {
          const source = await getImage(memory.imageFilePath);
          return {[memory.creationDate]: source};
        });
        const dateAndImageSourcesArray = await Promise.all(promises);
        const dateAndImageSources = Object.assign(
          {},
          ...dateAndImageSourcesArray,
        );
        setDateAndImageSources(dateAndImageSources);
      } else {
        setNoMemories(true);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (noMemories) {
    return (
      <View style={tw`flex h-full py-10 px-8 items-center bg-light-blue gap-6`}>
        <Text style={tw`text-white text-lg`}>Oh no, you have no memories!</Text>
        <Image
          source={require('../assets/images/picture.png')}
          style={tw`w-50 h-50`}
        />
        <Text style={tw`text-white text-lg`}>
          Return to home screen to start a challenge and capture memories!
        </Text>
        <TouchableOpacity
          onPress={() => {
            Navigation.pop(componentId);
          }}>
          <View style={tw`bg-white px-6 py-4 mx-auto`}>
            <Text style={tw`text-primary-blue text-md font-bold`}>
              Go to Home Screen
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      key={key}
      style={tw`flex h-full justify-center items-center bg-light-blue py-10`}>
      {dateAndImageSources && (
        <CalendarList
          style={tw`my-5`}
          theme={{
            calendarBackground: '#6BB2C6',
            textSectionTitleColor: 'white',
            monthTextColor: 'white',
            selectedDayBackgroundColor: '#ffffff',
            selectedDayTextColor: 'black',
          }}
          dayComponent={({date, state}) => {
            if (!date) {
              console.log('NO DATA AT ALL');
              return null;
            }
            const dateString = date.dateString;
            if (dateAndImageSources && dateString in dateAndImageSources) {
              const dateObject = new Date(dateString);
              const options: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              };
              const formattedDate = new Intl.DateTimeFormat(
                'en-US',
                options,
              ).format(dateObject);
              return (
                <TouchableOpacity
                  onPress={() => {
                    // open the image
                    Navigation.push(props.componentId, {
                      component: {
                        name: 'MemoriesImage',
                        passProps: {
                          imageSource: dateAndImageSources[dateString],
                          formattedDate: formattedDate,
                        },
                        options: {
                          topBar: {
                            backButton: {
                              popStackOnPress: true,
                            },
                          },
                        },
                      },
                    });
                  }}>
                  <View style={tw`rounded-lg flex items-center justify-center`}>
                    <ImageBackground
                      source={dateAndImageSources[dateString]}
                      style={tw`w-10 h-14 flex items-center justify-center`}>
                      <Text style={tw`text-center text-white text-md`}>
                        {date?.day}
                      </Text>
                    </ImageBackground>
                  </View>
                </TouchableOpacity>
              );
            } else {
              return (
                <View
                  style={tw`rounded-lg justify-center items-center w-10 h-14`}>
                  <Text style={tw`text-center text-white text-md`}>
                    {date?.day}
                  </Text>
                </View>
              );
            }
          }}
          futureScrollRange={0}
        />
      )}
    </View>
  );
};

export default MemoriesScreen;
