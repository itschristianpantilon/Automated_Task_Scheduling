import { Alert, Modal, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react';
import { icons } from '../../constants/index';
import { Image } from 'react-native';
import { useGlobalContext } from '../../context/GlobalProvider'
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { signOut } from '../../lib/appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import History from '../../components/History';
import EditProfile from '../../components/EditProfile';

const profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [isLogoutModal, setisLogoutModal] = useState(false);

  const openEdit = () => {
    setIsEditProfileVisible(true);
  }
  const cancelEdit = () => {
    setIsEditProfileVisible(false);
  }

  const closeLogout = () => {
    setisLogoutModal(false);
  }

  const openLogout = () => {
    setisLogoutModal(true);
  }
  const openHistory = () => {
    setIsHistoryVisible(true);
  }
  const closeHistory = () => {
    setIsHistoryVisible(false);
  }

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
        handlePress={openEdit}
      />
      <CustomButton 
        title="History"
        icon={icons.history}
        iconStyle="w-7 h-7"
        containerStyles={buttonStyle}
        handlePress={openHistory}
      />
      <CustomButton 
        title="Logout"
        icon={icons.logout}
        iconStyle="w-7 h-7"
        containerStyles={buttonStyle}
        handlePress={openLogout}
      />
    </View>

    {isLogoutModal && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isLogoutModal}
          onRequestClose={closeLogout}
        >
          <View className='w-full h-full flex-1 justify-center items-center bg-black/60'>
            

              <View className="min-w-[75%] p-5 bg-white rounded-lg min-h-[15vh] relative justify-center">
                <View>
                  <Text className='text-xl font-psemibold mb-5'>Logout</Text>

                  <Text className='text-base font-pregular text-gray-500'>Do you really want to logout?</Text>
                </View>

                <View className='flex-row items-center justify-end pt-5'>
                  <TouchableOpacity className="py-1 px-3 items-center justify-center" onPress={logout}>
                    <Text className='text-base font-psemibold text-gray-800'>Yes</Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="py-1 px-3 items-center justify-center ml-2" onPress={closeLogout}>
                    <Text className='text-base font-psemibold'>Cancel</Text>
                  </TouchableOpacity>
                </View>
               
              </View>

            
          </View>
        </Modal>
    )}

    {isHistoryVisible && (
      <History 
        visible={isHistoryVisible}
        onRequestClose={closeHistory}
        onPress={closeHistory}
      />
    )}

    {isEditProfileVisible && (
      <EditProfile
        visible={isEditProfileVisible}
        onRequestClose={cancelEdit}
        onPress={cancelEdit}
      />
    )}

    </SafeAreaView>
  )
}

export default profile

