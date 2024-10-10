import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons, images } from '../constants'

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {

    const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-gray-500 font-pmedium'>{title}</Text>

      <View className='bg-zinc-50 w-full h-16 px-4 bg-gray rounded-2xl border-2 border-gray-300 focus:border-secondary items-center flex-row'>
        <TextInput 
            className='flex-1 font-psemibold text-base w-full'
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#bdbdbd"
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
        />
        {title === "Password" && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image 
                    source={!showPassword ? icons.eyeHide: icons.eye}
                    className='w-6 h-7'
                    resizeMode='contain'
                />
            </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField