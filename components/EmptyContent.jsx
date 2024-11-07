import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'

const EmptyContent = ({ image, description, textContainer }) => {
  return (
    <View className='items-center justify-center'>
              <View className='p-3'>
                <View className='p-7 rounded-full bg-secondary-200/60'>
                  <Image 
                    source={image}
                    className='w-20 h-20'
                    resizeMode='contain'
                    
                  />
                </View>

              </View>
                <View className={`${textContainer} p-2 w-[70%] rounded-lg`}>
                  <Text className='font-pregular text-xs text-center'>{description}</Text>
                </View>
            </View>
  )
}

export default EmptyContent