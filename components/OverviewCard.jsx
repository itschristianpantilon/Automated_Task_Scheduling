import { View, Text, Image } from 'react-native'
import React from 'react'
import { useGlobalContext } from '../context/GlobalProvider'
import { TouchableOpacity } from 'react-native';
import { icons } from '../constants';

const OverviewCard = ({ title, username, userAvatar, status, onPress, onHide }) => {
    const { user } = useGlobalContext();
  return (
    <View className={`border border-gray-400/70 flex-row items-center justify-between p-4 rounded-md mb-3 w-full ${status === 'Accepted' ? 'opacity-80 border-green-500' : ''} ${status === 'Verifying' ? 'border-secondary-200' : ''} ${status === 'Rejected' ? 'border-red-600' : ''}`}>
        <View className='flex-1'>
            <Text className='text-base font-psemibold mb-1'>{title}</Text>
            <View className='flex-row items-center'>
                <Image 
                    source={userAvatar}
                    className='w-6 h-6 rounded-full mr-2'
                    resizeMode='contain'
                />
                <Text className='text-sm font-pregular'>{username}</Text>
            </View>
        </View>
        <View className='mr-4'>
            <Text className={`text-md font-pregular ${status === 'Accepted' ? 'text-green-500' : ''} ${status === 'Verifying' ? 'text-secondary-200' : ''} ${status === 'Rejected' ? 'text-red-600 italic' : ''}`}>{status}</Text>
        </View>
        <TouchableOpacity 
            className={`border border-gray-300 p-1 ${onHide} `} 
            onPress={onPress}
            >
            <Image 
                source={icons.threeDotEllipse}
                className='w-7 h-6'
                resizeMode='contain'
            />
        </TouchableOpacity>
    </View>
  )
}

export default OverviewCard