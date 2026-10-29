This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md


## Read the following and follow it strictly

You are an expert React Native and Expo engineer helping me build
HomeScreen (working title).

Write clean, simple, maintainable code. Prioritize clarity over
unnecessary abstraction.

Think like a senior mobile developer.

---

## Project Overview

We are building HomeScreen (working title), a landscape-only Expo app
whose first screen is a game-style home screen made of three layers:
an art background, a layer of button and card shapes, and a layer of
editable text.

The app includes:

- A HomeScreen with 21 named shapes placed exactly as in the design
  reference, scaled to fit different phone sizes.
- Layer 1, background art: easy to replace. Today it is a solid blue
  color. Later it will be a static image, and possibly a GIF or other
  animation format.
- Layer 2, shapes: fixed black shapes for now. Later each shape will be
  replaced by a fixed design asset, so every shape must keep a stable
  name (id).
- Layer 3, text: editable text on top of the shapes. Not built yet.

Keep the implementation simple and readable.

### Current Step (Step 1 only)

Build only the HomeScreen:

- Solid blue background (`bg-blue-600`).
- The 21 shapes below, filled black (`#000000`), at the exact positions
  and tilt given in this file.
- No navigation, no press handlers, no text, no authentication.
- Do not set up Clerk, Zustand stores, or the (auth) and (tabs)
  folders yet. The HomeScreen is the initial route (`app/index.tsx`).
- Lock the app to landscape with `"orientation": "landscape"` in
  `app.json`. Do not install a library for this.
- `react-native-svg` is approved for this project because the tilted
  shapes need exact polygons. Install it with
  `npx expo install react-native-svg`. Ask before installing anything
  else.

Do not build anything from the Later list until I ask:

- Background art swap (image, GIF, animation).
- Replacing shapes with design assets.
- Text layer.
- Navigation.

### Layers and Z-order

`HomeScreen` is a full-screen View with these children, bottom to top:

1. `HomeBackground`: fills the screen. In Step 1 it is a blue View.
   Later it will render the art from `images.homeBackground`
   (`constants/images.ts`), so changing the art means replacing one
   asset and one line, nothing else. Use `resizeMode` cover with the
   art centered.
2. Shape layer: four `ShapeCluster` components (below), absolutely
   positioned. Each renders its shapes in one `Svg`.
3. Text layer: later. Do not build it now.

Leave the center of the screen free of UI, because the character art
lives there.

### Design Frame and Scaling

Everything is defined in a design frame of **800 x 360 dp**
(landscape, origin top-left, y grows downward). The reference image is
2400 x 1080 px at @3x, so dp = px / 3. All coordinates below are in
this frame.

Scale factor, computed from `useWindowDimensions()`:

```
s = clamp(min(width / 800, height / 360), 0.75, 1.4)
```

Never scale by width alone. On a phone the height barely changes while
the width changes a lot, so the extra or missing width is absorbed by
the free center of the screen.

Put `DESIGN_WIDTH = 800`, `DESIGN_HEIGHT = 360`, the clamp limits, and
the shape color in `constants/layout.ts`.

### Clusters

The shapes are split into four clusters. Each cluster is anchored to a
screen corner, so the layout stays attached to the edges on any phone.

| Cluster | Anchor | Origin (ox, oy) in dp | Size (w x h) in dp |
|---|---|---|---|
| topBar | top-left | 0, 0 | 262 x 34 |
| leftColumn | bottom-left | 0, 125 | 239 x 235 |
| rightTop | top-right | 445, 0 | 355 x 214 |
| rightBottom | bottom-right | 471, 211 | 329 x 149 |

Render each cluster as one `Svg`:

- `width = w * s`, `height = h * s`.
- `viewBox = "ox oy w h"`. Polygon points below are frame coordinates
  and go into the Svg as they are, with no subtraction.
- Position absolute: `top: 0` or `bottom: 0` according to the anchor,
  and `left` or `right` according to the safe-area rule below.
- `pointerEvents="none"` while the shapes are not interactive.

The rightTop and rightBottom boxes overlap by about 3 dp. That is
expected and harmless.

### Safe Area (notch in landscape)

