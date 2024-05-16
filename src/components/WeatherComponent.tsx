import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {capitalizeFirstLetterOfEachWord} from '../utils/helper';
import tw from '../../tailwind';
import {getForecast} from '../requests';

type WeatherResponse = {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  rain: {
    '3h': number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
};

const WeatherComponent = (props: {startLat: number; startLong: number}) => {
  const {startLat, startLong} = props;
  const [weather, setWeather] = useState<WeatherResponse[]>();
  const [showWeather, setShowWeather] = useState(false);
  const [selectedDateWeather, setSelectedDateWeather] =
    useState<WeatherResponse>();
  let oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 4);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const fetchData = async () => {
    const data = await getForecast(startLat, startLong); // Call the getForecast function and wait for the promise to resolve
    setWeather(data);
  };

  useEffect(() => {
    if (!startLat || !startLong) {
      return;
    }
    setShowWeather(false);
    fetchData();
  }, []);

  const onDayPress = (dayOfTheMonth: number) => {
    setSelectedDay(dayOfTheMonth);
    setShowWeather(true);
  };

  const filterWeatherForDate = (day: number) => {
    const idx = (day - new Date().getDate()) * 8;
    if (weather && idx < weather.length) {
      setSelectedDateWeather(weather[idx]);
    }
  };

  useEffect(() => {
    if (showWeather && selectedDay) {
      filterWeatherForDate(selectedDay);
    }
  }, [showWeather, selectedDay]);

  const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysDatesDict: {[key: string]: number[]} = {
    Sun: [],
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
  };
  const today = new Date();
  let dates: number[] = [];

  // Get this week's Sunday
  let thisWeekSunday = new Date();
  thisWeekSunday.setDate(today.getDate() - today.getDay());

  for (let i = 0; i < 14; i++) {
    let date = new Date(thisWeekSunday);
    date.setDate(thisWeekSunday.getDate() + i);
    dates.push(date.getDate());
    let dayOfWeek = daysOfTheWeek[date.getDay()];
    daysDatesDict[dayOfWeek].push(date.getDate());
  }

  let nextFiveDays: number[] = [];
  let today2 = new Date();
  for (let i = 0; i < 5; i++) {
    let date = new Date();
    date.setDate(today2.getDate() + i);
    nextFiveDays.push(date.getDate());
  }

  return (
    <View style={tw`w-full`}>
      <View style={tw`w-6/7 flex flex-row justify-between mt-3 mx-6`}>
        {daysOfTheWeek.map((day, index) => (
          <View style={tw`flex flex-col gap-4 items-center `} key={day}>
            <Text style={tw`text-white font-bold text-md`}>{day}</Text>
            {daysDatesDict[day].map((date, index) =>
              nextFiveDays.includes(date) ? (
                <TouchableOpacity
                  onPress={() => {
                    onDayPress(date);
                  }}
                  key={`${day}-${date}`}>
                  {selectedDay === date ? (
                    <View
                      style={tw`w-8 h-8 rounded-full bg-white p-2 flex items-center justify-center`}>
                      <Text style={tw`text-light-blue font-bold text-md`}>
                        {date}
                      </Text>
                    </View>
                  ) : (
                    <View style={tw`p-2`}>
                      <Text style={tw`text-white font-bold text-md `}>
                        {date}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ) : (
                <View style={tw`p-2`} key={`${day}-${date}`}>
                  <Text style={tw`text-gray-500 text-md`}>{date}</Text>
                </View>
              ),
            )}
          </View>
        ))}
      </View>
      {showWeather && selectedDateWeather && (
        <View style={tw`mx-8 flex flex-row justify-between`}>
          <View style={tw`flex flex-col`}>
            <View style={tw`flex flex-row items-center -mb-3`}>
              <Text style={tw`text-2xl text-white font-bold`}>
                {selectedDateWeather.main.temp.toString().slice(0, 4)}°C
              </Text>
              <Image
                source={{uri: 'https://openweathermap.org/img/wn/10d.png'}}
                style={{height: 60, width: 60}}
                onError={error =>
                  console.log('Error loading image', error.nativeEvent.error)
                }
              />
            </View>
            <Text style={tw`text-white text-lg mb-2`}>
              {capitalizeFirstLetterOfEachWord(
                selectedDateWeather.weather[0].description,
              )}
            </Text>
            <View style={tw`flex flex-row gap-2`}>
              <Text style={tw`text-white font-bold`}>
                Feels like: {selectedDateWeather.main.feels_like}°C
              </Text>
              <Text style={tw`text-white font-bold`}>
                Humidity: {selectedDateWeather.main.humidity}%
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default WeatherComponent;
