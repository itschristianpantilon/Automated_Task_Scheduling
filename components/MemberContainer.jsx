import { View, Text, Image } from 'react-native'
import React from 'react'
import { useGlobalContext } from '../context/GlobalProvider';
import { icons, images } from '../constants';
import { TouchableOpacity } from 'react-native';


const MemberContainer = ({ username, userAvatar, icon, onPress, name, style }) => {

    const {user, setUser, setIsLoggedIn} = useGlobalContext();

  return (
    <View className="relative flex-row py-2 items-center justify-between border-b border-b-gray-100/40">
        <View className="flex-row items-center">
            <View className="w-9 h-9 rounded-full">
                <Image 
                    source={{ uri: userAvatar }}
                    className="w-full h-full rounded-full"
                    resizeMode='contain'
                />
            </View>
            <Text className="text-base font-pregular ml-3">{username}</Text>
        </View>
        
        <View className='h-auto'>
            <TouchableOpacity onPress={onPress} className={`${style}`}>
                <Image 
                    source={icon}
                    className='w-6 h-6'
                    resizeMode='contain'
                />
                <Text className='text-white text-xs font-psemibold'>{name}</Text>
            </TouchableOpacity>
        </View>

    </View>
  )
}

export default MemberContainer