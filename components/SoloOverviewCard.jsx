import { View, Text, Image } from 'react-native'
import React from 'react'
import { useGlobalContext } from '../context/GlobalProvider'
import { TouchableOpacity } from 'react-native';
import { icons } from '../constants';

const SoloOverviewCard = ({ title }) => {
    
  return (
    <View className='border border-gray-400/70 flex-row items-center justify-between p-4 rounded-md mb-3'>
        <View className='flex-1'>
            <Text className='text-lg font-pmedium mb-1'>{title}</Text>
            <View className='flex-row items-center'>
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