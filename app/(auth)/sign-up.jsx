import { StyleSheet, Text, View, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'


const SignUp = () => {

  const {setUser, setIsLoggedIn} = useGlobalContext();

  const [form, setForm] = useState({
    username: '',
    email:'',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)


  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
    }

    setIsSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLoggedIn(true);

      router.replace("/Home");
    } catch (error) {
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[90vh] my-6 px-4'>

        <View className='flex-row items-end'>
            <Image 
              source={images.taskManagerLogo}
              className='w-12 h-12 mr-3'
              resizeMode='contain'
            />
            <Text className="text-xl text-semibold mt-10 font-psemibold">Automated Task Manager</Text>
          </View>

          <Text className='text-2xl text-semibold mt-10 font-psemibold text-secondary'>Sign Up</Text>

          <FormField 
            title='Username'
            value={form.username}
            placeholder="Enter your Full Name"
            handleChangeText={(e) => setForm({...form, username: e})}
            otherStyles="mt-10"
          />

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
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
            textStyles="text-white"
          />

          <View className='justify-center pt-5 flex-row gap-2'>
              <Text className='text-lg font-pregular'>Have an account already?</Text>
              <Link href='/sign-in' className='text-lg font-psemibold text-secondary'>Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp

