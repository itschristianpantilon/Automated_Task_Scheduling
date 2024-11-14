import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native';


const AssignMemberContainer = ({ username, userAvatar, icon, onPress, style, isCreator, isCurrentUserCreator }) => {

  return (
    <View className="relative flex-row py-2 items-center justify-between border-b border-b-gray-100/40">
        <View className="flex-row items-center flex-1">
            <View className="w-9 h-9 rounded-full">
                <Image 
                    source={{ uri: userAvatar }}
                    className="w-full h-full rounded-full"
                    resizeMode='contain'
                />
            </View>
            <Text className="text-base font-pregular ml-3">{username}</Text>
        </View>
        
        <View className={`items-center justify-center`}>
            <TouchableOpacity onPress={onPress} className={`${style}`}>
                <Image 
                    source={icon}
                    className='w-7 h-7'
                    resizeMode='contain'
                />
            </TouchableOpacity>
        </View>  

    </View>
  )
}

export default AssignMemberContainer