type PolygonShape = {
  id: string;
  kind: "polygon";
  points: string;
};

type CircleShape = {
  id: string;
  kind: "circle";
  cx: number;
  cy: number;
  r: number;
};

type Shape = PolygonShape | CircleShape;

type ShapeCluster = {
  id: string;
  anchor: "top-left" | "bottom-left" | "top-right" | "bottom-right";
  originX: number;
  originY: number;
  width: number;
  height: number;
  shapes: readonly Shape[];
};

export const HOME_LAYOUT = [
  {
    id: "topBar",
    anchor: "top-left",
    originX: 0,
    originY: 0,
    width: 262,
    height: 34,
    shapes: [
      { id: "SettingsButton", kind: "circle", cx: 23.8, cy: 19.7, r: 9.5 },
      { id: "MenuButton", kind: "polygon", points: "59.3,9.3 48.7,29.0 70.3,29.0" },
      { id: "QuickButtonA", kind: "polygon", points: "85.3,11.0 109.3,11.0 109.3,28.7 85.3,28.7" },
      { id: "QuickButtonB", kind: "polygon", points: "123.3,11.0 149.0,11.0 149.0,28.7 123.3,28.7" },
      { id: "ResourceBar", kind: "polygon", points: "161.0,5.3 261.7,5.3 261.7,34.0 161.0,34.0" },
    ],
  },
  {
    id: "leftColumn",
    anchor: "bottom-left",
    originX: 0,
    originY: 125,
    width: 239,
    height: 235,
    shapes: [
      { id: "ProfilePanel", kind: "polygon", points: "0.0,125.3 93.7,125.3 93.7,224.7 0.0,224.7" },
      { id: "RoundButtonA", kind: "circle", cx: 140.7, cy: 203.0, r: 11.1 },
      { id: "RoundButtonB", kind: "circle", cx: 171.5, cy: 203.9, r: 11.4 },
      { id: "EventBanner", kind: "polygon", points: "236.3,228.3 15.0,235.3 20.3,280.7 236.7,269.0" },
      { id: "MainCard", kind: "polygon", points: "156.3,279.0 16.0,287.0 23.0,352.3 159.0,341.7" },
      { id: "SideCardA", kind: "polygon", points: "237.3,275.3 164.3,279.7 164.0,305.7 237.7,301.3" },
      { id: "SideCardB", kind: "polygon", points: "238.0,302.0 163.0,310.0 165.0,339.3 238.3,330.3" },
    ],
  },
  {
    id: "rightTop",
    anchor: "top-right",
    originX: 445,
    originY: 0,
    width: 355,
    height: 214,
    shapes: [
      { id: "NoticeStripA", kind: "polygon", points: "473.3,13.7 609.3,0.0 745.3,0.0 474.0,25.7" },
      { id: "NoticeStripB", kind: "polygon", points: "800.0,0.0 445.7,31.7 445.0,50.7 800.0,19.0" },
      { id: "FeaturedPanel", kind: "polygon", points: "800.0,30.3 476.3,56.3 472.3,143.7 800.0,138.7" },
      { id: "ShortcutCardA", kind: "polygon", points: "584.0,148.7 462.3,149.3 460.3,203.3 582.7,207.3" },
      { id: "ShortcutCardB", kind: "polygon", points: "738.3,147.0 591.0,148.3 589.3,207.3 739.0,212.7" },
      { id: "ShortcutCardC", kind: "polygon", points: "800.0,147.0 744.3,147.3 746.0,212.0 800.0,213.3" },
    ],
  },
  {
    id: "rightBottom",
    anchor: "bottom-right",
    originX: 471,
    originY: 211,
    width: 329,
    height: 149,
    shapes: [
      { id: "WidePanel", kind: "polygon", points: "495.0,211.0 494.7,267.0 775.0,288.0 774.3,221.7" },
      { id: "BottomCardA", kind: "polygon", points: "473.3,272.7 471.7,326.7 578.7,340.7 581.7,281.0" },
      { id: "BottomCardB", kind: "polygon", points: "586.0,283.0 587.3,342.3 739.0,360.0 762.3,360.0 760.7,297.0" },
    ],
  },
] as const satisfies readonly ShapeCluster[];
