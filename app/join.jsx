import { View, Text, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { TouchableOpacity } from 'react-native';
import { icons } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../context/GlobalProvider';
import CustomInput from '../components/CustomInput';
import { getCurrentUser, requestJoinTask } from '../lib/appwrite';



const join = () => {
    const {user, setUser, setIsLoggedIn} = useGlobalContext();
    const navigation = useNavigation();
    const [groupCode, setGroupCode] = useState('');

    const handleJoinRequest = async () => {
        try {
            await requestJoinTask(groupCode);
            Alert.alert('Request Sent', 'Please wait for the task creator to accept your request.');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to send join request.');
        }
    };
    

  return (
    <SafeAreaView className='bg-white h-full'>
        <View className="flex-row items-center justify-between border-b border-b-gray-400 p-3">
            <View className="flex-row gap-4 items-center justify-center">
                <TouchableOpacity className='p-1' onPress={() => { navigation.goBack()}}>
                    <Image 
                        source={icons.close}
                        className="w-7 h-7"
                        resizeMode='contain'
                    />
                </TouchableOpacity>
                <Text className="font-pmedium text-lg">Join Group</Text>
            </View>
            <CustomButton 
                title="Join"
                handlePress={handleJoinRequest}
                containerStyles="rounded px-7 min-h-[40px]"
                textStyles="text-sm text-white"
            />
        </View>

        <View className='p-5'>
            <View>
                <Text className="text-base font-pregular mb-5">You're currently signed in as</Text>

                <View className='flex-row items-center pb-5 border-b border-b-gray-400'>
                    <View className="mt-1.5 rounded-full border-black border-[2px] w-[50px] h-[50px] items-center justify-center mr-4">
                        <Image 
                            source={{ uri: user?.avatar }}
                            className="w-full h-full rounded-full bg-white"
                            resizeMode='contain'
                        />
                    </View>
                    <View>
                        <Text className="text-lg">{user?.username}</Text>
                        <Text className="text-sm">{user?.email}</Text>
                    </View>
                </View>

                <Text className="text-sm font-pregular py-3">Ask your leader for the group code, then enter it here.</Text>

                <CustomInput 
                    value={groupCode}
                    placeholder="Group Code"
                    handleChangeText={setGroupCode}
                    otherStyles="pb-2"
                />

                <Text className="text-base font-pmedium py-2">To sign in with group code</Text>
                <Text className="text-sm font-pregular py-1">- Use an authorized account</Text>
                <Text className="text-sm font-pregular py-1">- Ask the leader to accept your join request</Text>
            </View>


        </View>
    </SafeAreaView>
  )
}

export default join