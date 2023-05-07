import useLayout from "../hooks/useLayout";
import { ActivityIndicator, View } from "react-native";
import Text from "./Text";
import { LoadingProps } from "../types";
import SkeletonPlaceholder from "./SkeletonPlaceholder";

function Loading({ ...props }: LoadingProps) {
  const { Colors } = useLayout();

  if (props.skeletonPlaceholder) {
    return <SkeletonPlaceholder style={props.style} components={props.skeletonPlaceholder} />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        ...props.style,
      }}
    >
      <ActivityIndicator size={"small"} color={Colors.gray} />
      <Text size="s" style={{ marginTop: 5, color: Colors.gray }}>
        CARICO
      </Text>
    </View>
  );
}

export default Loading;
