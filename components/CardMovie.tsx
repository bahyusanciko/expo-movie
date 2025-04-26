import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { CardMovieProps } from "../data/types";

export default function CardMovie({ item, cardWidth }: CardMovieProps) {
  return (
    <Card style={[styles.card, { width: cardWidth }]}>
      <Card.Cover source={{ uri: item.poster }} style={styles.poster} />
      <Card.Content style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.year}>{item.year}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    borderRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },
  poster: {
    height: 180,
    resizeMode: "cover",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 2,
  },
  year: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
});
