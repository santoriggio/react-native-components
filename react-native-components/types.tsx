import { MutableRefObject, ReactNode } from "react";
import {
  FlatListProps as DefaultFlatListProps,
  FlatList as DefaultFlatList,
  ViewStyle,
  Insets,
  TextProps as DefaultTextProps,
  TextStyle,
  TouchableOpacityProps,
  ScrollViewProps as DefaultScrollViewProps,
  TextInputProps as DefaultTextInputProps,
  SwitchChangeEvent,
  ColorValue,
} from "react-native";
import Animated from "react-native-reanimated";
import SkeletonPlaceholder from "./components/SkeletonPlaceholder";
import { ScreenDrawerComponent } from "./ScreenDrawerTypes";
import { ImageProps as DefaultImageProps } from "expo-image";
import { sizes } from "./utils/Utils";

/*



*/

type CustomFlatListProps = {
  ref?: MutableRefObject<DefaultFlatList<any>>;
  endpoint?: string;
  query?: string;
  params?: {
    [key: string]: any;
  };
  structure?: string;
  path?: string;
  scrollY?: any;
  scrollX?: any;
  skeletonPlaceholder?: SkeletonPlaceholderProps["components"];
  unread?: (string | number)[];
  handleErrors?: {
    [key: string]: {
      title?: string;
      message?: string;
    };
  };
  selected?: any[];
  keysPath?: {
    path: string;
    onKeyFound: (data: any) => void;
  }[];

  onLoadEnd?: () => void;

  onPressItem?: (item: any) => void;
  onLongPressItem?: (item: any) => void;
  enableDebugLogs?: boolean;
};

export type FlatListProps<T> = CustomFlatListProps & Partial<DefaultFlatListProps<T>>;

// export interface FlatListProps
//   extends Partial<
//     DefaultFlatListProps<{
//       content: ScreenDrawerComponent[];
//     }>
//   > {
//   data?:
//     | {
//         title?: string;
//         content: ScreenDrawerComponent[];
//       }[]
//     | any[];
//   endpoint?: string;
//   query?: string;
//   params?: any;
//   limit?: number;
//   structure?: string;
//   path?: string;
//   handleErrors?: {
//     [key: string]: {
//       title?: string;
//       message?: string;
//     };
//   };
//   canRefresh?: boolean;
//   enableDebugLogs?: boolean;
//   skeletonPlaceholder?: SkeletonPlaceholder;
//   scrollY?: any;
//   scrollX?: any;

//   // Default Flatlist Props

//   // renderItem?: ListRenderItem<any>;
//   // data?: any[];
//   // numColumns?: number;
//   // bounces?: boolean;
//   // horizontal?: boolean;
//   // contentContainerStyle?: ViewStyle;
//   // scrollEnabled?: boolean;
//   // scrollIndicatorInsets?: Insets;
//   // onEndReached?: () => void;
//   // onEndReachedThreshold?: any;
//   // refreshing?: boolean;
//   // onRefresh?: () => void;
// }

export interface FlatListMethods extends Animated.FlatList<any> {}

export type NoDataProps = {
  title?: string;
  subtitle?: string;
  icon?: string;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentContainerStyle?: ViewStyle;
  scrollIndicatorInsets?: Insets;
  scrollEnabled?: boolean;
};

export type CartProps = {
  header?: ScreenDrawerComponent[];
  uniqueId?: string;
  onChange?: (component: ScreenDrawerComponent, newValue?: string) => void;
  data?:
    | {
        title?: string;
        content: ScreenDrawerComponent[];
      }[]
    | any[];
};

export interface TextProps extends DefaultTextProps {
  size?: keyof typeof sizes;
  bold?: boolean;
}

export const ButtonTypes = {
  plain: {},
  filled: {},
  gray: {},
  tinted: {},
};

export type ButtonProps = {
  title?: string;

  icon?: string;
  type?: keyof typeof ButtonTypes;
  role?: "primary" | "danger" | "info" | "warning" | "success";
  style?: ViewStyle;
  active?: boolean;
  loading?: boolean;
  size?: keyof typeof sizes;
  textStyle?: TextStyle;
  iconStyle?: TextStyle;
  activeOpacity?: number;
  action?: Action<ButtonProps>;
  onLongPressAction?: Action<ButtonProps>;
};

export type CheckboxProps = {
  isChecked?: boolean;
  style?: ViewStyle;
};

export type ReviewsSummaryProps = {
  average?: number;
  count?: {
    [key in 1 | 2 | 3 | 4 | 5]?: number;
  };
  total_reviews?: number;
  large?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  activeColor?: string;
  seeAllText?: string;
};

export type TabNavigationProps = {
  data?: any;
  setData?: any;
  tabs: {
    id?: string;
    path?: string;
    title?: string;
    icon?: string;
    content: ScreenDrawerComponent[];
  }[];
};

export interface ImageProps extends DefaultImageProps {
  source?: DefaultImageProps["source"];
  style?: DefaultImageProps["style"];

  /**
   * The source of the Image
   *
   * @example
   *
   * source="https://myImage";
   * source=require("./assets/images/icon.png");
   *
   * @default
   *
   * undefined
   *
   *
   */
  badge?: {
    icon?: string;
    color?: string;
    text?: string;
    image?: string;

    /**
     * @default 'top-left'
     */
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  };
}

export interface InputProps {
  title?: string;
  placeholder?: string;
  type:
    | "text"
    | "checkbox"
    | "number"
    | "date"
    | "time"
    | "datetime"
    | "phone"
    | "address"
    | "email"
    | "password"
    | "textarea"
    | "html";

