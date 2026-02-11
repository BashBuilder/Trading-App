// import ParallaxScrollView from "@/components/parallax-scroll-view";
// import { Image } from "expo-image";
// import { Text, View } from "react-native";

// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
//       headerImage={
//         <Image
//           source={require("@/assets/images/partial-react-logo.png")}
//           // style={styles.reactLogo}
//         />
//       }
//     >
//       <View>
//         <Text className="text-6xl text-yellow-400 ">Welcome!</Text>
//       </View>
//     </ParallaxScrollView>
//   );
// }
// src/app/index.tsx
import { Redirect } from "expo-router";
import { useSubscriptionGate } from "../../navigation/Gate";

export default function Index() {
  const { hasAccess } = useSubscriptionGate();

  if (!hasAccess) {
    return <Redirect href="/paywall" />;
  }

  return <Redirect href="/tool" />;
}
