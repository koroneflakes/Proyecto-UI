import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { images } from "@/constants/images";

export function HomeBackground() {
  return (
    <Image
      pointerEvents="none"
      source={images.homeBackground}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      contentPosition="center"
    />
  );
}
