import React, {useRef, useState} from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import supabase from '../../supabase/supabase';
import {Navigation} from 'react-native-navigation';
import EmailIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LockIcon from 'react-native-vector-icons/MaterialIcons';
import EyeIcon from 'react-native-vector-icons/Ionicons';
import tw from '../../tailwind';
import LoadingScreen from '../components/Loading';

function RegisterScreen(props: {componentId: string}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypedpassword, setRetypedPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRetypedPasswordVisible, setIsRetypedPasswordVisible] =
    useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  async function signUpWithEmail() {
    if (password !== retypedpassword) {
      Alert.alert('Passwords do not match!');
      return;
    }
    setLoading(true);
    const {
      data: {session},
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert('Account created! Please login');
    }
    setLoading(false);
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={tw`my-0 h-full`}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={tw`flex-grow flex flex-col items-center justify-between bg-light-blue pb-10 gap-3`}
          showsVerticalScrollIndicator={false}>
          <Image
            source={require('../assets/images/cuate.png')}
            style={tw`h-50 w-50 mt-30`}
          />
          <View
            style={tw`w-3/4 flex flex-col gap-2 items-center justify-between py-10 px-5 bg-white rounded-xl gap-5`}>
            <Text style={tw`font-bold mb-2`}>Register</Text>
            {/* Email Input Box */}
            <View
              style={tw`flex-row border border-gray-300 rounded p-2 items-center`}>
              <EmailIcon name="email" size={20} color="#C1C1C1" />
              <TextInput
                style={tw`flex-1 ml-2`}
                onChangeText={text => {
                  setEmail(text);
                  scrollViewRef.current?.scrollToEnd({animated: true});
                }}
                onFocus={() => {
                  scrollViewRef.current?.scrollToEnd({animated: true});
                }}
                value={email}
                placeholder="Email"
                placeholderTextColor="#C1C1C1"
                autoCapitalize={'none'}
                autoCorrect={false}
              />
            </View>
            {/* Password Input Box */}
            <View style={tw`w-full mb-1`}>
              <View
                style={tw`flex-row border border-gray-300 rounded p-2 items-center`}>
                <LockIcon name="lock-outline" size={20} color="#C1C1C1" />
                <TextInput
                  style={tw`flex-1 ml-2`}
                  onChangeText={text => {
                    setPassword(text);
                    scrollViewRef.current?.scrollToEnd({animated: true});
                  }}
                  value={password}
                  placeholder="Password"
                  placeholderTextColor="#C1C1C1"
                  autoCapitalize={'none'}
                  secureTextEntry={!isPasswordVisible}
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <EyeIcon
                    name={isPasswordVisible ? 'eye-off' : 'eye'}
                    size={20}
                    color="#C1C1C1"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* Confirm password input box */}
            <View style={tw`w-full mb-1`}>
              <View
                style={tw`flex-row border border-gray-300 rounded p-2 items-center`}>
                <LockIcon name="lock-outline" size={20} color="#C1C1C1" />
                <TextInput
                  style={tw`flex-1 ml-2`}
                  onChangeText={text => {
                    setRetypedPassword(text);
                    scrollViewRef.current?.scrollToEnd({animated: true});
                  }}
                  value={retypedpassword}
                  placeholder="Confirm password"
                  placeholderTextColor="#C1C1C1"
                  autoCapitalize={'none'}
                  secureTextEntry={!isRetypedPasswordVisible}
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() =>
                    setIsRetypedPasswordVisible(!isRetypedPasswordVisible)
                  }>
                  <EyeIcon
                    name={isRetypedPasswordVisible ? 'eye-off' : 'eye'}
                    size={20}
                    color="#C1C1C1"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => signUpWithEmail()}
              style={tw`bg-primary-blue w-full p-2 items-center rounded`}
              disabled={loading}>
              <Text style={tw`text-white font-bold`}>Submit</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() =>
              Navigation.push(props.componentId, {
                component: {
                  name: 'Login',
                  options: {
                    topBar: {
                      visible: false,
                    },
                  },
                  passProps: {},
                },
              })
            }
            style={tw`mb-8`}>
            <Text style={tw`underline`}> Already have an account? Login!</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default RegisterScreen;
