import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import keyExist from "../functions/keyExist";
import useLayout from "../hooks/useLayout";
import { Box, ScreenDrawerComponent, ScreenDrawerProps } from "../ScreenDrawerTypes";
import Button from "./Button";
import Icon from "./Icon";
import Input from "./Input";
import ReviewsSummary from "./ReviewsSummary";
import Slider from "./Slider";
import Text from "./Text";
import VideoPlayer from "./VideoPlayer";
import Accordion from "./Accordion";
import Image from "./Image";
import Graph from "./Graph";
import FlatList from "./FlatList";
import Cart from "./Cart";
import ScrollView from "./ScrollView";
import Module from "./Module";
import Select from "./Select";
import triggerAction from "../functions/triggerAction";
import ButtonsList from "./ButtonsList";
import Bullet from "./Bullet";
import AppSettings from "../utils/AppSettings";
import deepMerge from "../functions/deepMerge";
import { color } from "react-native-reanimated";
import getColor from "../functions/getColor";

interface I {
  data?: any;
  style?: (component: ScreenDrawerComponent) => void;
  component: ScreenDrawerComponent;
  box_id?: string;
  value?: any;
  parent?: ScreenDrawerComponent;
  onChange?: (component: ScreenDrawerComponent, newValue: any, box_id?: string) => void;
  canContinue?: boolean | 0 | 1;
}

