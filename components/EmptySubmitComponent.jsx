import { View, Text, Image } from 'react-native'
import React from 'react'
import { icons } from '../constants'

const EmptySubmitComponent = ({ icon, text}) => {
  return (
    <View className='items-center justify-center'>
      <View>
        <Image 
            source={icon}
            className='w-10 h-10'
            resizeMode='contain'
        />
      </View>
      <Text className='text-xs font-pregular mt-2'>{text}</Text>
    </View>
  )
}

export default EmptySubmitComponent