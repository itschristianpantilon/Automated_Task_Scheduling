import { View, Text, FlatList, Image, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { images } from '../../constants'
import { useGlobalContext } from '../../context/GlobalProvider'
import TaskRow from '../../components/TaskRow';
import PopUpMenu from '../../components/PopUpMenu';



const Home = () => {
  
  const {user, setUser, setIsLoggedIn} = useGlobalContext();
  
  return (
    <SafeAreaView className="w-full h-full">

      <View className="flex-row w-full py-3 items-center justify-between px-4 border-b border-b-gray-300">
        <View className='flex-row items-center gap-2'>
            <View className="w-8 h-8 rounded-full">
              <Image 
                source={images.taskManagerLogo}
                className="w-full h-full rounded-full"
                resizeMode='contain'
              />            
            </View>
          <Text className="font-psemibold text-[17px] text-secondary-100">Automated Task Manager</Text>
        </View>

        <View className='flex-1 flex-row items-center justify-end'>
          <View className="rounded-full border-[2px] border-gray-400 border-spacing-5 w-10 h-10 items-center justify-center mr-4">
                <Image 
                  source={{ uri: user?.avatar }}
                  className="w-full h-full rounded-full bg-white"
                  resizeMode='contain'
                />
          </View>
          <PopUpMenu />
        </View>
      </View>

      {/* <View className="flex-row w-full py-3 items-center justify-between px-4 bg-secondary-100/80">
        <View className='flex-1 flex-row items-center gap-2'>
            <View className="w-8 h-8 rounded-full">
              <Image 
                source={images.taskManagerLogoInverted}
                className="w-full h-full rounded-full"
                resizeMode='contain'
              />            
            </View>
          <Text className="font-psemibold text-[17px] text-white">Automated Task Manager</Text>
        </View>
          <PopUpMenu />
      </View>

      <View className="px-4 border">
          <View className="justify-between items-start flex-row mb-5 py-4 mt-2">
            <View>
              <Text className="font-pmedium text-base">Welcome Back!</Text>
              <Text className="text-2xl font-psemibold">{user?.username}</Text>
              <Text className="font-pmedium text-xs">
                {user?.email}
              </Text>
            </View>

            <View className="mt-1.5 rounded-full border-white border-[2px] w-[60px] h-[60px] items-center justify-center">
              <Image 
                source={{ uri: user?.avatar }}
                className="w-full h-full rounded-full bg-white"
                resizeMode='contain'
              />
            </View>
          </View>
      </View> */}
      
      <FlatList 
        //data={}
        keyExtractor={(item) => item.$id}
        //renderItem={}
        ListHeaderComponent={() => (
          <ScrollView className='w-full px-2 mt-2 relative'>

          <Text className="text-xl font-psemibold py-1">Your Tasks</Text>

            <TaskRow />


          </ScrollView>
          
        )}
        ListFooterComponent={() => (
              <Image 
                source={images.taskManagerLogoInverted}
                className="w-9 h-10 absolute"
                resizeMode='contain'
              />
        )}
      />
    </SafeAreaView>
  )
}

export default Home