Use `react-native-safe-area-context`. Only the horizontal insets
matter. Shapes must not hide under the notch, but the shapes that touch
the screen edge must still reach the physical edge.

Let `iL = insets.left` and `iR = insets.right`.

- Left clusters (topBar, leftColumn): Svg at `left: 0`,
  `width = w * s + iL`, `viewBox x = ox - iL / s`,
  `viewBox width = w + iL / s`. Every vertex with x = 0 moves to
  `x = -iL / s`.
- Right clusters (rightTop, rightBottom): Svg at `right: 0`,
  `width = w * s + iR`, `viewBox x = ox`,
  `viewBox width = w + iR / s`. Every vertex with x = 800 moves to
  `x = 800 + iR / s`.
- Vertices with y = 0 or y = 360 stay as they are. Vertical insets are
  ignored in Step 1.

With zero insets everything reduces to the plain scaled layout.

### Shapes

Do not straighten, rotate, round, or "fix" any shape. The tilt is a
deliberate design decision. Use the vertices exactly as listed. Points
are `x,y` pairs in dp, ready for `<Polygon points="...">`.

Two shapes are placeholders for assets that will arrive later:
SettingsButton is a gear in the design and MenuButton is a triangle.
Draw them as listed (circle and triangle). RoundButtonA and
RoundButtonB are circles.

Names are PascalCase and double as ids. Keep them in
`data/homeLayout.ts`, typed, so they can be renamed in one place.

**topBar**

| Name | Kind | Geometry (dp) |
|---|---|---|
| SettingsButton | circle | cx=23.8 cy=19.7 r=9.5 |
| MenuButton | polygon | 59.3,9.3 48.7,29.0 70.3,29.0 |
| QuickButtonA | polygon | 85.3,11.0 109.3,11.0 109.3,28.7 85.3,28.7 |
| QuickButtonB | polygon | 123.3,11.0 149.0,11.0 149.0,28.7 123.3,28.7 |
| ResourceBar | polygon | 161.0,5.3 261.7,5.3 261.7,34.0 161.0,34.0 |

**leftColumn**

| Name | Kind | Geometry (dp) |
|---|---|---|
| ProfilePanel | polygon | 0.0,125.3 93.7,125.3 93.7,224.7 0.0,224.7 |
| RoundButtonA | circle | cx=140.7 cy=203.0 r=11.1 |
| RoundButtonB | circle | cx=171.5 cy=203.9 r=11.4 |
| EventBanner | polygon | 236.3,228.3 15.0,235.3 20.3,280.7 236.7,269.0 |
| MainCard | polygon | 156.3,279.0 16.0,287.0 23.0,352.3 159.0,341.7 |
| SideCardA | polygon | 237.3,275.3 164.3,279.7 164.0,305.7 237.7,301.3 |
| SideCardB | polygon | 238.0,302.0 163.0,310.0 165.0,339.3 238.3,330.3 |

**rightTop**

| Name | Kind | Geometry (dp) |
|---|---|---|
| NoticeStripA | polygon | 473.3,13.7 609.3,0.0 745.3,0.0 474.0,25.7 |
| NoticeStripB | polygon | 800.0,0.0 445.7,31.7 445.0,50.7 800.0,19.0 |
| FeaturedPanel | polygon | 800.0,30.3 476.3,56.3 472.3,143.7 800.0,138.7 |
| ShortcutCardA | polygon | 584.0,148.7 462.3,149.3 460.3,203.3 582.7,207.3 |
| ShortcutCardB | polygon | 738.3,147.0 591.0,148.3 589.3,207.3 739.0,212.7 |
| ShortcutCardC | polygon | 800.0,147.0 744.3,147.3 746.0,212.0 800.0,213.3 |

**rightBottom**

| Name | Kind | Geometry (dp) |
|---|---|---|
| WidePanel | polygon | 495.0,211.0 494.7,267.0 775.0,288.0 774.3,221.7 |
| BottomCardA | polygon | 473.3,272.7 471.7,326.7 578.7,340.7 581.7,281.0 |
| BottomCardB | polygon | 586.0,283.0 587.3,342.3 739.0,360.0 762.3,360.0 760.7,297.0 |

