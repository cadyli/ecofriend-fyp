import React, {useEffect, useState} from 'react';
import {Alert, Button, Image, TouchableOpacity, View} from 'react-native';
import supabase from '../../supabase/supabase';
import CameraIcon from 'react-native-vector-icons/Ionicons';
import tw from '../../tailwind';
import {launchImageLibrary} from 'react-native-image-picker';
import LoadingScreen from './Loading';

interface Props {
  size: number;
  url: string | null;
  onUpload: (filePath: string) => void;
}

function Avatar({url, size = 150, onUpload}: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = {height: size, width: size};

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const {data, error} = await supabase.storage
        .from('avatars')
        .download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message);
      }
    }
  }
  async function uploadAvatar() {
    try {
      setUploading(true);

      launchImageLibrary({mediaType: 'photo'}, async response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const {uri, fileName} = response.assets[0];
          const fileExt = fileName ? fileName.split('.').pop() : 'default';
          const mimeType = fileExt === 'png' ? 'image/png' : 'image/jpeg';

          const photo = {
            uri: uri,
            type: mimeType,
            name: fileName,
          };

          const formData = new FormData();
          formData.append('file', photo);

          const filePath = `${Math.random()}.${fileExt}`;

          const {error} = await supabase.storage
            .from('avatars')
            .upload(filePath, formData);

          if (error) {
            throw error;
          }

          onUpload(filePath);
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  if (uploading) {
    return <LoadingScreen />;
  }

  return (
    <View>
      {avatarUrl ? (
        <Image
          source={{uri: avatarUrl}}
          style={tw`w-35 h-35 bg-white rounded-full`}
          accessibilityLabel="Avatar"
        />
      ) : (
        <Image
          source={require('../assets/images/user.png')}
          style={tw`w-35 h-35 bg-white rounded-full`}
        />
      )}
      <TouchableOpacity
        style={tw` bg-white border rounded-full border-black absolute bottom-0 right-0 p-2`}
        onPress={uploadAvatar}
        disabled={uploading}>
        <CameraIcon name="camera" size={20} />
      </TouchableOpacity>
    </View>
  );
}

export default Avatar;
