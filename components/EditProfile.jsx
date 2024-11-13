import { View, Text, Modal, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { useGlobalContext } from '../context/GlobalProvider';
import * as ImagePicker from 'expo-image-picker';
import { config, databases, storage, updateUserProfile } from '../lib/appwrite';
import { ID } from 'react-native-appwrite';


const EditProfile = ({ visible, onRequestClose, onPress }) => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const [username, setUsername] = useState(user?.username);
  const [avatar, setAvatar] = useState(user?.avatar);
  const [newAvatar, setNewAvatar] = useState(null);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.assets && result.assets.length > 0) {
      setNewAvatar(result.assets[0].uri); // Updated approach based on newer API
    }
  };

  const handleEditProfile = async () => {
    try {
      const updatedUser = await updateUserProfile(user.$id, newAvatar, username);
      setUser(updatedUser);  // Update context with new user data
      onRequestClose();      // Close the modal on success
    } catch (error) {
      console.error("Failed to update profile edit page:", error);
    }
  };


  // const handleEditProfile = async () => {
  //   try {
  //     let avatarUrl = avatar;

  //     if (newAvatar) {
  //       // Upload new avatar to Appwrite storage
  //       const file = await storage.createFile(
  //         config.storageId,
  //         ID.unique(),
  //         newAvatar
  //       );

  //       avatarUrl = file.$id;  // Assuming you get the file ID for retrieval
  //     }

  //     // Update user info in the database
  //     const updatedUser = await databases.updateDocument(
  //       config.databaseId,
  //       config.userCollectionId,
  //       user.$id,  // User's document ID
  //       {
  //         username,
  //         avatar: avatarUrl
  //       }
  //     );

  //     setUser(updatedUser);
  //     onRequestClose();

  //   } catch (error) {
  //     console.error("Failed to update profile:", error);
  //   }
  // };

  // const handleEditProfile = async () => {
  //   try {
  //     let avatarUrl = avatar;

  //     if (newAvatar) {
  //       const response = await fetch(newAvatar);
  //       const blob = await response.blob();

  //       const fileId = ID.unique();
  //       console.log("Starting file upload with ID:", fileId);

  //       // Use FormData for Appwrite compatibility
  //       const formData = new FormData();
  //       formData.append("file", {
  //         uri: newAvatar,
  //         name: `avatar_${fileId}.jpg`,
  //         type: "image/jpeg",
  //       });

  //       const file = await storage.createFile(
  //         config.storageId,
  //         fileId,
  //         formData
  //       );

  //       avatarUrl = storage.getFileView(config.storageId, file.$id).href;
  //       console.log("File uploaded successfully:", avatarUrl);
  //     }

  //     const updatedUser = await databases.updateDocument(
  //       config.databaseId,
  //       config.userCollectionId,
  //       user.$id,
  //       { username, avatar: avatarUrl }
  //     );

  //     console.log("Profile updated successfully:", updatedUser);
  //     setUser(updatedUser);
  //     onRequestClose();

  //   } catch (error) {
  //     console.error("Failed to update profile:", error);
  //   }
  // };


  // const handleEditProfile = async () => {
  //   try {
  //     let avatarUrl = avatar;
  
  //     if (newAvatar) {
  //       console.log("New avatar selected, uploading...");
  
  //       // Fetch the image and create a Blob for upload
  //       const response = await fetch(newAvatar);
  //       const blob = await response.blob();
  
  //       const fileId = ID.unique();
  
  //       // Upload to Appwrite with permissions for the current user
  //       const file = await storage.createFile(
  //         config.storageId,
  //         fileId,
  //         blob,
  //         ["*"] // Change to specific user permissions as needed
  //       );
  
  //       // Attempt to retrieve the file's direct URL
  //       avatarUrl = storage.getFileView(config.storageId, file.$id).href;
  //       console.log("Avatar uploaded successfully with URL:", avatarUrl);
  
  //       // You can log and test avatarUrl here directly in the browser to confirm access
  //     }
  
  //     // Update user profile in the database
  //     const updatedUser = await databases.updateDocument(
  //       config.databaseId,
  //       config.userCollectionId,
  //       user.$id,
  //       { username, avatar: avatarUrl }
  //     );
  
  //     console.log("User profile updated with new avatar:", updatedUser.avatar);
  //     setUser(updatedUser); // Update the user state to trigger a re-render
  
  //     // Close modal on success
  //     onRequestClose();
  //   } catch (error) {
  //     console.error("Failed to update profile or avatar:", error);
  //   }
  // };
  

  return (
    <Modal
          transparent={true}
          animationType="slide"
          visible={visible}
          onRequestClose={onRequestClose}
        >
          <View className='w-full h-full flex-1 bg-white'>
            <View className="flex-row w-full items-center justify-between h-16 px-4">
              <TouchableOpacity onPress={onPress}>
                <Image 
                  source={icons.back}
                  className='w-7 h-7'
                  resizeMode='contain'
                />
              </TouchableOpacity>
              <Text className="font-psemibold text-xl">Edit Profile</Text>
              <TouchableOpacity onPress={handleEditProfile}>
                <Image 
                  source={icons.complete}
                  className='w-7 h-7'
                  resizeMode='contain'
                />
              </TouchableOpacity>
            </View>

            <View className="w-full h-52 flex items-center justify-center bg-secondary-100/80">

                <View className='flex-row items-center justify-center w-full relative'>

                  <View>
                    <View className="w-24 h-24 rounded-full bg-white border-[4px] border-white">
                      <Image 
                        source={{ uri: newAvatar || avatar }}
                        className="w-full h-full rounded-full"
                        resizeMode='contain'
                      />
                    </View>

                      <TouchableOpacity className='bg-gray-200 w-8 h-8 rounded-full border-[3px] border-white items-center justify-center absolute bottom-0 right-0' onPress={handleImagePick}>
                        <Image 
                          source={icons.plus}
                          className='w-full h-full rounded-full'
                          resizeMode='contain'
                        />
                      </TouchableOpacity>
                  </View>

                </View>

            </View>

              <View className="">

                <View className='flex-row items-center justify-between p-4 border-b border-b-gray-400'>
                  <Text className='text-sm font-pregular'>Name</Text>
                    <View className='flex-row items-center justify-center'>
                      <View className='px-1 items-center justify-center'>
                        <TextInput
                          value={username}
                          onChangeText={setUsername}
                          className="text-sm font-pregular"
                          placeholder="Enter new name"
                        />
                      </View>
                      <TouchableOpacity>
                        <Image 
                          source={icons.editPencil}
                          className='w-5 h-5'
                        />
                      </TouchableOpacity>
                    </View>
                </View>

                <View className='flex-row items-center justify-between p-4 border-b border-b-gray-400'>
                  <Text className='text-sm font-pregular'>Email</Text>
                    <View className='flex-row items-center justify-center'>
                      <Text className="text-sm font-pregular mr-2">{user?.email}</Text>
                    </View>
                </View>
              </View>
            
          </View>
    </Modal>
  )
}

export default EditProfile