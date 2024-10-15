import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { icons } from '../../constants/index';
import { Image } from 'react-native';
import { useGlobalContext } from '../../context/GlobalProvider'
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { signOut } from '../../lib/appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';

const profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace("/sign-in");
  };

  return (
  //   <View className="w-full flex justify-center items-center mt-6 mb-12 px-4 bg-black">
  //   <TouchableOpacity
  //     onPress={logout}
  //     className="flex w-full items-end mb-10"
  //   >
  //     <Image
  //       source={icons.logout}
  //       resizeMode="contain"
  //       className="w-6 h-6"
  //     />
  //   </TouchableOpacity>
  // </View>
    <SafeAreaView className="h-full w-full px-4">
      <View className="items-center justify-center h-16 border">
        <Text className="font-psemibold text-lg">Profile</Text>
      </View>
      <View className="w-full h-56 flex items-center justify-center gap-3">
        <View className="w-24 h-24 rounded-full">
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
      <TouchableOpacity className="w-full h-12 bg-slate-200 flex-row items-center justify-between px-4">
        <Text className="font-pmedium text-lg">Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity className="w-full h-12 bg-slate-200 flex-row items-center justify-between px-4" onPress={logout}>
        <Text className="font-pmedium text-lg">Sign Out</Text>
        <Image
          source={icons.logout}
          className='w-8 h-8'
          resizeMode='contain'
        />
      </TouchableOpacity>
    </View>

    </SafeAreaView>
  )
}

export default profile

