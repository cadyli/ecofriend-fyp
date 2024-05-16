import React, {useRef, useState} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import tw from '../../tailwind';
import supabase from '../../supabase/supabase';
import EmailIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LockIcon from 'react-native-vector-icons/MaterialIcons';
import {Navigation} from 'react-native-navigation';
import EyeIcon from 'react-native-vector-icons/Ionicons';
import LoadingScreen from '../components/Loading';
import {SafeAreaView} from 'react-native';

function LoginScreen(props: {componentId: string}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  async function signInWithEmail() {
    setLoading(true);
    const {error} = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    else {
      const session = await supabase.auth.getSession();
      Navigation.setRoot({
        root: {
          stack: {
            children: [
              {
                component: {
                  name: 'Home',
                  passProps: {
                    session: session.data.session,
                  },
                  options: {
                    topBar: {
                      visible: false,
                    },
                  },
                },
              },
            ],
          },
        },
      });
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
            style={tw`w-3/4 flex flex-col items-center justify-between py-10 px-5 bg-white rounded-xl gap-5`}>
            <Text style={tw`font-bold`}>Login</Text>
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
              <Text style={tw`self-end mt-1 text-xs italic`}>
                Forgot password?
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => signInWithEmail()}
              style={tw`bg-primary-blue w-full p-2 items-center rounded`}
              disabled={loading}>
              <Text style={tw`text-white font-bold`}>Sign in</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() =>
              Navigation.push(props.componentId, {
                component: {
                  name: 'Register',
                  options: {
                    topBar: {
                      visible: false,
                    },
                  },
                },
              })
            }
            style={tw`mb-8`}>
            <Text style={tw`underline`}> No account? Register!</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
