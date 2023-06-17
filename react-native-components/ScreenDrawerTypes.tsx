import { ViewStyle } from "react-native/types";

import {
  AccordionProps,
  Action,
  ButtonProps,
  ButtonsListProps,
  CartProps,
  FlatListProps,
  GraphProps,
  ImageProps,
  InputProps,
  ModuleProps,
  ReviewsSummaryProps,
  ScrollViewProps,
  SearchProps,
  SelectProps,
  SliderProps,
  TextProps,
  VideoPlayerProps,
} from "./types";
import { sizes } from "./utils/Utils";

interface Text extends TextProps {
  id?: string;
  component: "text";
  title?: string;
  image?: string;
  type?: "filled";
  subtitle?: string;
  color?: string;
  icon?: string;
  // numberOfLines?: number;
  align?: "left" | "center" | "right";
  radius?: Radius;
  action?: Action<Text>;
  margin?: Margin;
  windowSize?: number | "flex";
}

interface Button extends ButtonProps {
  id?: string;
  component: "button";
  checkData?: boolean | 0 | 1;
  margin?: Margin;
  windowSize?: number;
}

interface Input extends InputProps {
  id?: string;
  component: "input";
  windowSize?: number;
}

interface VideoPlayer extends VideoPlayerProps {
  id?: string;
  component: "video";
  windowSize?: number;
}

interface ReviewsSummary extends ReviewsSummaryProps {
  id?: string;
  component: "reviews";
  windowSize?: number;
}

interface Slider extends SliderProps {
  id?: string;
  component: "slider";
  type?: "image" | "custom";
  windowSize?: number;
}

export interface Box extends Omit<AccordionProps, "children"> {
  id?: string;
  component: "box";
  content: ScreenDrawerComponent[];
  windowSize?: number | "flex";
}

interface Image extends ImageProps {
  id?: string;
  value: ImageProps["source"];
  height?: string;
  component: "image";
  type?: "avatar";
  aspectRatio?: number;
  windowSize?: number;
}

interface Column {
  id?: string;
  component: "column";
  content: ScreenDrawerComponent[];
  margin?: Margin;
  border?: Border;
  align?: "left" | "center" | "right";
  windowSize?: number | "flex";
}

interface Row {
  id?: string;
  component: "row";
  content: ScreenDrawerComponent[];
  margin?: Margin;
  border?: Border;
  align?: "left" | "center" | "right";
  action?: Action<Row>;
  windowSize?: number;
}

interface Bullet {
  id?: string;
  component: "bullet";
  size?: keyof typeof sizes;
  color?: string;
  windowSize?: number;
}

interface Graph extends GraphProps {
  id?: string;
  component: "graph";
  windowSize?: number;
}

interface List extends FlatListProps<any> {
  id?: string;
  component: "list";
  header?: ScreenDrawerComponent[];
  footer?: ScreenDrawerComponent[];
  windowSize?: number;
}

interface Cart extends CartProps {
  id?: string;
  component: "cart";
  windowSize?: number;
}

interface Module extends ModuleProps {
  id?: string;
  component: "modulepicker";
  windowSize?: number;
}
interface Search extends SearchProps {
  id?: string;
  component: "searchpicker";
  windowSize?: number;
}

interface Select extends SelectProps {
  id?: string;
  component: "select";
  windowSize?: number;
}

interface ButtonsList extends ButtonsListProps {
  id?: string;
  component: "buttonslist";
  windowSize?: number;
}

type Margin =
  | number
  | {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };

type Border =
  | number
  | {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };

type Radius =
  | number
  | {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };

export type ScreenDrawerComponent =
  | Text
  | Button
  | Input
  | VideoPlayer
  | ReviewsSummary
  | Slider
  | Box
  | Image
  | Column
  | Row
  | Bullet
  | Graph
  | List
  | Cart
  | Module
  | Select
  | ButtonsList
  | Search;

export type ScreenDrawerProps = {
  data?: any;
  setData?: any;
  content?: ScreenDrawerComponent[];
  style?: ViewStyle;
  flatListProps?: FlatListProps<any> & { mergeParams?: any };
  scrollViewProps?: ScrollViewProps;
  scrollEnabled?: boolean;
  path?: string;
  onChange?: (details: any) => void;
  canContinue?: boolean | 0 | 1;
  drillProps?: boolean;
  hasMargin?: boolean;
};

let test: ScreenDrawerProps["content"] = [
  {
    component: "text",
    title: "Prova",
  },
  {
    component: "button",
    title: "Button",
    icon: "play",
    type: "tinted",
    role: "info",
  },
  {
    component: "input",
    type: "text",
  },
];
