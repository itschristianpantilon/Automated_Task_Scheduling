import { View, Text, Image } from 'react-native'
import React from 'react'
import { useGlobalContext } from '../context/GlobalProvider'
import { TouchableOpacity } from 'react-native';
import { icons } from '../constants';

const SoloOverviewCard = () => {
    
  return (
    <View className='border border-gray-400/70 flex-row items-center justify-between p-4 rounded-md mb-3'>
        <View className='flex-1'>
            <Text className='text-lg font-pmedium mb-1'>Chapter 1 Introduction</Text>
            <View className='flex-row items-center'>
                {/* <Image 
                    source={{ uri: user?.avatar}}
                    className='w-6 h-6 rounded-full mr-2'
                    resizeMode='contain'
                />
                <Text className='text-sm font-pregular'>{user?.username}</Text> */}
            </View>
        </View>
        <TouchableOpacity className='border border-gray-400 p-1'>
            <Image 
                source={icons.complete}
                className='w-7 h-6'
                resizeMode='contain'
            />
        </TouchableOpacity>
    </View>
  )
}

export default SoloOverviewCard