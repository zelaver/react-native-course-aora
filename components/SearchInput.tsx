import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";
import { Image } from "react-native";
import { router, usePathname } from "expo-router";

type FormField = {
  value?: string;
  placeholder?: string;
  handleChangeText?: (e: any) => void;
  otherStyles?: string;
  keyboardType?: string;
  initialQuery?: string | string[] | undefined
};

const SearchInput = ({
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  initialQuery
}: FormField) => {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  return (
    <View className="flex-row w-full h-16 px-4 bg-black-100 border-2 border-black-200 rounded-2xl focus:border-secondary items-center space-x-4">
      <TextInput
        className="mt-0.5 text-base flex-1 font-pregular text-white"
        value={query}
        placeholder={placeholder}
        placeholderTextColor={"#CDCDE0"}
        onChangeText={(e) => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing query",
              "Please input somthing to search results across database"
            );
          }

          if (pathname.startsWith("/search")) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`)
          }
        }}
      >
        <Image
          source={icons.search}
          className="w-5 h-5"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
