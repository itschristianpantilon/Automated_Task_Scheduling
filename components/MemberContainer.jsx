import { View, Text, Image } from 'react-native'
import React from 'react'
import { useGlobalContext } from '../context/GlobalProvider';
import { images } from '../constants';
import PopUpMenu from './PopUpMenu';

const MemberContainer = () => {

    const {user, setUser, setIsLoggedIn} = useGlobalContext();

  return (
    <View className="flex-row py-2 items-center justify-between">
        <View className="flex-row items-center">
            <View className="w-9 h-9 border-spacing-8 rounded-full">
                <Image 
                    source={{ uri: user?.avatar }}
                    className="w-full h-full rounded-full"
                    resizeMode='contain'
                />
            </View>
            <Text className="text-base font-pregular ml-3">{user?.username}</Text>
        </View>
        <PopUpMenu icon={images.threeDot} otherStyles="w-5 h-5" />
    </View>
  )
}

export default MemberContainer