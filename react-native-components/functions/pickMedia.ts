import { launchCamera, launchImageLibrary, ImageLibraryOptions } from "react-native-image-picker";



async function pickMedia() {
  const options: ImageLibraryOptions = {
    mediaType: "photo",
    selectionLimit: 25,
    includeBase64: false,
    maxHeight: 1980,
    maxWidth: 1980,
    quality: 0.8,
  };

  const result = await launchImageLibrary(options);

  if (result.didCancel || typeof result.assets === "undefined") return;

  return result;
}

export default pickMedia;
