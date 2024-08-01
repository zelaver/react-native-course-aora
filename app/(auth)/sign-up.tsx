import { Alert, Image, ScrollView, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { createUser, getCurrentUser, signOut } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

type Form = {
  username: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const [form, setform] = useState<Form>({
    username: "",
    email: "",
    password: "",
  });

  const { setUser, setIsLoggedIn }: any = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password || !form.username) {
      Alert.alert("Error", "Please fill in all the fields");
    }
    setIsSubmitting(true);

    const username = form.username;
    const email = form.email;
    const password = form.password;

    try {
      const result = await createUser({ username, email, password });
      // await signOut()
      // set it to global state
      setUser(result);
      setIsLoggedIn(true);

      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
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

          <Text className="text-2xl text-white font-semibold mt-10">Sign up to Aora</Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setform({ ...form, username: e })}
            otherStyles="mt-7"
            keyboardType="username"
          />
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
            title="Sign Up"
            containerStyles="mt-7"
            handlePress={submit}
            isLoading={isSubmitting}
          />

          <View className="justify-center gap-2 pt-5 flex-row">
            <Text className="text-lg text-gray-100 font-pregular">have an account already?</Text>
            <Link
              className="text-lg font-psemibold text-secondary"
              href={"/sign-in"}
            >
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
