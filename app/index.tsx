import { Text, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";

const index = () => {
	return (
		<View className="bg-blue-50 flex-1 flex items-center justify-center">
			<Text className="text-3xl font-pblack">Aora!</Text>
			<StatusBar style="auto" />
			<Link href={"/profile"} style={{ color: "blue" }}>
				Go to kocak wak
			</Link>
		</View>
	);
};

export default index;