const RenderComponent = memo(({ component, ...props }: I) => {
  const { spacing, icon_size, fontSize, radius, Colors } = useLayout();

  const customStyle = useMemo(() => {
    // @ts-ignore
    const margin = keyExist<any>(component.margin);
    // @ts-ignore
    const border = keyExist<any>(component.border);
    // @ts-ignore
    const bRadius = keyExist<any>(component.radius);

    let toReturn: ViewStyle = {};

    if (typeof margin != "undefined") {
      if (typeof margin == "number") {
        toReturn.margin = spacing * margin;
      } else {
        if (typeof margin.top != "undefined" && margin.top >= 0) {
          toReturn.marginTop = margin.top * spacing;
        }
        if (typeof margin.bottom != "undefined" && margin.bottom >= 0) {
          toReturn.marginBottom = margin.bottom * spacing;
        }
        if (typeof margin.left != "undefined" && margin.left >= 0) {
          toReturn.marginLeft = margin.left * spacing;
        }
        if (typeof margin.right != "undefined" && margin.right >= 0) {
          toReturn.marginRight = margin.right * spacing;
        }
      }
    }

    if (typeof border != "undefined") {
      toReturn.borderColor = Colors.border;

      if (typeof border == "number") {
        toReturn.padding = spacing;
        toReturn.borderWidth = border;
      } else {
        if (typeof border.top != "undefined" && border.top >= 0) {
          toReturn.paddingTop = spacing;
          toReturn.borderTopWidth = border.top;
        }
        if (typeof border.bottom != "undefined" && border.bottom >= 0) {
          toReturn.paddingBottom = spacing;
          toReturn.borderBottomWidth = border.bottom;
        }
        if (typeof border.left != "undefined" && border.left >= 0) {
          toReturn.paddingLeft = spacing;
          toReturn.borderLeftWidth = border.left;
        }
        if (typeof border.right != "undefined" && border.right >= 0) {
          toReturn.paddingRight = spacing;
          toReturn.borderWidth = border.right;
        }
      }
    }

    if (typeof bRadius != "undefined") {
      if (typeof border == "number") {
        toReturn.borderRadius = bRadius * radius;
      } else {
        // if (typeof border.top != "undefined" && border.top >= 0) {
        //   toReturn.paddingTop = spacing;
        //   toReturn.borderTopWidth = border.top;
        // }
        // if (typeof border.bottom != "undefined" && border.bottom >= 0) {
        //   toReturn.paddingBottom = spacing;
        //   toReturn.borderBottomWidth = border.bottom;
        // }
        // if (typeof border.left != "undefined" && border.left >= 0) {
        //   toReturn.paddingLeft = spacing;
        //   toReturn.borderLeftWidth = border.left;
        // }
        // if (typeof border.right != "undefined" && border.right >= 0) {
        //   toReturn.paddingRight = spacing;
        //   toReturn.borderWidth = border.right;
        // }
      }
    }

    if (component.component == "row" || component.component == "text") {
      if (typeof component.align != "undefined") {
        if (component.align == "left") {
          toReturn.justifyContent = "flex-start";
        }
        if (component.align == "center") {
          toReturn.justifyContent = "center";
        }
        if (component.align == "right") {
          toReturn.justifyContent = "flex-end";
        }
      }

      if (component.component == "row") {
        toReturn.alignItems = "flex-start";
        if (typeof component.alignVertical != "undefined") {
          if (component.alignVertical == "center") {
            toReturn.alignItems = "center";
          }
        }
      }
    }

    if (component.component == "column") {
      if (
        typeof component.align != "undefined" &&
        (typeof component.windowSize == "undefined" || component.windowSize != "flex")
      ) {
        if (component.align == "left") {
          toReturn.alignSelf = "flex-start";
          toReturn.alignItems = "flex-start";
        }
        if (component.align == "center") {
          toReturn.alignSelf = "center";
          toReturn.alignItems = "center";
        }
        if (component.align == "right") {
          toReturn.alignSelf = "flex-end";
          toReturn.alignItems = "flex-end";
        }
      }
    }

    return toReturn;
  }, [JSON.stringify(component)]);

  const handleChange = useCallback(
    (newValue: any) => {
      if (typeof props.onChange != "undefined") {
        props.onChange(component, newValue, props.box_id);
      }
    },
    [JSON.stringify(component)]
  );

  switch (component.component) {
    case "input":
      return <Input value={props.value} onChange={handleChange} {...component} />;
    case "button":
      return <Button {...component} active={props.canContinue} style={customStyle} />;
    case "reviews":
      return <ReviewsSummary {...component} style={customStyle} />;
    case "slider":
      return <Slider {...component} />;
    case "text":
      const filled = typeof component.type != "undefined" && component.type == "filled";

      const textColor =
        typeof component.color != "undefined" && component.color != null
          ? getColor(component.color, Colors)
          : Colors.text;
      const subtitleColor =
        typeof component.subtitleColor != "undefined" && component.subtitleColor != null
          ? getColor(component.subtitleColor, Colors)
          : Colors.gray;

      return (
        <TouchableOpacity
          disabled={typeof component.action != "undefined" ? false : true}
          activeOpacity={typeof component.action != "undefined" ? 0.5 : 1}
          onPress={() => {
            triggerAction(component.action);
          }}
          hitSlop={{
            bottom: spacing,
            left: spacing,
            top: spacing,
            right: spacing,
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor:
              typeof component.bgColor != "undefined" && component.bgColor != null
                ? getColor(component.bgColor, Colors)
                : filled
                ? component.color
                : undefined,
            paddingHorizontal: filled ? spacing : undefined,
            paddingVertical: filled ? spacing * 0.6 : undefined,
            borderRadius: radius * 0.6,
            ...customStyle,
          }}
        >
          {typeof component.icon != "undefined" && component.icon != "" && (
            <Icon
              family="Feather"
              name={component.icon}
              color={textColor}
              style={{ width: icon_size, textAlign: "center", marginRight: spacing }}
            />
          )}

          <View
            style={{
              flex:
                typeof props.parent != "undefined" &&
                typeof props.parent.windowSize != "undefined" &&
                props.parent.windowSize == "flex"
                  ? 1
                  : undefined,
            }}
          >
            {typeof component.title != "undefined" && component.title != "" && (
              <Text
                numberOfLines={typeof component.numberOfLines != "undefined" ? component.numberOfLines : 1}
                bold={component.bold}
                size={component.size}
                style={[{ color: textColor }, component.style]}
              >
                {component.title}
              </Text>
            )}
            {typeof component.subtitle != "undefined" && component.subtitle != "" && (
              <Text numberOfLines={1} size="s" style={{ color: subtitleColor }}>
                {component.subtitle}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      );
    case "image":
      //const height = typeof component.height != "undefined" ? component.height : undefined;
      return (
        <Image
          {...component}
          style={{
            width: typeof component.type != "undefined" && component.type == "avatar" ? spacing * 6 : "100%",
            height: typeof component.type != "undefined" && component.type == "avatar" ? spacing * 6 : undefined,
            aspectRatio: component.aspectRatio,
            borderRadius: typeof component.type != "undefined" && component.type == "avatar" ? spacing * 6 : radius,
          }}
        />
      );
    case "video":
      return <VideoPlayer {...component} />;
    case "bullet":
      return <Bullet {...component} style={customStyle} />;
    case "row":
      return (
        <TouchableOpacity
          disabled={typeof component.action != "undefined" ? false : true}
          activeOpacity={typeof component.action != "undefined" ? 0.5 : 1}
          onPress={() => {
            triggerAction(component.action);
          }}
          style={{
            flexDirection: "row",
            ...customStyle,
          }}
        >
          {component.content.length > 0 &&
            component.content.map((row_component, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width: typeof row_component.windowSize == "number" ? row_component.windowSize + "%" : undefined,
                    flex:
                      typeof row_component.windowSize != "undefined" && row_component.windowSize == "flex"
                        ? 1
                        : undefined,
                  }}
                >
                  <RenderComponent component={row_component} parent={component} />
                </View>
              );
            })}
        </TouchableOpacity>
      );
    case "column":
      return (
        <View
          style={{
            borderRadius: radius,
            borderColor: Colors.border,
            padding: typeof component.border != "undefined" && component.border > 0 ? spacing : undefined,
            ...customStyle,
          }}
        >
          {component.content.length > 0 &&
            component.content.map((column_component, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width:
                      (typeof column_component.windowSize !== "undefined" ? column_component.windowSize : 100) + "%",
                  }}
                >
                  <RenderComponent component={column_component} parent={component} />
                </View>
              );
            })}
        </View>
      );
    case "graph":
      return <Graph {...component} style={customStyle} />;
    case "modulepicker":
      return <Module {...component} value={props.value} onChange={handleChange} />;
    case "select":
      return <Select {...component} selected={props.value} onChange={handleChange} />;
    case "buttonslist":
      return <ButtonsList {...component} />;
    default:
      return null;
  }
});

