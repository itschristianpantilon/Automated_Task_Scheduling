import { View, Text, Image } from 'react-native'
import React from 'react'
import { useGlobalContext } from '../context/GlobalProvider'
import { TouchableOpacity } from 'react-native';
import { icons } from '../constants';
import moment from 'moment';

const SoloOverviewCard = ({ title, duration, deadline, status, onPress, disabled }) => {
    
  return (
    <View className={`border border-gray-400/70 flex-row items-center justify-between p-4 rounded-md mb-3 ${status === 'Finished' ? 'opacity-30' : ''}`}>
        <View className='flex-1'>
            <Text className='text-lg font-pmedium mb-1'>{title}</Text>
            <View className='flex-row items-center'>
              <Text className='text-xs mr-2'>Duration: {duration} day(s)</Text>
              <Text className='text-xs'>Deadline: {moment(deadline).format('YYYY-MM-DD')}</Text>
            </View>
        </View>

        <View className='items-center justify-center'>
          <TouchableOpacity 
            className='border border-gray-400 p-1 rounded-full' 
            onPress={onPress}
            disabled={disabled}
            >
              <Image 
                  source={icons.complete}
                  className='w-7 h-7'
                  resizeMode='contain'
              />
          </TouchableOpacity>
          <Text className='text-[10px] font-pregular mt-1'>{status}</Text>
        </View>
    </View>
  )
}

export default SoloOverviewCard