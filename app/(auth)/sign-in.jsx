import { StyleSheet, Text, View, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'

import { getCurrentUser, signIn } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignIn = () => {
  const {setUser, setIsLoggedIn} = useGlobalContext();
  const [form, setForm] = useState({
    email:'',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false);


  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
    }

    setIsSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);

      Alert.alert("Success", "User signed in successfully");
      router.replace("/Home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[90vh] my-6 px-4'>

          <View className='w-full flex-row items-end gap-2'>
            <Image 
              source={images.taskManagerLogo}
              className='w-[60px] h-[60px]'
              resizeMode='contain'
            />
            <Text className="text-2xl text-semibold mt-10 font-psemibold">Automated Task Manager</Text>
          </View>


          <Text className='text-2xl text-semibold mt-10 font-psemibold text-secondary'>Log in</Text>

          <FormField 
            title='Email'
            value={form.email}
            handleChangeText={(e) => setForm({...form, email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField 
            title='Password'
            value={form.password}
            handleChangeText={(e) => setForm({...form, password: e})}
            otherStyles="mt-7"
          />  

          <CustomButton 
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className='justify-center pt-5 flex-row gap-2'>
              <Text className='text-lg font-pregular'>Don't have account?</Text>
              <Link href='/sign-up' className='text-lg font-psemibold text-secondary'>Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn

