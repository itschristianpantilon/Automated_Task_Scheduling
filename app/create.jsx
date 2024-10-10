import { View, Text, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { TouchableOpacity } from 'react-native';
import { icons } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../context/GlobalProvider';
import CustomInput from '../components/CustomInput';
import { SelectList } from 'react-native-dropdown-select-list';
import { databases, ID } from '../lib/appwrite';

const create = () => {
    const {user, setUser, setIsLoggedIn} = useGlobalContext();
    const navigation = useNavigation();

    const [selected, setSelected] = React.useState("");
  
  const data = [
      {key:'1', value:'Solo Task'},
      {key:'2', value:'Group Task'},
  ]

  return (
    <SafeAreaView>
        <View className="flex-row items-center justify-between border-b border-b-gray-400 p-3">
            <View className="flex-row gap-4 items-center justify-center">
                <TouchableOpacity className='p-1' onPress={() => { navigation.goBack()}}>
                    <Image 
                        source={icons.close}
                        className="w-7 h-7"
                        resizeMode='contain'
                    />
                </TouchableOpacity>
                <Text className="font-pmedium text-lg">Create Group</Text>
            </View>
            <CustomButton 
                title="Create"
                handlePress={() => {}}
                containerStyles="rounded px-6 min-h-[40px]"
                textStyles="text-sm text-white"
            />

        </View>

        <View className='p-5'>
            <View>

                {/* <View className='flex-row items-center pb-5 border-b border-b-gray-400'>
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
                </View> */}

                {/* <Text className="text-sm font-pregular py-3">Ask your leader for the group code, then enter it here.</Text> */}

                <CustomInput 
                    title="Task Name"
                    value={() => {}}
                    placeholder=""
                    handleChangeText={() => {}}
                    otherStyles=""
                />

                <SelectList 
                    setSelected={(val) => setSelected(val)} 
                    data={data} 
                    save="value"
                    placeholder='Task Type'
                    boxStyles={{paddingHorizontal: 10, backgroundColor: "white", borderRadius: 5, marginVertical: 20}}
                    dropdownStyles={{backgroundColor: "white",}}
                    
                />

            </View>


        </View>
    </SafeAreaView>
  )
}

export default create