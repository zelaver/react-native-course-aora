import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";
import { Image } from "react-native";

type FormField = {
  value?: string;
  placeholder?: string;
  handleChangeText?: (e: any) => void;
  otherStyles?: string;
  keyboardType?: string;
};

const SearchInput = ({ value, placeholder, handleChangeText, otherStyles, keyboardType }: FormField) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    
      <View className="flex-row w-full h-16 px-4 bg-black-100 border-2 border-black-200 rounded-2xl focus:border-secondary items-center space-x-4">
        <TextInput
          className="mt-0.5 text-base flex-1 font-pregular text-white"
          value={value}
          placeholder={placeholder}
          placeholderTextColor={"#7b7b8b"}
          onChangeText={handleChangeText}
        />
        <TouchableOpacity>
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
