import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeBackground } from "@/components/home-background";
import { ShapeCluster } from "@/components/shape-cluster";
import {
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  MAX_SCALE,
  MIN_SCALE,
  VERTICAL_LAYOUT_ANCHOR,
  VERTICAL_LAYOUT_OFFSET,
} from "@/constants/layout";
import { HOME_LAYOUT } from "@/data/homeLayout";

export default function Index() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, width / DESIGN_WIDTH));
  const shapeStageHeight = DESIGN_HEIGHT * scale;
  const shapeStageTop =
    (VERTICAL_LAYOUT_ANCHOR === "top"
      ? 0
      : VERTICAL_LAYOUT_ANCHOR === "bottom"
        ? height - shapeStageHeight
        : (height - shapeStageHeight) / 2) + VERTICAL_LAYOUT_OFFSET;

  return (
    <View className="flex-1">
      <HomeBackground />
      <View
        pointerEvents="box-none"
        style={[styles.shapeStage, { top: shapeStageTop, height: shapeStageHeight }]}
      >
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
    </View>
  );
}

const styles = StyleSheet.create({
  shapeStage: {
    position: "absolute",
    left: 0,
    right: 0,
  },
});
