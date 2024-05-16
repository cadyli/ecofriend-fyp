import {FeatureCollection, GeoJsonProperties, Geometry} from 'geojson';
import Geolocation, {
  GeolocationResponse,
  GeolocationError,
} from '@react-native-community/geolocation';

interface Coordinate {
  latitude: number;
  longitude: number;
}

export const filterFeatures = (
  featureCollection: FeatureCollection,
  parkName: string,
): FeatureCollection<Geometry, GeoJsonProperties> => {
  const filteredFeatures = featureCollection.features.filter(feature => {
    return feature.properties?.Description?.includes(parkName);
  });

  return {
    type: 'FeatureCollection',
    features: filteredFeatures,
  };
};
const haversine = require('haversine');


export const calcDistance = (prevLatLng: any, newLatLng: any) => {
  return haversine(prevLatLng, newLatLng) || 0;
};

export const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

export const formatDistance = (distanceInMeters: number) => {
  if (distanceInMeters > 9999) {
    return Math.round(distanceInMeters).toString();
  } else {
    return distanceInMeters.toFixed(2);
  }
};

export const formatDateTime = (dateTimeStr: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  const date = new Date(dateTimeStr);
  return date.toLocaleDateString(undefined, options);
};

type Position = number[] | undefined;

export const getInitialPosition = (
  initialPosition: Position,
  setInitialPosition: React.Dispatch<React.SetStateAction<Position>>,
) => {
  Geolocation.getCurrentPosition(
    (position: GeolocationResponse) => {
      const {latitude, longitude} = position.coords;
      setInitialPosition([latitude, longitude]);
      console.log('initial position is:', initialPosition);
    },
    (error: GeolocationError) =>
      console.log('error getting initial position', error.message),
  );
};

export function extractCoordinates(filteredData: any) {
  return filteredData.features.flatMap((feature: any) =>
    feature.geometry.coordinates.flatMap((coord: any) =>
      Array.isArray(coord[0])
        ? coord.map(([longitude, latitude]: [number, number]) => ({
            latitude,
            longitude,
          }))
        : [
            {
              latitude: coord[1],
              longitude: coord[0],
            },
          ],
    ),
  );
}

export function capitalizeFirstLetterOfEachWord(sentence: string) {
  return sentence.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const formatTimeToDays = (seconds: number) => {
  const days = Math.floor(seconds / (60 * 60 * 24));
  seconds %= 60 * 60 * 24;
  const hours = Math.floor(seconds / (60 * 60));
  seconds %= 60 * 60;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  return { days, hours, minutes, seconds };
};

export function getSecondsUntilNextSunday() {
  const now = new Date();
  const nextSunday = new Date();

  nextSunday.setDate(now.getDate() + (7 - now.getDay() || 7));
  nextSunday.setHours(0, 0, 0, 0);

  const diffInSeconds = Math.floor((nextSunday.getTime() - now.getTime()) / 1000);
  return diffInSeconds;
}
