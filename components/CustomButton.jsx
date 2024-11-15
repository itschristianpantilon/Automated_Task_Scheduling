import { TouchableOpacity, Text, Image } from 'react-native'
import React from 'react'
import iconSet from '@expo/vector-icons/build/Fontisto'

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading, icon, iconStyle, status }) => {
  return (
    <TouchableOpacity 
    className={`bg-secondary rounded-xl min-h-[62px] flex-row justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50': ''} hover:opacity-50`}
    disabled={isLoading}
    onPress={handlePress}
    activeOpacity={0.7}
    >
      <Text className={`text-gray-800 font-psemibold text-lg ${textStyles}`}>{title}</Text>
      <Image 
        source={icon}
        className={iconStyle}
        resizeMode='contain'
      />
    </TouchableOpacity>
  )
}

export default CustomButton