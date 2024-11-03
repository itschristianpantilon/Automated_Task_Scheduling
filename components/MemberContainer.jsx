import { View, Text, Image } from 'react-native'
import React from 'react'
import { useGlobalContext } from '../context/GlobalProvider';
import { icons, images } from '../constants';
import { TouchableOpacity } from 'react-native';


const MemberContainer = ({ username, userAvatar }) => {

    const {user, setUser, setIsLoggedIn} = useGlobalContext();

  return (
    <View className="relative flex-row py-2 items-center justify-between border-b border-b-gray-100/40">
        <View className="flex-row items-center">
            <View className="w-9 h-9 border-spacing-8 rounded-full">
                <Image 
                    source={{ uri: userAvatar }}
                    className="w-full h-full rounded-full"
                    resizeMode='contain'
                />
            </View>
            <Text className="text-base font-pregular ml-3">{username}</Text>
        </View>
        
        <TouchableOpacity>
            <Image 
                source={icons.remove}
                className='w-6 h-6 mr-2'
                resizeMode='contain'
            />
        </TouchableOpacity>

    </View>
  )
}

export default MemberContainer