import React, { useEffect, useMemo, useRef, useState } from "react";
import YoutubePlayer, { YoutubeIframeRef } from "react-native-youtube-iframe";
import { Vimeo } from "react-native-vimeo-iframe";
import { TouchableOpacity, useWindowDimensions, View } from "react-native";
import { VideoPlayerProps } from "../types";
import { useManufacturer } from "react-native-device-info";
import keyExist from "../functions/keyExist";
import useLayout from "../hooks/useLayout";
import Loading from "./Loading";

function VideoPlayer({ ...props }: VideoPlayerProps) {
  const yt_ref = useRef<YoutubeIframeRef>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { width } = useWindowDimensions();
  const { spacing, radius } = useLayout();
  const ratio = 0.5615; // height/width
  const playerHeight = ratio * (width - spacing * 2);

  const timeUpdate = useRef<any>({
    current: 0,
    total: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (props.type == "youtube") {
        yt_ref.current?.getCurrentTime().then((res) => {
          let toReturn: any = {
            current: 0,
            total: 0,
          };

          toReturn.current = res;

          yt_ref.current?.getDuration().then((res) => {
            toReturn.total = res;

            if (props.onTimeUpdate) props.onTimeUpdate(toReturn);
          });
        });
      } else {
        if (props.onTimeUpdate) props.onTimeUpdate(timeUpdate.current);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const type = useMemo(() => {
    const fType = keyExist(props.type);

    if (typeof fType != "undefined") {
      return fType;
    }

    const fLink = keyExist<string>(props.link);
    if (typeof fLink != "undefined") {
      //Get the type from the link

      if (fLink.includes("youtube")) {
        return "youtube";
      }

      if (fLink.includes("vimeo")) {
        return "vimeo";
      }
    }

    return undefined;
  }, [props.type, props.link]);

  const videoId = useMemo(() => {
    const fVideoId = keyExist<string>(props.videoId);
    if (typeof fVideoId != "undefined") {
      return fVideoId;
    }

    //Get the video id from link

    const fLink = keyExist<string>(props.link);

    if (typeof fLink != "undefined" && typeof type != "undefined") {
      if (type == "youtube") {
        return fLink?.split("=")[1].split("&")[0];
      }

      if (type == "vimeo") {
        return fLink.split("/")[3];
      }
    }
  }, [type, props.link, props.videoId]);

  const videoCallbacks = {
    timeupdate: (data: any) => {
      timeUpdate.current.current = data.currentTime;
      timeUpdate.current.total = data.duration;
    },
    // play: (data: any) => console.log("play: ", data),
    // pause: (data: any) => console.log("pause: ", data),
    // fullscreenchange: (data: any) => console.log("fullscreenchange: ", data),
    // ended: (data: any) => console.log("ended: ", data),
    // controlschange: (data: any) => console.log("controlschange: ", data),
  };

  if (typeof videoId == "undefined" || typeof type == "undefined") return null;

  if (type === "youtube") {
    return (
      <View renderToHardwareTextureAndroid style={{ height: playerHeight, borderRadius: radius, overflow: "hidden" }}>
        {isLoading && <Loading style={{ position: "absolute", left: 0, right: 0, height: playerHeight }} />}
        <YoutubePlayer
          ref={yt_ref}
          height={playerHeight}
          play={false}
          videoId={videoId}
          onReady={() => {
            setIsLoading(false);
            setTimeout(() => {
              if (typeof props.currentTime != "undefined") {
                if (type == "youtube") {
                  yt_ref.current?.seekTo(props.currentTime, true);
                }
              }
            }, 1000);
          }}
        />
      </View>
    );
  }

  if (props.type === "vimeo") {
    const time = () => {
      //     let m = Math.floor(props.currentTime / 60);

      //   let s = Math.round(props.currentTime - m * 60);

      //   const t = `${m}m${s}s`;

      //   return t;
      return 0;
    };

    return (
      <View style={{ height: playerHeight, borderRadius: radius, overflow: "hidden" }} renderToHardwareTextureAndroid>
        <Vimeo
          // androidHardwareAccelerationDisabled
          videoId={videoId}
          params={`api=1&autoplay=0#t=${time()}&height=${playerHeight}&width:${width}&byline=false`}
          allowsInlineMediaPlayback
          handlers={videoCallbacks}
        />
      </View>
    );
  }

  return null;
}

export default VideoPlayer;
