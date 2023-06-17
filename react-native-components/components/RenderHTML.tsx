import React, { useMemo, useState } from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import useLayout from "../hooks/useLayout";
import { ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import { View } from "react-native";

interface IProps {
  html: string;
  textColor?: string;
  textSize?: any;
  scrollEnabled?: boolean;
  padding?: number;
  containerStyle?: ViewStyle;
}

export default function RenderHTML({ ...props }: IProps) {
  const { spacing, fontSize, Colors } = useLayout();
  const [webViewHeight, setWebViewHeight] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const onMessage = (event: WebViewMessageEvent) => {
    setWebViewHeight(Number(event.nativeEvent.data));
  };

  return (
    <View renderToHardwareTextureAndroid style={{ flexGrow: 1, ...props.containerStyle }}>
      {isLoading && (
        <ActivityIndicator
          style={{ position: "absolute", left: 0, top: 0, zIndex: 10 }}
          size="small"
          color={Colors.gray}
        />
      )}

      <WebView
        androidHardwareAccelerationDisabled
        style={{ height: webViewHeight }}
        //style={{ opacity: 0.99, height: webViewHeight }}
        originWhitelist={["*"]}
        scrollEnabled={props.scrollEnabled}
        onLoadEnd={() => setIsLoading(false)}
        showsVerticalScrollIndicator={false}
        source={{
          html: `
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
            <style>a {color: ${Colors.link};} body {background: ${Colors.background}; color:${
            typeof props.textColor !== "undefined" ? props.textColor : Colors.text
          }; font-size: ${fontSize(props.textSize)}; margin:0; padding:${
            props.padding
          }; font-family: Arial, sans-serif;}</style>
          ${props.html}
              `,
        }}
        onMessage={onMessage}
        injectedJavaScript="window.ReactNativeWebView.postMessage(Math.max(document.body.offsetHeight, document.body.scrollHeight));"
      />
    </View>
  );
}
