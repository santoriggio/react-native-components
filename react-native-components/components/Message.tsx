import React, { forwardRef, MutableRefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Alert, AlertButton, TouchableOpacity, View } from "react-native";
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { setPath } from "react-native-reanimated/lib/types/lib/reanimated2/animation/styleAnimation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useLayout from "../hooks/useLayout";
import { MessageProps } from "../types";
import Icon from "./Icon";
import Text from "./Text";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const icons = {
  primary: "",
  success: "checkmark",
  danger: "dangerous",
  warning: "warning",
  info: "info",
};

type MessageMethods = {
  show: (newMessage: MessageType) => void;
  hide: () => void;
};

type AlertType = {
  type: "alert";
  title: string;
  message?: string;
  buttons?: AlertButton[];
};

type ToastType = {
  type: "toast";
  title: string;
  message?: string;
  role?: "primary" | "danger" | "info" | "warning" | "success";
};

type MessageType = AlertType | ToastType;

class MessageController {
  private static messageRef: MutableRefObject<MessageMethods>;
  static setMessageRef = (ref: any) => {
    this.messageRef = ref;
  };

  static show = (newMessage: MessageType) => {
    this.messageRef.current?.show(newMessage);
  };

  static hide = () => {
    this.messageRef.current?.hide();
  };
}

function Message({ ...props }: MessageProps) {
  const { spacing, icon_size, Colors } = useLayout();
  const messageRef = useRef<MessageMethods>();
  const { top } = useSafeAreaInsets();
  const [message, setMessage] = useState<MessageType | undefined>(undefined);

  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    MessageController.setMessageRef(messageRef);
  }, []);

  useImperativeHandle(messageRef, () => ({
    show: (newMessage) => {
      if (newMessage.type == "toast") {
        setMessage(newMessage);

        if (timeout.current) clearTimeout(timeout.current);

        timeout.current = setTimeout(MessageController.hide, 2000);
      }

      if (newMessage.type == "alert") {
        const formattedButtons =
          typeof newMessage.buttons != "undefined" && Object.keys(newMessage.buttons).length > 0
            ? newMessage.buttons
            : undefined;
        
        Alert.alert(newMessage.title, newMessage.message, formattedButtons);
      }
    },
    hide: () => {
      setMessage(undefined);
    },
  }));

  if (typeof message == "undefined" || message.type != "toast") return null;

  return (
    <AnimatedTouchableOpacity
      entering={SlideInUp}
      exiting={SlideOutUp}
      onPress={() => {
        setMessage(undefined);
      }}
      style={{
        zIndex: 10000,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors[typeof message.role != "undefined" ? message.role : "primary"],
        paddingTop: top,
        padding: spacing,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {typeof icons[typeof message.role != "undefined" ? message.role : "primary"] != "undefined" && (
        <Icon
          name={icons[typeof message.role != "undefined" ? message.role : "primary"]}
          color="white"
          size={icon_size * 1.2}
          style={{ marginRight: spacing }}
        />
      )}
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} bold size="l" style={{ color: "white" }}>
          {message.title}
        </Text>
        {typeof message.message != "undefined" && message.message != "" && (
          <Text numberOfLines={2} style={{ color: "white" }}>
            {message.message}
          </Text>
        )}
      </View>
    </AnimatedTouchableOpacity>
  );
}
export { MessageController };
export default Message;
