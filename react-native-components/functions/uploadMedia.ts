import { ImageLibraryOptions, launchImageLibrary } from "react-native-image-picker";
import DocumentPicker, { types } from "react-native-document-picker";
import { MessageController } from "../components/Message";
import { Storage } from "../utils/Storages";
import { Platform } from "react-native";

type Mimetype = "image/*" | "video/*" | "application/*";

interface UploadMedia {
  global?: 1 | 0;
  mimetype?: Mimetype | Mimetype[];
  options?: ImageLibraryOptions;
}

export default async function uploadMedia(props: UploadMedia = { global: 0 }) {
  if (typeof props.mimetype == "undefined" || props.mimetype.length == 0) {
    return imagePicker({ ...props.options, mediaType: "photo" }, props.global);
  }

  if (typeof props.mimetype == "string") {
    if (props.mimetype == "application/*") {
      return documentPicker(props.global);
    }

    let mediaType: ImageLibraryOptions["mediaType"] =
      props.mimetype == "image/*" ? "photo" : "video";

    return imagePicker({ ...props.options, mediaType }, props.global);
  }

  if (props.mimetype.includes("application/*")) {
    if (props.mimetype.length == 1) {
      return documentPicker(props.global);
    }

    let mediaType: ImageLibraryOptions["mediaType"] = "photo";

    if (props.mimetype.includes("video/*")) {
      mediaType = "video";
    }

    if (props.mimetype.includes("image/*") && props.mimetype.includes("video/*")) {
      mediaType = "mixed";
    }

    MessageController.show({
      type: "alert",
      title: "Aggiungi",
      message: "Scegli se aggiungere un media o un file",
      buttons: [
        {
          text: "Media",
          onPress: () => {
            return imagePicker({ ...props.options, mediaType }, props.global);
          },
        },
        {
          text: "File",
          onPress: () => {
            return documentPicker(props.global);
          },
        },
        {
          text: "Annulla",
          style: "cancel",
        },
      ],
    });
  } else {
    let mediaType: ImageLibraryOptions["mediaType"] = "photo";

    if (props.mimetype.includes("video/*")) {
      mediaType = "video";
    }

    if (props.mimetype.includes("image/*") && props.mimetype.includes("video/*")) {
      mediaType = "mixed";
    }
    return imagePicker({ ...props.options, mediaType }, props.global);
  }
}

async function imagePicker(
  options: ImageLibraryOptions = {
    mediaType: "photo",
  },
  global: UploadMedia["global"] = 0
) {
  const defaultOptions: ImageLibraryOptions = {
    mediaType: "photo",
    selectionLimit: 25,
    includeBase64: false,
    maxHeight: 1980,
    maxWidth: 1980,
    quality: 0.8,
  };

  const result = await launchImageLibrary({ ...defaultOptions, ...options });

  if (result.didCancel || typeof result.assets === "undefined") return;

  const assets = result.assets;

  const environment = Storage.get("environment");

  let formatted = assets.map((asset) => {
    return {
      ...asset,
      environment,
      global,
    };
  });

  const hasMediaToUpload: any[] | undefined = Storage.get("mediaToUpload");

  if (typeof hasMediaToUpload !== "undefined" && hasMediaToUpload.length > 0) {
    formatted = [...hasMediaToUpload, ...formatted];
  }

  return Storage.set("mediaToUpload", formatted);
}

async function documentPicker(global: UploadMedia["global"] = 0) {
  let formattedTypes: string[] = [];
  Object.keys(DocumentPicker.types).forEach((key: any) => {
    if (key == "allFiles" || key == "images" || key == "video") return;

    formattedTypes.push(DocumentPicker.types[key]);
  });

  const result = await DocumentPicker.pick({
    allowMultiSelection: true,
    copyTo: "cachesDirectory",
    type: formattedTypes,
  });

  if (typeof result === "undefined") return;

  MessageController.show({
    type: "toast",
    title: "Media in caricamento",
    message: `Attendi qualche secondo, non uscire dall'app`,
    role: "info",
  });

  const environment = Storage.get("environment");

  let formatted: any[] = [];

  result.forEach((asset) => {
    if (hasWhitespace(asset.name)) {
      return MessageController.show({
        type: "alert",
        title: "Attenzione",
        message: `Il file ${asset.name} non può avere spazi vuoti nel nome, rinomina questo file per poterlo caricare correttamente`,
      });
    }

    formatted.push({
      ...asset,
      uri: Platform.OS == "android" ? asset.fileCopyUri : asset.uri,
      environment,
      global,
    });
  });

  const hasMediaToUpload: any[] | undefined = Storage.get("mediaToUpload");

  if (typeof hasMediaToUpload !== "undefined" && hasMediaToUpload.length > 0) {
    formatted = [...hasMediaToUpload, ...formatted];
  }

  if (formatted.length > 0) {
    return Storage.set("mediaToUpload", formatted);
  }
}

function hasWhitespace(str: string | null) {
  if (str == null) return false;
  return /\s/.test(str);
}
