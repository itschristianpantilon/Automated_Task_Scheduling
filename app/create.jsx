import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { TouchableOpacity } from 'react-native';
import { icons } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../context/GlobalProvider';
import CustomInput from '../components/CustomInput';
import { SelectList } from 'react-native-dropdown-select-list';
import { databases, ID } from '../lib/appwrite';
import { router } from 'expo-router';


const create = ({ navigation }) => {
    const {user, setUser, setIsLoggedIn} = useGlobalContext();
    const navigate = useNavigation();
    const [title, setTitle] = useState('');
    const [selected, setSelected] = useState("");
    const [taskType, setTaskType] = useState('Solo Task');
    
  const data = [
      {key:'1', value:'Solo Task',},
      {key:'2', value:'Group Task',},
  ];

    const handleCreateTask = async () => {
        const taskId = ID.unique();
        if (taskType === 'Group Task') {
        const inviteCode = Math.random().toString(36).substring(7); // Generate invite code
        await databases.createDocument('tasks', taskId, { title, type: taskType, inviteCode });
        router.push('/overview', { taskId });
        } else {
        await databases.createDocument('tasks', taskId, { title, type: taskType });
        router.push('/overview', { taskId });
        }
    };

  return (
    <SafeAreaView>
        <View className="flex-row items-center justify-between border-b border-b-gray-400 p-3">
            <View className="flex-row gap-4 items-center justify-center">
                <TouchableOpacity className='p-1' onPress={() => { navigate.goBack()}}>
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
                handlePress={handleCreateTask}
                containerStyles="rounded px-6 min-h-[40px]"
                textStyles="text-sm text-white"
            />

        </View>

        <View className='p-5'>
            <View>

                <CustomInput 
                    title="Task Name"
                    value={() => {}}
                    placeholder=""
                    handleChangeText={() => {}}
                    otherStyles=""
                />

                <SelectList 
                    setSelected={(val) => setSelected(val)} 
                    selectedValue={taskType} 
                    onValueChange={(itemValue) => setTaskType(itemValue)}
                    data={data} 
                    save="value"
                    placeholder='Task Type'
                    boxStyles={{paddingHorizontal: 10, backgroundColor: "white", borderRadius: 5, marginVertical: 20}}
                    dropdownStyles={{backgroundColor: "white",}}
                    
                />

                {/* <Picker selectedValue={taskType} onValueChange={(itemValue) => setTaskType(itemValue)}>
                    <Picker.Item label="Solo Task" value="solo" />
                    <Picker.Item label="Group Task" value="group" />
                </Picker> */}

            </View>


        </View>
    </SafeAreaView>
  )
}

export default create