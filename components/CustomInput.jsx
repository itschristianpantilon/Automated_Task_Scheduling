import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons, images } from '../constants'

const CustomInput = ({ title, value, placeholder, handleChangeText, otherStyles, textStyle, ...props }) => {


  return (
    <View className={` ${otherStyles}`}>
      <Text className={`text-sm text-gray-500 font-pmedium`}>{title}</Text>

      <View className='bg-zinc-50 w-full h-12 px-4 bg-gray rounded-md border border-gray-300 focus:border-secondary items-center flex-row'>
        <TextInput 
            className='flex-1 font-psemibold text-base w-full'
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#bdbdbd"
            onChangeText={handleChangeText}
        />
      </View>
    </View>
  )
}

export default CustomInput