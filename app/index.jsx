import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View } from 'react-native';
import { Link, Redirect, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../constants'
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';

export default function App() {

    const { isLoading, isLoggedIn } = useGlobalContext();

    if (!isLoading && isLoggedIn) return <Redirect href='/Home' />

    return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View className="w-full justify-center items-center min-h-[100vh] px-4">

                    <Text className='text-2xl font-bold text-center'>Automated Task Scheduling</Text>

                    <Image
                        source={images.taskLogo}
                        className='max-w-[380px] w-full h-[300px]'
                        resizeMode='contain'
                    />

                    <View className='relative mt-5'>
                        <Text className='text-3xl font-bold text-center'>Unleash Limitless Potential with our <Text className='text-secondary'>System</Text></Text>

                    </View>

                    <Text className='text-sm font-pregular text-gray-500 mt-7 text-center'>Where efficiency meets precision: unlock the power of seamless automation and take control of your workflows with this task scheduling system.</Text>

                    <CustomButton
                        title="Get Started"
                        handlePress={() => router.push('/sign-in')}
                        containerStyles="w-full mt-7"
                    />
                </View>
            </ScrollView>

            <StatusBar backgroundColor='#161622' style='light' />
        </SafeAreaView>
    );
}

