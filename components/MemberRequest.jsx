import { View, Text, Image } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

const Button = ({ title, textStyles, otherStyle, onPress}) => (
    <TouchableOpacity onPress={onPress} className={`bg-secondary-100 p-2 rounded-sm ${otherStyle}`}>
        <Text className={`font-pmedium text-white text-xs ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
)

const MemberRequest = ({ request, onAccept, onReject }) => {


  return (
    <View className="flex-row py-2 items-center justify-between h-14">
            <View className="flex-row items-center flex-1">
                <View className="w-9 h-9 border-spacing-8 rounded-full">
                    <Image 
                        source={{ uri: request.avatar }}
                        className="w-full h-full rounded-full"
                        resizeMode='contain'
                    />
                </View>
                <Text className="text-base font-pregular ml-3 text-black-100">{request.username}</Text>
            </View>

            <View className="flex-row items-center justify-center">
                <Button 
                    title="Accept"
                    otherStyle="mr-1"
                    onPress={() => onAccept(request.$id, request.requesterId)}
                />

                <Button 
                    title="Decline"
                    otherStyle="bg-white border border-gray-400"
                    textStyles="text-black"
                    onPress={() => onReject(request.$id)}
                />
            </View>
        </View>
  )
}

export default MemberRequest