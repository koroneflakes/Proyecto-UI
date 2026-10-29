import { StyleSheet, View } from "react-native";
import Svg, { Circle, Polygon } from "react-native-svg";
import { SHAPE_COLOR } from "@/constants/layout";
import type { HOME_LAYOUT } from "@/data/homeLayout";

type ShapeClusterData = (typeof HOME_LAYOUT)[number];

type ShapeClusterProps = {
  cluster: ShapeClusterData;
  scale: number;
  leftInset: number;
  rightInset: number;
};

export function ShapeCluster({
  cluster,
  scale,
  leftInset,
  rightInset,
}: ShapeClusterProps) {
  const isLeftAnchored =
    cluster.anchor === "top-left" || cluster.anchor === "bottom-left";
  const inset = isLeftAnchored ? leftInset : rightInset;
  const viewBoxX = isLeftAnchored
    ? cluster.originX - inset / scale
    : cluster.originX;
  const viewBoxWidth = cluster.width + inset / scale;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.cluster,
        cluster.anchor.includes("top")
          ? { top: 0 }
          : { bottom: 0 },
        isLeftAnchored ? { left: 0 } : { right: 0 },
      ]}
    >
      <Svg
        width={cluster.width * scale + inset}
        height={cluster.height * scale}
        viewBox={`${viewBoxX} ${cluster.originY} ${viewBoxWidth} ${cluster.height}`}
      >
        {cluster.shapes.map((shape) =>
          shape.kind === "circle" ? (
            <Circle
              key={shape.id}
              id={shape.id}
              cx={shape.cx}
              cy={shape.cy}
              r={shape.r}
              fill={SHAPE_COLOR}
            />
          ) : (
            <Polygon
              key={shape.id}
              id={shape.id}
              points={shape.points}
              fill={SHAPE_COLOR}
            />
          ),
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  cluster: {
    position: "absolute",
  },
});
