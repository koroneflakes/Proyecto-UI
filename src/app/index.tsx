import { useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeBackground } from "@/components/home-background";
import { ShapeCluster } from "@/components/shape-cluster";
import {
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  MAX_SCALE,
  MIN_SCALE,
} from "@/constants/layout";
import { HOME_LAYOUT } from "@/data/homeLayout";

export default function Index() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = Math.min(
    MAX_SCALE,
    Math.max(
      MIN_SCALE,
      Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT),
    ),
  );

  return (
    <View className="flex-1">
      <HomeBackground />
      {HOME_LAYOUT.map((cluster) => (
        <ShapeCluster
          key={cluster.id}
          cluster={cluster}
          scale={scale}
          leftInset={insets.left}
          rightInset={insets.right}
        />
      ))}
    </View>
  );
}
