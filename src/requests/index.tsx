import { Alert, ImageSourcePropType } from "react-native";
import supabase from "../../supabase/supabase";
import { Navigation } from "react-native-navigation";
import { WEATHER_API_KEY } from "../../secrets";

// get username, points, avatar_url
export async function getProfile(session: any) {
  try {
    const {data, error, status} = await supabase
      .from('profiles')
      .select(`username, points, avatar_url`)
      .eq('id', session?.user.id)
      .single();
    return data
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
  }
}

// update username, points, avatar_url
export async function updateProfile({
    username,
    points,
    avatar_url,
    session
  }: {
    username: string;
    points: number;
    avatar_url: string;
    session: any;
  }) {
    try {
      const updates = {
        id: session?.user.id,
        username,
        points,
        avatar_url,
        updated_at: new Date(),
      };
      const {error} = await supabase.from('profiles').upsert(updates);
      if (error) {
        Alert.alert(error.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  }

  // get challenges
  export const getChallenges = async () => {
    let {data: Challenge, error} = await supabase.from('Challenge').select('*');
    return Challenge;
  };

  // get image urls
  export const getImageUrls = async () => {
    let {data: Challenge, error} = await supabase
      .from('Challenge')
      .select('imagePath');
    return Challenge;
  };

  export const getCompletedChallenges = async (
    session: any
  ) => {
    const {data, error} = await supabase
      .from('CompletedChallenges_v2')
      .select(`challengeID`,)
      .eq('userID', session.user.id);
    if (error) {
      Alert.alert(error.message);
      return;
    }
    return data
  }

  export const updateCompletedChallenges = async(
    completedChallenge: {
      userID: any;
      challengeID: number;
      completionDateTime: Date;
      challengePoints: number;
    }
  ) => {
    const {data, error} =  await supabase
        .from('CompletedChallenges_v2')
        .insert(completedChallenge);
      if (error) {
        Alert.alert(error.message);
        return;
      }
  }

  export const getParkDetails = async (challengeParkID: number) => {
    const {data, error}: any = await supabase
    .from('Parks_v3')
    .select('*')
    .eq('id', challengeParkID);
    if (error) {
      Alert.alert(error.message);
      return;
    }
    return data;
  }

  export const getShapeDetails = async (challengeShapeID: number) => {
    let {data, error}: any = await supabase
      .from('Shapes')
      .select('*')
      .eq('id', challengeShapeID);

    if (error) {
      console.error('Fetch request failed:', error);
      return;
    }

    return data;
  }

  export const getCameraDetails = async (cameraId: number) => {
    let {data, error}: any = await supabase
      .from('Cameras_Shapes')
      .select('*')
      .eq('id', cameraId);

    if (error) {
      console.error('Fetch request failed:', error);
      return;
    }
    return data;
  };

  export const getJsonFile = async (bucketName: string, fileName: string) => {
    const {data, error}: any = await supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    if (error) {
      console.error('Error fetching public URL:', error);
      return;
    }

    // Fetch the file content
    const response = await fetch(data.publicUrl);
    if (!response.ok) {
      console.error('Fetch request failed for getting json file from supabase:', response);
      return;
    }

    // Parse the JSON content by reading the Blob as text
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        if (typeof reader.result === 'string') {
          try {
            const jsonFile = JSON.parse(reader.result);
            resolve(jsonFile);
          } catch (error) {
            console.error('Error parsing JSON:', error);
            reject(error);
          }
        } else {
          console.error('Expected a string but got an ArrayBuffer');
          reject(new Error('Expected a string but got an ArrayBuffer'));
        }
      };
      reader.readAsText(blob);
    });
  };

  export async function getFilePath(bucketName: string, filePath: string) {
    const {data, error}: any = await supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    if (error) {
      console.error('Error fetching public URL:', error);
      return;
    }
    // Return the URL instead of setting it in the state
    return data.publicUrl;
  }

  export const getMemories = async (
    session: any
  ) => {
    let {data, error} = await supabase
      .from('memories')
      .select('creationDate, imageFilePath')
      .eq('userID', session.user.id);
    if (error) {
      console.error('Fetch request failed:', error);
      return;
    }
    return data
  };

  export const getImage = async (
    imageFilePath: string,
  ): Promise<ImageSourcePropType> => {
    const bucketName = imageFilePath.split('/')[0];
    const fileName = imageFilePath.split('/')[1];
    const {data, error}: any = await supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
    if (error) {
      console.error('Error fetching public URL:', error);
    }
    return {uri: data.publicUrl};
  };


  export async function signOut(
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    setLoading(true);
    const {error} = await supabase.auth.signOut();
    setLoading(false);
    if (error) console.log('Error signing out:', error.message);
    else {
      Navigation.setRoot({
        root: {
          component: {
            name: 'Login',
          },
        },
      });
    }
  }

  export const getForecast = async (lat: number, long: number) => {
    try {
        const apiKey = WEATHER_API_KEY; // Replace with your OpenWeatherMap API key
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
        const response = await fetch(apiUrl);
        const data = await response.json();
  
        // Check if the response contains an error message
        if (data.cod && data.cod !== '200') {
            throw new Error(data.message || 'Failed to fetch forecast data');
        }
  
        return data.list;
    } catch (error: any) {
        console.error('Error fetching forecast data:', error.message);
        Alert.alert('Error', 'Failed to fetch forecast data. Please try again.');
    }
  };
