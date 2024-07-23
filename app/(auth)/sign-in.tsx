import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { signIn } from "@/lib/appwrite";
import { ToastAndroid } from "react-native";

type Form = {
  email: string;
  password: string;
};

const SignIn = () => {
  const [form, setform] = useState<Form>({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }
    setIsSubmitting(true);

    const email = form.email;
    const password = form.password;

    // console.log(email)
    // console.log(password)

    try {
      const result = await signIn({ email, password });
      // console.log(password);

      // set it to global state
      router.replace("/home");
    } catch (error) {
      if (error instanceof Error) {
        ToastAndroid.show(`Error: ${error.message} ${error.cause}`, ToastAndroid.SHORT);
      }
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center px-4 my-6 h-full min-h-[85vh]">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />

          <Text className="text-2xl text-white font-semibold mt-10">Log in to Aora</Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setform({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setform({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Login"
            containerStyles="mt-7"
            handlePress={submit}
            isLoading={isSubmitting}
          />

          <View className="justify-center gap-2 pt-5 flex-row">
            <Text className="text-lg text-gray-100 font-pregular">Don't have account?</Text>
            <Link
              className="text-lg font-psemibold text-secondary"
              href={"/sign-up"}
            >
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({});