function ScreenDrawer({ hasMargin = true, drillProps = false, ...props }: ScreenDrawerProps) {
  const { spacing, Colors, radius, fontSize } = useLayout();
  const [hiddenComponents, setHiddenComponents] = useState<string[]>([]);

  const [canContinue, setCanContinue] = useState<boolean>(false);

  const prevData = useRef<any>({});

  const firstRender = useRef<boolean>(true);

  useEffect(() => {
    const data = typeof props.data != "undefined" && props.data != null ? props.data : {};

    props.content?.forEach((comp) => {
      if (comp.component == "box") {
        const box_data = typeof comp.id != "undefined" && typeof data[comp.id] != "undefined" ? data[comp.id] : data;
        const prev_box_data =
          typeof comp.id != "undefined" && typeof prevData.current[comp.id] != "undefined"
            ? prevData.current[comp.id]
            : prevData.current;

        comp.content.forEach((boxC) => {
          const value =
            typeof boxC.id != "undefined" &&
            typeof box_data != "undefined" &&
            box_data != null &&
            typeof box_data[boxC.id] != "undefined"
              ? box_data[boxC.id]
              : undefined;
          const prevValue =
            typeof boxC.id != "undefined" &&
            typeof prev_box_data != "undefined" &&
            prev_box_data != null &&
            typeof prev_box_data[boxC.id] != "undefined"
              ? prev_box_data[boxC.id]
              : undefined;

          if (firstRender.current || (value != prevValue && typeof comp.trigger != "undefined")) {
            triggerComponent(boxC.trigger, value, comp.id);
          }
        });
      } else {
        const value = typeof comp.id != "undefined" && typeof data[comp.id] != "undefined" ? data[comp.id] : undefined;
        const prevValue =
          typeof comp.id != "undefined" && typeof prevData.current[comp.id] != "undefined"
            ? prevData.current[comp.id]
            : undefined;

        // if (typeof comp.trigger != "undefined") console.log({ value, prevValue });

        if (firstRender.current || (value != prevValue && typeof comp.trigger != "undefined")) {
          triggerComponent(comp.trigger, value);
        }
      }
    });

    firstRender.current = false;
    prevData.current = { ...data };
  }, [JSON.stringify(props.data)]);

  useEffect(() => {
    if (typeof props.setData != "undefined") {
      const listener = AppSettings.addListener("onChangeData", (newData) => {
        if (typeof props.setData != "undefined") {
          props.setData((prevState: any) => {
            return deepMerge(prevState, newData);
          });
        }
      });

      return () => listener.remove();
    }
  }, [JSON.stringify(props.setData)]);

  useEffect(() => {
    if (typeof props.canContinue != "undefined") {
      setCanContinue(props.canContinue);
    } else {
      checkIfCanContinue();
    }
  }, [props.canContinue, JSON.stringify(props.data), JSON.stringify(props.content)]);

  const onChange = useCallback(
    (component: ScreenDrawerComponent, newValue: any, box_id?: string) => {
      let path = "";

      if (typeof component.id != "undefined") {
        path = component.id;

        if (typeof box_id != "undefined") {
          path = `${box_id}/${component.id}/`;
        }
      }

      if (typeof props.path != "undefined" && props.path != "") {
        path = props.path + "/" + path;
      }

      if (path != "" && typeof props.setData != "undefined") {
        props.setData((prevState: any) => {
          const paths = path
            .toString()
            .split("/")
            .filter((x) => x != "");
          let toReturn: any = { ...prevState };

          paths.reduce((parent, path, k, array) => {
            if (k === array.length - 1) {
              parent[path] = newValue;
            } else if (typeof parent[path] != "object") {
              parent[path] = {};
            }
            return parent[path];
          }, toReturn);

          return { ...prevState, ...toReturn };
        });
      }
    },
    [JSON.stringify(props.path)]
  );

  const shouldRender = useCallback(
    (component: any, box_id?: string) => {
      let toReturn = true;

      if (typeof hiddenComponents != "undefined" && Array.isArray(hiddenComponents)) {
        let path = "";

        if (typeof component.id != "undefined") {
          path = component.id;
        }

        if (typeof box_id != "undefined") {
          path = `${box_id}/${component.id}`;
        }

        // console.log(hiddenComponents, path, !hiddenComponents.includes(path))

        if (hiddenComponents.includes(path)) toReturn = false;
      }

      return toReturn;
    },
    [JSON.stringify(hiddenComponents)]
  );

  const checkIfCanContinue = () => {
    if (typeof props.content == "undefined" || typeof props.data == "undefined") return;

    if (!Array.isArray(props.content) || props.content.length == 0 || typeof props.onChange == "undefined") return;

    let canContinue: boolean = true;

    props.content.forEach((field) => {
      if (field.component == "text") return;

      if (field.component == "box") {
        //

        field.content.forEach((x) => {
          //@ts-ignore It's ok, but not for Typescript
          if (x.required && x.id) {
            const x_data = props.data[x.id];

            if (typeof x_data == "undefined" || x_data.toString().trim() == "") {
              canContinue = false;
            }
          }
        });
      }

      //@ts-ignore It's ok, but not for Typescript
      if (field.required && field.id) {
        let field_data = props.data[field.id];

        if (typeof field_data == "string") {
          const prefix = field_data[0];

          if (prefix == '"') {
            //is JSON

            field_data = JSON.parse(field_data);
          }
        }

        if (typeof field_data == "undefined" || field_data.toString().trim() == "") {
          canContinue = false;
        }
      }
    });

    setCanContinue(canContinue);
    return props.onChange({ canContinue });
  };

  const triggerComponent = (trigger: any, newValue: any, box_id?: string) => {
    if (typeof trigger != "undefined") {
      if (typeof trigger.target == "string") {
        setHiddenComponents((prevState) => {
          let path = typeof box_id != "undefined" ? `${box_id}/${trigger.target}` : trigger.target;

          if (typeof trigger.value != "undefined") {
            if (trigger.value == newValue) {
              return [...prevState, path];
            } else {
              return prevState.filter((x) => x != path);
            }
          }

          if (typeof trigger.value == "undefined") {
            if (prevState.includes(path)) {
              return prevState.filter((x) => x != path);
            }

            return [...prevState, path];
          }

          return [];
        });
      }

      if (Array.isArray(trigger.target) && trigger.target.length > 0) {
        setHiddenComponents((prevState) => {
          let toReturn = [...prevState];

          trigger.target.forEach((trg: string) => {
            let path = typeof box_id != "undefined" ? `${box_id}/${trg}` : trg;

            if (prevState.includes(path)) {
              toReturn = toReturn.filter((x) => x != path);
            } else {
              toReturn.push(path);
            }
          });

          // alert(JSON.stringify(toReturn))
          return toReturn;
        });
      }

      if (typeof trigger.target == "object" && !Array.isArray(trigger.target)) {
        //is object
        if (typeof newValue == "object") {
          if (typeof props.setData != "undefined") {
            props.setData((prevState: any) => {
              let toReturn = prevState;

              Object.keys(trigger.target).map((key) => {
                if (typeof prevState[key] != "undefined" && typeof newValue[key] != "undefined") {
                  toReturn = {
                    ...toReturn,
                    [key]: newValue[key],
                  };
                }
              });
            });
          }
        }
      }
    }
  };

  if (typeof props.content != "undefined" && props.content.length > 0 && props.content[0].component == "cart") {
    const cart = props.content[0];
    return (
      <Cart
        {...cart}
        data={
          typeof props.data != "undefined" && typeof cart.id != "undefined" && typeof props.data[cart.id] != "undefined"
            ? props.data[cart.id]
            : undefined
        }
        onChange={onChange}
      />
    );
  }

  if (typeof props.content != "undefined" && props.content.length > 0 && props.content[0].component == "list") {
    return (
      <FlatList
        {...props.content[0]}
        {...props.flatListProps}
        ListHeaderComponent={
          typeof props.content[0].header != "undefined" && props.content[0].header.length > 0 ? (
            <ScreenDrawer content={props.content[0].header} />
          ) : undefined
        }
        //enableDebugLogs={true}
      />
    );
  }

  if (typeof props.hasScroll != "undefined" && props.hasScroll == false) {
    return (
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", padding: hasMargin ? spacing / 2 : undefined, ...props.style }}
      >
        {typeof props.content != "undefined" &&
          props.content.length > 0 &&
          Array.isArray(props.content) &&
          props.content.map((component, index) => {
            const data = typeof props.data != "undefined" && props.data != null ? props.data : {};

            if (shouldRender(component) && component.component == "box") {
              const box_data =
                typeof component.id != "undefined" && typeof data[component.id] != "undefined"
                  ? data[component.id]
                  : data;

              return (
                <Accordion
                  key={index}
                  bold
                  size="xl"
                  {...component}
                  style={{
                    // flex: typeof component.windowSize != "undefined" && component.windowSize == "flex" ? 1 : undefined,
                    marginHorizontal: spacing * 0.5,
                    marginBottom: spacing,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      padding: spacing / 2,
                    }}
                  >
                    {component.content.length > 0 &&
                      component.content.map((box_component, box_index) => {
                        if (shouldRender(box_component, component.id)) {
                          const value =
                            typeof box_component.id != "undefined" &&
                            typeof box_data != "undefined" &&
                            box_data != null &&
                            typeof box_data[box_component.id] != "undefined"
                              ? box_data[box_component.id]
                              : undefined;

                          return (
                            <View
                              key={box_index}
                              style={{
                                width:
                                  (typeof box_component.windowSize !== "undefined" ? box_component.windowSize : 100) +
                                  "%",
                                padding: spacing / 2,
                              }}
                            >
                              <RenderComponent
                                // data={drillProps ? props.data : undefined}
                                value={value}
                                component={box_component}
                                onChange={onChange}
                                box_id={component.id}
                                parent={component}
                              />
                            </View>
                          );
                        }

                        return null;
                      })}
                  </View>
                </Accordion>
              );
            }

            const value =
              typeof component.id != "undefined" && typeof data[component.id] != "undefined"
                ? data[component.id]
                : undefined;

            if (shouldRender(component)) {
              return (
                <View
                  key={index}
                  style={{
                    width: (typeof component.windowSize !== "undefined" ? component.windowSize : 100) + "%",
                    padding: hasMargin ? spacing / 2 : undefined,
                    marginBottom: hasMargin ? spacing * 0.5 : undefined,
                  }}
                >
                  <RenderComponent
                    // data={drillProps ? props.data : undefined}
                    value={value}
                    component={component}
                    onChange={onChange}
                    canContinue={
                      component.component == "button" &&
                      typeof component.checkData != "undefined" &&
                      component.checkData == true
                        ? canContinue
                        : undefined
                    }
                  />
                </View>
              );
            }

            return null;
          })}
      </View>
    );
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={props.scrollEnabled} {...props.scrollViewProps}>
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", padding: hasMargin ? spacing / 2 : undefined, ...props.style }}
      >
        {typeof props.content != "undefined" &&
          props.content.length > 0 &&
          Array.isArray(props.content) &&
          props.content.map((component, index) => {
            const data = typeof props.data != "undefined" && props.data != null ? props.data : {};

            if (shouldRender(component) && component.component == "box") {
              const box_data =
                typeof component.id != "undefined" && typeof data[component.id] != "undefined"
                  ? data[component.id]
                  : data;

              return (
                <Accordion
                  key={index}
                  bold
                  size="xl"
                  {...component}
                  style={{
                    // flex: typeof component.windowSize != "undefined" && component.windowSize == "flex" ? 1 : undefined,
                    marginHorizontal: spacing * 0.5,
                    marginBottom: spacing,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      padding: spacing / 2,
                    }}
                  >
                    {component.content.length > 0 &&
                      component.content.map((box_component, box_index) => {
                        if (shouldRender(box_component, component.id)) {
                          const value =
                            typeof box_component.id != "undefined" &&
                            typeof box_data != "undefined" &&
                            box_data != null &&
                            typeof box_data[box_component.id] != "undefined"
                              ? box_data[box_component.id]
                              : undefined;

                          return (
                            <View
                              key={box_index}
                              style={{
                                width:
                                  (typeof box_component.windowSize !== "undefined" ? box_component.windowSize : 100) +
                                  "%",
                                padding: spacing / 2,
                              }}
                            >
                              <RenderComponent
                                // data={drillProps ? props.data : undefined}
                                value={value}
                                component={box_component}
                                onChange={onChange}
                                box_id={component.id}
                                parent={component}
                              />
                            </View>
                          );
                        }

                        return null;
                      })}
                  </View>
                </Accordion>
              );
            }

            const value =
              typeof component.id != "undefined" && typeof data[component.id] != "undefined"
                ? data[component.id]
                : undefined;

            if (shouldRender(component)) {
              return (
                <View
                  key={index}
                  style={{
                    width: (typeof component.windowSize !== "undefined" ? component.windowSize : 100) + "%",
                    padding: hasMargin ? spacing / 2 : undefined,
                    marginBottom: hasMargin ? spacing * 0.5 : undefined,
                  }}
                >
                  <RenderComponent
                    // data={drillProps ? props.data : undefined}
                    value={value}
                    component={component}
                    onChange={onChange}
                    canContinue={
                      component.component == "button" &&
                      typeof component.checkData != "undefined" &&
                      component.checkData == true
                        ? canContinue
                        : undefined
                    }
                  />
                </View>
              );
            }

            return null;
          })}
      </View>
    </ScrollView>
  );
}

export default ScreenDrawer;
