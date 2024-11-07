import { View, Text, Image, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { TouchableOpacity } from 'react-native';
import { icons } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../context/GlobalProvider';
import CustomInput from '../components/CustomInput';
import { createTask, databases, ID } from '../lib/appwrite';
import { Picker } from '@react-native-picker/picker';
import { useTask } from '../context/TaskContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, differenceInDays } from 'date-fns';


const create = () => {
    const {user, setUser, setIsLoggedIn} = useGlobalContext();
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [groupCode, setGroupCode] = useState(null);
    const [taskType, setTaskType] = useState('solo');
    const { setTaskId } = useTask();
    const [tasks, setTasks] = useState([]);
    const [deadline, setDeadline] = useState(null);  // New state for deadline
    const [duration, setDuration] = useState(null);  // New state for duration in days
    const [showDatePicker, setShowDatePicker] = useState(false);
    
    const handleCreateTask = async () => {
        if (!title || !deadline) {
            Alert.alert('Please enter a title and select a deadline.');
            return;
          }

        try {
          const newTask = await createTask(title, taskType, deadline, duration); // Call the createTask function
          if (taskType === 'group') {
            setGroupCode(newTask.groupId); // Save the generated group code
            navigation.push('(task)', {
                title,
                taskType,
                groupId: newTask.groupId });
          }
          else if (taskType === 'solo') {
            setGroupCode(null); // No groupId for solo tasks, but you can reset or handle accordingly
            navigation.push('solo', { groupId: null, title }); // Navigate to overview without a groupId
          }
        } catch (error) {
          console.error('Failed to create task in create page:', error);
        }
      };
    
      const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
          setDeadline(selectedDate);
          const currentDate = new Date();
          const days = differenceInDays(selectedDate, currentDate);
          setDuration(days);
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
                <Text className="font-pmedium text-lg">Create Task</Text>
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
                    value={title}
                    placeholder=""
                    handleChangeText={setTitle}
                    otherStyles=""
                />

            <Text className="text-base text-gray-500 font-pmedium mt-2">Select Task Type</Text>

                    <View className="bg-zinc-50 border border-gray-300 rounded-md">
                        <Picker
                            selectedValue={taskType}
                            style={{ borderBlockColor: 'black'}}
                            onValueChange={(itemValue) => setTaskType(itemValue)}
                        >
                            <Picker.Item label="Solo" value="solo" />
                            <Picker.Item label="Group" value="group" />
                        </Picker>
                    </View>

                
            </View>
            
            <View>
                <Text className="text-base text-gray-500 font-pmedium mt-2">Deadline</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <TextInput
                            value={deadline ? format(deadline, 'yyyy-MM-dd') : ''}
                            placeholder="Select deadline date"
                            editable={false}
                            style={{
                            backgroundColor: '#f2f2f2',
                            borderColor: '#ccc',
                            borderWidth: 1,
                            borderRadius: 5,
                            padding: 10,
                            }}
                        />
                        </TouchableOpacity>

                        {showDatePicker && (
                        <DateTimePicker
                            value={new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                        )}

                        {duration !== null && (
                        <Text className="text-gray-600 mt-2">
                            Duration: {duration} day(s)
                        </Text>
                        )}
            </View>
        </View>

        

    </SafeAreaView>
  )
}

export default create

