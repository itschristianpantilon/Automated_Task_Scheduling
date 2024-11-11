import { View, Text, Modal, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { icons } from '../constants'
import { useGlobalContext } from '../context/GlobalProvider';

const EditProfile = ({ visible, onRequestClose, onPress }) => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
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
              <TouchableOpacity>
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
                        source={{ uri: user?.avatar }}
                        className="w-full h-full rounded-full"
                        resizeMode='contain'
                      />
                    </View>

                      <TouchableOpacity className='bg-gray-200 w-8 h-8 rounded-full border-[3px] border-white items-center justify-center absolute bottom-0 right-0'>
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
                      <Text className="text-sm font-pregular mr-2">{user?.username}</Text>
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