  link?: string;
  size?: keyof typeof sizes;
  required?: boolean | 0 | 1;
  value?: any;
  onChange?: (newValue: any) => void;
  box_id?: string;
  suffix?: {
    text?: string;
    icon?: string;
  };
  trigger?: {
    value?: any; // string, boolean, number, *maybe objects
    target: string | string[]; //Or object {}
  };
}

export interface VideoPlayerProps {
  onTimeUpdate?: (timeUpdate: { current: number; total: number }) => void;
  type?: "youtube" | "vimeo";
  videoId?: string;
  currentTime?: number;
  link?: string;
}

export interface ScrollViewProps extends DefaultScrollViewProps {
  scrollY?: any;
}

export interface TextInputProps extends DefaultTextInputProps {
  size?: keyof typeof sizes;
  bold?: boolean;
}

export interface SliderProps {
  style?: ViewStyle;
  data?: any[];
  renderItem?: any;
  width?: number;
  height?: number;
  isLoading?: boolean;
}

export type SelectProps = {
  /**
   *
   * The title of the accordion
   * If undefined the title is not visible
   *
   */
  title?: string;
  /**
   *
   * The placeholder of the accordion
   *
   * @default 'Select an element'
   */
  placeholder?: string;

  /**
   *
   * Object of items
   *
   * @default {}
   *
   */
  items?: {
    [key: string]:
      | string
      | {
          text: string;
          color?: string;
          /**
           * @default 'bullet'
           */
          type?: "bullet" | "filled";
          /**
           *
           *
           *
           */
          textColor?: string;
        };
  };

  /**
   * Type of the Select, multiselect will show checkbox
   *
   * @default 'select'
   */

  type?: "select" | "multiselect" | "state";

  /**
   * The keys of the selected item
   *
   * @example 'paypal'
   *
   * @example ['paypal','google','apple']
   */

  selected?: string | string[];
  required?: boolean | 1 | 0;
  onChange?: (newValue?: string) => void;
  style?: ViewStyle;
};

export type ModuleProps = {
  module?: string;
  title?: string;
  placeholder?: string;
  required?: boolean | 1 | 0;
  limit?: number;
  icon?: string;
};

export type SkeletonPlaceholderComponent = {
  height?: number;
  radius?: number;
  quantity?: number;
  size?: number;
};

export type SkeletonPlaceholderProps = {
  style?: ViewStyle;
  components: SkeletonPlaceholderComponent[];
};

export type LoadingProps = {
  style?: ViewStyle;
  skeletonPlaceholder?: SkeletonPlaceholderProps["components"];
};

export type MessageProps = {};

export type AccordionProps = {
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  children: ReactNode;
  header?: ReactNode;
  title: string;
  size?: keyof typeof sizes;
  bold?: boolean;
  color?: string;
  icon?: string;
  subtitle?: string;
  defaultStatus?: "open" | "close";
};

type ButtonsListSwitch = {
  type: "switch";
  value: boolean;
  onChange: (e: SwitchChangeEvent) => void;
};

export type ButtonsListButtonProps = {
  title?: string;
  subtitle?: string;
  /**
   * Text color of the 'text' prop
   * @default Colors.text
   */

  titleColor?: ColorValue;
  /**
   * @default Colors.gray
   */
  subtitleColor?: ColorValue;
  /**
   * Color of the chevron on the right
   */
  chevronColor?: ColorValue;

  /**
   * Background color for the icon
   */

  color?: ColorValue;
  icon?: string;

  /**
   * Background color for the field
   */

  backgroundColor?: ColorValue;
  action?: Action<ButtonsListButtonProps>;
  onLongPressAction?: Action<ButtonsListButtonProps>;

  /**
   * Render a component instead the chevron icon on the right
   *
   * @example
   * component: (buttonInfo) => {
   *  return (
   *    <View>
   *      <Text>Hello world!</Text>
   *    </View>
   *  );
   * }
   *
   * @example
   * component: {
   *  type: "switch",
   *  value: false,
   *  onChange: (e) => {}
   * }
   *
   */

  component?: ((button: ButtonsListButtonProps) => JSX.Element | undefined | null) | ButtonsListSwitch;
};

export type ButtonsListProps = {
  style?: ViewStyle;
  buttons: ButtonsListButtonProps[];

  /**
   * Info under the buttonsList
   */

  info?: string;
  /**
   * Animate the list of buttons with ReanimatedV2 FadeIn
   * @default true
   *
   */
  animated?: boolean;
};

export type GraphProps = {
  datasets: {
    /**
     * @default Colors.primary
     */
    backgroundColor?: string;
    borderColor?: string;
    pointBackgroundColor?: string;
    data?: number[];
  }[];
  labels: string[];
  action?: Action<GraphProps>;
  onLongPressAction?: Action<GraphProps>;
  style?: ViewStyle;
};

export type LinkAction = {
  type: "link";
  link?: string;
};

export type ApiAction = {
  type: "api";

  endpoint?: string;

  params?: any;

  callback?: Action<any>;
};

export type PopupAction = {
  type: "popup";
  content: ScreenDrawerComponent[];
};

export type PressAction = {
  type: "press";
  onPress: () => void;
};

export type ListenerAction = {
  type: "listener";
  event: string;
  params?: any;
};

export type PickerAction = {
  type: "picker";
  picker: "flag" | "search"; // flag, module, module_id cart type ['buyable', 'coupon']
  content: ScreenDrawerComponent[];
  callback?: Action<any>;
};

export type Action<T> = ((details?: T) => void) | LinkAction | ApiAction | PopupAction | ListenerAction | PickerAction;
