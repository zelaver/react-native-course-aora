import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  RefreshControlComponent,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import { getAllPost, getLatestPost, searchPost } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, isLoading, refetch } = useAppwrite(() => searchPost(query));

  // console.log(query)
  // console.log(posts)

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary border-2 h-full">
      <FlatList
        data={posts}
        // posts={[{ id: 1 }, { id: 2 }, { id: 3 }]}
        keyExtractor={(item) => `${item.$id}`}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-12 px-4 ">
            <Text className="font-pmedium text-sm text-gray-100">Search result</Text>
            <Text className="text-2xl font-psemibold text-white">{query}</Text>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle={`No Videos Found of "${query}"`}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
