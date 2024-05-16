import React, {useEffect, useState, useRef} from 'react';
import {View, Alert, Image, TouchableOpacity} from 'react-native';
import MapView, {
  Geojson,
  PROVIDER_GOOGLE,
  Marker,
  Polyline,
} from 'react-native-maps';
import tw from '../../tailwind';
import {getDistance} from 'geolib';
import markerIcon from '../assets/images/diamond-2.png';
import startFlagIcon from '../assets/images/startflag.png';
import StartButton from '../components/Button';
import {Navigation} from 'react-native-navigation';
import ChallengeStatusBar from '../components/ChallengeStatusBar';
import {calcDistance, getInitialPosition} from '../utils/helper';
import Geolocation from '@react-native-community/geolocation';
import {
  getCameraDetails,
  getJsonFile,
  getParkDetails,
  getShapeDetails,
  updateCompletedChallenges,
  updateProfile,
} from '../requests';
import LoadingScreen from '../components/Loading';
import HelpIcon from 'react-native-vector-icons/Ionicons';
import CustomHelpModal from '../components/CustomHelpModal';

const ParkChallengeScreen = (props: {
  componentId: string;
  homeComponentId: string;
  challengePark: number;
  challengeShape: number;
  challengeDiamondCount: number;
  challengeId: number;
  challengeTitle: string;
  challengeType: string;
  session: any;
  username: string;
  usersPoints: number;
  avatarUrl: string;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
}) => {
  type Position = number[] | undefined;
  interface Coordinate {
    latitude: number;
    longitude: number;
  }
  interface Camera {
    center: {
      latitude: number;
      longitude: number;
    };
    pitch: number;
    heading: number;
    altitude: number;
    zoom: number;
  }

  const {
    homeComponentId,
    challengePark,
    challengeShape,
    challengeDiamondCount,
    challengeId,
    challengeTitle,
    challengeType,
    session,
    username,
    usersPoints,
    avatarUrl,
    setPoints,
  } = props;

  const [filteredData, setFilteredData] = useState<any>(null);
  const [initialPosition, setInitialPosition] = useState<Position>();
  const [isUserInPark, setIsUserInPark] = useState(false);
  const [initialCamera, setInitialCamera] = useState({} as Camera);
  const [parkInitialCoordinates, setParkInitialCoordinates] =
    useState<Coordinate>();
  // activity statuses
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [distanceTravelled, setDistanceTravelled] = useState(0);
  const [reward, setRewards] = useState(0);
  // spawnpoints
  const [spawnpoints, setSpawnpoints] = useState([] as number[][]);
  const [visitedSpawnPoints, setVisitedSpawnPoints] = useState(
    new Set() as Set<string>,
  );
  const visitedSpawnPointsRef = useRef(visitedSpawnPoints);
  // pop up
  const [showPopup, setShowPopup] = useState(false);
  // for plotting route
  const [routeCoordinates, setRouteCoordinates] = useState([] as Coordinate[]);
  const prevCoordinateRef = useRef<Coordinate>({latitude: 0, longitude: 0});
  const mapViewRef = useRef<MapView | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(isPaused);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    visitedSpawnPointsRef.current = visitedSpawnPoints;
  }, [visitedSpawnPoints]);

  // get park geojson data from supabase and initialise map with center latitude/longitude
  const fetchParkDetails = async () => {
    const data = await getParkDetails(challengePark);
    if (data) {
      setFilteredData(data[0]['FilteredData']);
      const spawnPointsString = data[0]['spawnPoints'];
      // Parse the string into an array
      const spawnPointsArray = JSON.parse(spawnPointsString);
      if (spawnPointsArray) {
        setSpawnpoints(spawnPointsArray);
      }
      const camera = {
        center: {
          latitude: data[0]['initialLatitude'],
          longitude: data[0]['initialLongitude'],
        },
        pitch: 0,
        heading: 150,
        altitude: 1000,
        zoom: data[0]['zoom'],
      };
      setInitialCamera(camera);
      const initialCoordinates = {
        latitude: data[0]['initialLatitude'],
        longitude: data[0]['initialLongitude'],
      };
      setParkInitialCoordinates(initialCoordinates);
    }
  };

  const fetchShapeDetails = async () => {
    const shape = await getShapeDetails(challengeShape);
    if (shape) {
      // initialise shape on map
      const bucketName = shape[0]['shapeFilePath'].split('/')[0];
      const fileName = shape[0]['shapeFilePath'].split('/')[1];
      const jsonFile = await getJsonFile(bucketName, fileName);
      setFilteredData(jsonFile);
      // initialise spawn points on map
      const spawnPointsString = shape[0]['spawn_points'];
      // Parse the string into an array
      let spawnPointsArray;
      try {
        spawnPointsArray = JSON.parse(spawnPointsString);
        if (spawnPointsArray) {
          setSpawnpoints(spawnPointsArray);
        }
      } catch (error) {
        console.error('Error parsing spawnPointsString:', error);
      }
      // initialise camera
      const cameraId = shape[0]['cameraId'];
      const cameraDetails = await getCameraDetails(cameraId);
      if (cameraDetails) {
        const camera = {
          center: {
            latitude: cameraDetails[0]['latitude'],
            longitude: cameraDetails[0]['longitude'],
          },
          pitch: cameraDetails[0]['pitch'],
          heading: cameraDetails[0]['heading'],
          altitude: cameraDetails[0]['altitude'],
          zoom: cameraDetails[0]['zoom'],
        };
        setInitialCamera(camera);
        const initialCoordinates = {
          latitude: cameraDetails[0]['latitude'],
          longitude: cameraDetails[0]['longitude'],
        };
        setParkInitialCoordinates(initialCoordinates);
      }
    }
  };

  useEffect(() => {
    if (challengeType === 'park') {
      (async () => {
        await fetchParkDetails();
      })();
    } else {
      (async () => {
        await fetchShapeDetails();
      })();
    }
    getInitialPosition(initialPosition, setInitialPosition);
  }, []);

  const addRewards = () => {
    setShowPopup(true);
    setRewards(reward => reward + 10);
  };

  function onPressStartFunction() {
    // Create a point for the user's location
    getInitialPosition(initialPosition, setInitialPosition);
    if (!filteredData) {
      Alert.alert('Unable to get park data');
      return;
    }
    if (initialPosition && parkInitialCoordinates) {
      const distance = getDistance(
        {latitude: initialPosition[0], longitude: initialPosition[1]},
        parkInitialCoordinates,
      );
      console.log('distance is: ', distance);
      const THRESHOLD = 2000;
      // if (distance < THRESHOLD){
      setIsUserInPark(true);
      plotRoute(prevCoordinateRef);
      // }
      // else{
      //   Alert.alert('You are not inside the park');
      // }
    }
  }

  function onPressPauseFunction() {
    // Pause the timer, location tracking, plotting of route, tracking of spawn points and distance travelled
    if (!isPaused) {
      setIsPaused(true);
    } else {
      setIsPaused(false);
    }
  }

  // Timer to track time elapsed
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUserInPark && !isPaused) {
      interval = setInterval(() => {
        setTimeElapsed(timeElapsed => timeElapsed + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isUserInPark, timeElapsed, isPaused]);

  // Diamond spot pop-up
  useEffect(() => {
    if (showPopup) {
      Alert.alert(
        'Congratulations',
        'You have reached a diamond spot! Keep walking to earn more!',
        [{text: 'OK', onPress: () => setShowPopup(false)}],
        {cancelable: false},
      );
    }
  }, [showPopup]);

  const OnPressEndFunction = async () => {
    try {
      setLoading(true);
      // send completed challenge to backend
      const completedChallenge = {
        userID: session?.user.id,
        challengeID: challengeId,
        completionDateTime: new Date(),
        challengePoints: reward + challengeDiamondCount,
      };
      updateCompletedChallenges(completedChallenge);
      // update profile to increase points
      setPoints(usersPoints + reward + challengeDiamondCount);
      updateProfile({
        username: username,
        points: usersPoints + reward + challengeDiamondCount,
        avatar_url: avatarUrl,
        session: session,
      });
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
    // Before resetting the state and popping the current screen, push the new screen
    Navigation.push(props.componentId, {
      component: {
        name: 'ActivitySummary',
        passProps: {
          challengeTitle: challengeTitle,
          distanceTravelled: distanceTravelled,
          rewards: reward + challengeDiamondCount,
          routeCoordinates: routeCoordinates,
          completionDateTime: new Date().toLocaleString(),
          homeComponentId: homeComponentId,
          timeElapsed: timeElapsed,
        },
        options: {
          topBar: {
            backButton: {
              popStackOnPress: false,
            },
          },
        },
      },
    });
    setDistanceTravelled(0);
    setRewards(0);
    setVisitedSpawnPoints(new Set());
    setRouteCoordinates([]);
  };

  const plotRoute = (prevCoordinateRef: React.MutableRefObject<Coordinate>) => {
    Geolocation.watchPosition(
      position => {
        if (isPausedRef.current) {
          return;
        }
        const {latitude, longitude} = position.coords;
        const newCoordinate = {latitude, longitude};
        const prevCoordinate = prevCoordinateRef.current;
        if (prevCoordinate['latitude'] !== 0) {
          const currentDistanceTravelled = calcDistance(
            prevCoordinate,
            newCoordinate,
          );
          setDistanceTravelled(
            prevDistanceTravelled =>
              prevDistanceTravelled + currentDistanceTravelled,
          );
          setRouteCoordinates(prevCoords => [...prevCoords, newCoordinate]);
        }
        prevCoordinateRef.current = newCoordinate;
        // Check if the new coordinate is within the buffer of any spawn point
        const buffer = 10;
        for (let point of spawnpoints) {
          const distance = getDistance(
            {latitude: point[0], longitude: point[1]},
            newCoordinate,
          );
          const pointKey = `${point[0]},${point[1]}`;
          if (
            distance <= buffer &&
            !visitedSpawnPointsRef.current.has(pointKey)
          ) {
            addRewards();
            setVisitedSpawnPoints(prevPoints => {
              const newVisitedSpawnPoints = new Set([...prevPoints, pointKey]);
              visitedSpawnPointsRef.current = newVisitedSpawnPoints;
              return newVisitedSpawnPoints;
            });
            break;
          }
        }
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 500,
        distanceFilter: 1,
      },
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View
      style={tw`${modalVisible ? 'opacity-50' : 'opacity-100'} h-full w-full`}>
      <TouchableOpacity
        style={tw`absolute top-3 right-3 z-10`}
        onPress={() => setModalVisible(true)}>
        <HelpIcon name="help-circle" size={30} />
      </TouchableOpacity>
      <CustomHelpModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      {Object.keys(initialCamera).length > 0 && filteredData && (
        <MapView
          ref={mapViewRef}
          provider={PROVIDER_GOOGLE}
          style={{flex: 1}}
          initialCamera={initialCamera}
          scrollEnabled={true}
          zoomEnabled={true}
          zoomTapEnabled={true}
          zoomControlEnabled={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={false}
          showsCompass={false}>
          <Geojson
            geojson={filteredData}
            strokeColor="blue"
            fillColor="green"
            strokeWidth={2}
          />
          {/* Show route coordinates */}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={2}
              strokeColor="red"
            />
          )}
          {/* Show starting coordinate */}
          {routeCoordinates.length > 0 && (
            <Marker coordinate={routeCoordinates[0]}>
              <Image source={startFlagIcon} style={{height: 40, width: 40}} />
            </Marker>
          )}
          {/* Show diamond points */}
          {spawnpoints.map((point, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: point[0],
                longitude: point[1],
              }}>
              <Image source={markerIcon} style={{height: 30, width: 30}} />
            </Marker>
          ))}
        </MapView>
      )}
      {/* Bottom bar: Either start button or challenge status bar */}
      {isUserInPark ? (
        <ChallengeStatusBar
          timeElapsed={timeElapsed}
          distanceTravelled={distanceTravelled}
          reward={reward}
          onPressEndActivity={OnPressEndFunction}
          isPaused={isPaused}
          onPressPauseFunction={onPressPauseFunction}
          setLoading={setLoading}
        />
      ) : (
        <StartButton
          additionalStyle={tw`absolute bottom-0`}
          onPressFunction={onPressStartFunction}
          callToAction="Start"
        />
      )}
    </View>
  );
};

export default ParkChallengeScreen;
