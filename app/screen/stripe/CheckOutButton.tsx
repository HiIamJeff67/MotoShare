import { Text, TouchableHighlight } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export default function CheckOutButton(props: React.ComponentProps<typeof TouchableHighlight> & { title: string }) {
  return (
    <TouchableHighlight
      underlayColor={"#18191E"}
      {...props}
      style={[
        {
          backgroundColor: "#000",
          justifyContent: "center",
          padding: moderateScale(12),
          borderRadius: moderateScale(8),
        },
        props.style,
      ]}
    >
      <Text
        style={{
          color: "white",
          fontWeight: "600",
          fontSize: moderateScale(20),
          textAlign: "center",
        }}
      >
        {props.title}
      </Text>
    </TouchableHighlight>
  );
}
