import { View, Text, Modal, TouchableOpacity, Image, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { useGlobalContext } from '../context/GlobalProvider';
import * as ImagePicker from 'expo-image-picker';
import { account, config, databases, storage, updateProfile, updateUsername, updateUserProfile } from '../lib/appwrite';
import { ID } from 'react-native-appwrite';


const EditProfile = ({ visible, onRequestClose, onPress }) => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const [username, setUsername] = useState(user?.username);
  //const [newAvatar, setNewAvatar] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    image: user?.avatar
  });
  const [avatar, setAvatar] = useState(form.image);

  const handleImagePick = async (selectType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if(!result.canceled){
      if(selectType === 'image'){
        setForm({form, image: result.assets[0]})
      }
    }

    // if (result.assets && result.assets.length > 0) {
    //   setNewAvatar(result.assets[0].uri); // Updated approach based on newer API
    // }
 };
 //const userId = user?.$id;

  const submit = async () => {

    setUploading(true)
    try {


      const updatedUser = await updateProfile(form, user?.$id, username );
      setUser(updatedUser);
      
      Alert.alert('Success', 'Profile Updated Successfully')

    } catch (error) {
      console.error('Error Edit Profile', error.message)
    }
    setUploading(false)
  }

//   const submit = async () => {
//     setUploading(true);
//     try {
//         console.log("Submitting form:", form);

//         // Call updateProfile with the current form data
//         await updateProfile({...form});

//         Alert.alert("Success", "Profile Updated Successfully");
//     } catch (error) {
//         console.error("Error Edit Profile", error.message);
//         Alert.alert("Error", error.message);
//     } finally {
//         setUploading(false);
//     }
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
              <TouchableOpacity onPress={submit}>
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
                    <View className="w-24 h-24 rounded-full bg-white border-[4px] border-white relative">
                      <Image 
                        source={{ uri: form.image }}
                        className="w-full h-full rounded-full"
                        resizeMode='contain'
                        
                      />

                      <Image 
                        source={{ uri: form.image.uri }}
                        className="w-full h-full rounded-full absolute"
                        resizeMode='contain'
                        
                      />
                    </View>

                      <TouchableOpacity className='bg-gray-200 w-8 h-8 rounded-full border-[3px] border-white items-center justify-center absolute bottom-0 right-0' onPress={() => handleImagePick('image')}>
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