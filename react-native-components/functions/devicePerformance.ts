import React from "react";
import DeviceInfo from "react-native-device-info";

function devicePerformance() {
  DeviceInfo.getTotalMemory().then((res) => {
    console.log(res / 1000000000);
  });
}

export default devicePerformance;
