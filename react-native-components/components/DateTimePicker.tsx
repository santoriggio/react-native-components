import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";

import DefaultDatePicker from "react-native-date-picker";
import formatDate from "../functions/formatDate";
import useLayout from "../hooks/useLayout";
import Text from "./Text";

interface IProps {
  date: string | number;
  onChangeDate: (newDate: Date) => void;
  mode?: "date" | "datetime" | "time";
}

function DateTimePicker({ ...props }: IProps) {
  const { spacing, radius, Colors } = useLayout();
  const [show, setShow] = useState<boolean>(false);

  const [formatted, setFormatted] = useState<any>(undefined);

  const needCheck = useRef<boolean>(true);

  useEffect(() => {
    if (typeof props.date !== "undefined" && props.date !== null && props.date !== "") {
      if (needCheck.current) {
        let toReturn = undefined;

        if (!isNaN(props.date as number)) {
          toReturn = formatDate((props.date as number) * 1000, "iso", "timestamp");
        } else {
          toReturn = formatDate(props.date, "iso", "YYYY-MM-DD hh:mm:ss");
        }

        setFormatted(toReturn);

        needCheck.current = false;
      } else {
        //E già in formato iso
        setFormatted(props.date);
      }
    }
  }, [JSON.stringify(props.date)]);

  const toggle = useCallback(() => {
    setShow((prevState) => !prevState);
  }, []);

  const onChange = (e: any) => {
    needCheck.current = false;
    props.onChangeDate(e);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        borderWidth: 1,
        borderColor: Colors.border,
        padding: spacing,
        justifyContent: "center",
        borderRadius: radius,
        height: spacing * 4.2,
      }}
      onPress={toggle}
    >
      {typeof formatted !== "undefined" && formatted !== null ? (
        <Text>{formatDate(formatted, props.mode === "date" ? "DD/MM/YYYY" : "DD/MM/YYYY hh:mm", "iso")}</Text>
      ) : (
        <Text style={{ color: Colors.gray }}>Seleziona una data</Text>
      )}
      <DefaultDatePicker
        modal
        open={show}
        theme={Colors.isDark ? "dark" : "light"}
        date={typeof formatted !== "undefined" && formatted !== null ? new Date(formatted) : new Date()}
        title="Seleziona una data"
        confirmText="Conferma"
        locale="it"
        textColor={Colors.text}
        mode={props.mode}
        cancelText="Annulla"
        onConfirm={onChange}
        onCancel={toggle}
      />
    </TouchableOpacity>
  );
}
export default DateTimePicker;