NoticeStripA, NoticeStripB, ShortcutCardC, FeaturedPanel, ProfilePanel,
and BottomCardB touch a screen edge in the design (bleed). Their edge
vertices follow the Safe Area rule above.

### How to Check Step 1

At 800 x 360 dp with zero insets (s = 1), the shapes must match the
coordinates above exactly. Also check these sizes and confirm nothing
overlaps, nothing is cut off, and the screen center stays free:

- 640 x 360
- 800 x 360
- 932 x 430
- Any size with a left or right inset of about 44 dp (notch).

---

## Tech Stack

- Expo

- React Native

- TypeScript

- Expo Router

- NativeWind

- Zustand

- AsyncStorage

- Clerk for authentication

Do not introduce new major libraries unless there is a strong reason.

Ask before installing anything new.

---

## Development Philosophy

Build feature by feature.

For every feature:

1. Read this file first.

2. Keep the implementation simple.

3. Avoid overengineering.

4. Prefer readable code over clever code.

5. Build the smallest useful version first.

6. Refactor only when repetition appears.

---

## Decision Making

If something is unclear or could be improved, suggest a better
approach. If a new library would significantly help, recommend it,
explain why, and ask before adding it.

Do not install new libraries without approval.

---

## Architecture

Use this folder structure:

```
app/
  (auth)/
  (tabs)/
components/
constants/
constants/
data/
hooks/
lib/
store/
types/
assets/
```

**app/** is for routes and screens only. Screens compose components and
call hooks or stores. They should not contain large reusable UI blocks
or business logic.

**components/** is for reusable UI. Create a component when it is
reused in multiple places, when it makes a screen easier to read, or
when it represents a clear UI concept. Examples for this app:
HomeBackground, ShapeCluster, CardShape, and later TextLayer. Do not
create components too early.

**data/** holds hardcoded content. Keep it typed.

**store/** holds Zustand stores. Examples of state to keep here: none
in Step 1; later, the active background art and per-shape text
overrides. Persist with AsyncStorage when needed.

**lib/** holds external service helpers (clerk.ts, api.ts, cn.ts).
Never expose secret keys here.

---

## UI Rules

For any UI task:

- Replicate the provided design exactly.

- Match layout, spacing, padding, font sizes, font hierarchy, colors,
border radius, shadows, alignment, and proportions.

- Do not approximate. Do not simplify unless explicitly asked.

---

## Styling Rules

Use NativeWind classes. Do not use StyleSheet unless it is not possible
to style with className.

Use the NativeWind version installed in this project. Check
package.json. Do not upgrade without approval.

Reuse class patterns through utilities in global.css.

### Style Exception List

Use StyleSheet or inline styles for:

- SafeAreaView (className not supported)

- KeyboardAvoidingView (behavior props)

- Modal (visible, transparent props)

- Animated.View (animated style values)

- Dynamic styles calculated at runtime

- Platform specific styles

- Pressable or TouchableOpacity pressed states

- Shadows (different per platform)

Everywhere else, use NativeWind.

---

## Image Rule

Use centralized image imports.

1. Check if constants/images.ts exists.

2. If not, create it.

3. Import all app images there.

4. Use them through the centralized object.

```ts
import mascot from "@/assets/images/mascot.png";

export const images = {
  mascot,
};
```

```tsx
<Image source={images.mascot} />
```

Do not import image assets directly inside screens or components.

---

## State Management

- Zustand for global client state.

- Local state for temporary UI state.

- AsyncStorage for persistence.

---

## TypeScript

- Strict mode.

- No `any`.

- Keep types simple and readable.

---

## Feature Implementation

When building a feature:

1. Read this file first.

2. Identify the files to change.

3. Keep changes focused.

4. Do not rewrite unrelated code.

5. Follow existing patterns.

6. Make sure the feature works end to end.

7. Fix lint and type errors before finishing.

---

## Secrets

- Never expose secret keys in client code.

- Use server routes for tokens, AI calls, and any external API access.

---

## Authentication

Use Clerk. Do not build custom auth.

---

## Communication

Be concise. Explain what changed and how to test it.

---

## Final Reminder

Before every feature:

- Read this file.

- Follow it strictly.

- Build clean, simple code.

- Replicate UI exactly when designs are provided.