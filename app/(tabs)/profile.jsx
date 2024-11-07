import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { icons } from '../../constants/index';
import { Image } from 'react-native';
import { useGlobalContext } from '../../context/GlobalProvider'
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { signOut } from '../../lib/appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';

const profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace("/sign-in");
    Alert.alert('Logout', "Successfully logged out.")
  };

  const buttonStyle = "justify-between px-5 bg-white rounded-none mb-3 border-b border-b-secondary-100";

  return (
 
    <SafeAreaView className="h-full w-full px-4 bg-white">
      <View className="items-center justify-center h-16">
        <Text className="font-psemibold text-xl">Profile</Text>
      </View>
      <View className="w-full h-56 flex items-center justify-center">
        <View className="w-24 h-24 rounded-full mb-5">
            <Image 
              source={{ uri: user?.avatar }}
              className="w-full h-full rounded-full"
              resizeMode='contain'
            />
        </View>
        <View className="items-center justify-center">
          <Text className="font-pbold text-2xl">{user?.username}</Text>
          <Text className="font-pregular text-sm">{user?.email}</Text>
        </View>
      </View>

    <View className="mt-2">

      <CustomButton 
        title="Edit Profile"
        containerStyles={buttonStyle}
        icon={icons.edit}
        iconStyle="w-7 h-7"
        handlePress={() => {}}
      />
      <CustomButton 
        title="History"
        icon={icons.history}
        iconStyle="w-7 h-7"
        containerStyles={buttonStyle}
        handlePress={() => {}}
      />
      <CustomButton 
        title="Logout"
        icon={icons.logout}
        iconStyle="w-7 h-7"
        containerStyles={buttonStyle}
        handlePress={logout}
      />
    </View>

    </SafeAreaView>
  )
}

export default profile

