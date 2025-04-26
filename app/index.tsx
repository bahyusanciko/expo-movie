import CardMovie from "@/components/CardMovie";
import HeadTitle from "@/components/HeadTitle";
import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Appbar, Searchbar, Text } from "react-native-paper";
import axios from "axios";
import { Movie } from "../data/types";

const API_KEY = "1a19610e";
const DEFAULT_SEARCH = "Final Destination";

const fetchMoviesByPage = async (
  query: string,
  page: number
): Promise<{ Search: Movie[]; totalResults: number } | null> => {
  try {
    const response = await axios.get(
      `https://www.omdbapi.com/`,
      {
        params: {
          apikey: API_KEY,
          s: query,
          page: page,
        },
      }
    );
    const data = response.data;
    if (data.Response === "True") {
      return {
        Search: data.Search.map((movie: any) => ({
          title: movie.Title,
          poster: movie.Poster,
          year: movie.Year,
        })),
        totalResults: parseInt(data.totalResults, 10),
      };
    }
    return null;
  } catch (e) {
    return null;
  }
};

export default function Index() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1); 
  const [totalResults, setTotalResults] = useState<number>(0);
  const { width: screenWidth } = useWindowDimensions();
  const numColumns = screenWidth > 1024 ? 5 : screenWidth > 768 ? 4 : 2;
  const spacing = 16;
  const cardWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns;

  const loadMovies = async (query: string, page: number) => {
    setLoading(true);
    const results = await fetchMoviesByPage(query, page);
    if (results) {
      setMovies(results.Search);
      setTotalResults(results.totalResults);
    }
    setLoading(false);
  };
  
  const onChangeSearch = async (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const onSubmitSearch = async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setPage(1);
      setMovies([]);
    } else {
      setSearching(true);
      setPage(1);
      await loadMovies(trimmedQuery, 1);
      setSearching(false);
    }
  };

  const handleNextPage = () => {
    if (totalResults > movies.length) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <CardMovie item={item} cardWidth={cardWidth} />
  );

  useEffect(() => {
    loadMovies(searchQuery || DEFAULT_SEARCH, page);
  }, [searchQuery, page]);

  return (
    <SafeAreaView style={styles.container}>
      <HeadTitle title="FinProH8" description="My movie app homepage" />
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="FinProH8" titleStyle={styles.headerTitle} />
        <Searchbar
          placeholder="Search..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          onSubmitEditing={onSubmitSearch}
          style={styles.searchbar}
          inputStyle={{ fontSize: 16 }}
        />
      </Appbar.Header>
      <View style={styles.body}>
        <Text style={styles.subtitle}>Show your favorite movies</Text>
        {loading || searching ? (
          <ActivityIndicator size="large" style={{ marginTop: 32 }} />
        ) : (
          <>
            <FlatList
              key={numColumns}
              data={movies}
              keyExtractor={(item) => item.title}
              renderItem={renderMovie}
              numColumns={numColumns}
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                <Text style={styles.noResult}>No movies found.</Text>
              }
            />
            <View style={styles.pagination}>
              <Appbar.Action
                icon="chevron-left"
                onPress={handlePreviousPage}
                disabled={page <= 1}
                accessibilityLabel="Previous Page"
              />
              <Appbar.Action
                icon="chevron-right"
                onPress={handleNextPage}
                disabled={totalResults <= movies.length}
                accessibilityLabel="Next Page"
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { backgroundColor: "#ff5500", elevation: 4 },
  headerTitle: { color: "#fff", fontWeight: "bold", fontSize: 20 },
  searchbar: {
    marginRight: 8,
    marginVertical: 8,
    width: 180,
    backgroundColor: "#fff",
    elevation: 2,
    borderRadius: 8,
    height: 40,
    alignSelf: "center",
  },
  body: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  list: {
    paddingBottom: 16,
  },
  noResult: {
    textAlign: "center",
    color: "#888",
    marginTop: 32,
    fontSize: 16,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  pageText: {
    fontSize: 18,
    color: "#007bff",
    marginHorizontal: 10,
  },
});
