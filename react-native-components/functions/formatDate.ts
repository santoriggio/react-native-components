import moment, { isDate } from "moment";

const translate: any = {
  a: "un",
  hour: "ora",
  hours: "ore",
  year: "anno",
  years: "anni",
  months: "mesi",
  month: "mese",
  day: "giorno",
  days: "giorni",
  ago: "fa",
};

const DateOrder = [
  "YYYY/MM/DD",
  "YYYY-MM-DD",
  "DD/MM/YYYY",
  "DD-MM-YYYY",
  "DD/MM",
  "YYYY-MM-DD hh:mm:ss",
  "DD/MM/YYYY hh:mm",
  "timestamp",
  "iso",
  "relative",
] as const;

const formatDate = (date: any, output: typeof DateOrder[number], expectedInput: typeof DateOrder[number]) => {
  if (typeof date === "undefined" || date === null) return undefined;

  if (expectedInput === output) return date;

  try {
    if (
      typeof date === "string" &&
      (date as string).includes("-") === false &&
      (date as string).includes("/") === false
    ) {
      if (!isFinite(parseInt(date))) throw "Not a date";
    }

    if (output === "iso") {
      if (expectedInput === "timestamp") {
        if (typeof date === "string") return new Date(parseInt(date as string)).toISOString();

        return new Date(date).toISOString();
      }

      const separator = expectedInput.split(" ")[0].includes("/") ? "/" : "-";

      const day =
        typeof (date as string).split(" ")[0] !== "undefined" ? (date as string).split(" ")[0].split(separator) : [];
      const time =
        typeof (date as string).split(" ")[1] !== "undefined" ? (date as string).split(" ")[1].split(":") : [];

      const array = day.concat(time);

      const matrix = expectedInput
        .split(" ")[0]
        .split(separator)
        .concat(typeof expectedInput.split(" ")[1] !== "undefined" ? expectedInput.split(" ")[1].split(":") : []);

      const f = (i: "YYYY" | "DD" | "MM" | "hh" | "mm" | "ss") => {
        let toReturn = array[matrix.indexOf(i)];

        if (typeof toReturn === "undefined") {
          let a: string[] = [];
          Array.from(Array(i.length).keys()).forEach(() => a.push("0"));
          return parseInt(a.join(""));
        }

        if (toReturn.length === 1) toReturn = "0" + toReturn;

        return parseInt(toReturn);
      };

      return new Date(f("YYYY"), f("MM"), f("DD"), f("hh"), f("mm"), f("ss")).toISOString();
    }

    if (output === "relative") {
      if (expectedInput === "YYYY-MM-DD hh:mm:ss") {
        const array_i = [...expectedInput.split(" ")[0].split("-"), ...expectedInput.split(" ")[1].split(":")];
        const array_o = [...date.split(" ")[0].split("-"), ...date.split(" ")[1].split(":")];

        const f = (i: "YYYY" | "DD" | "MM" | "hh" | "mm" | "ss") => {
          let toReturn = array_o[array_i.indexOf(i)];

          if (toReturn.length === 1) toReturn = "0" + toReturn;

          return toReturn;
        };

        const relative_time = moment(new Date(f("YYYY"), f("MM") - 1, f("DD"), f("hh"), f("mm")))
          .fromNow()
          .split(" ");

        let newArray: any = [];

        relative_time.map((a: any) => {
          if (typeof translate[a] !== "undefined") {
            newArray.push(translate[a]);
          } else {
            newArray.unshift(a);
          }
        });

        return newArray.join(" ");
      }
    }

    if (output === "timestamp") {
      const separator = expectedInput.split(" ")[0].includes("/") ? "/" : "-";

      const day =
        typeof (date as string).split(" ")[0] !== "undefined" ? (date as string).split(" ")[0].split(separator) : [];
      const time =
        typeof (date as string).split(" ")[1] !== "undefined" ? (date as string).split(" ")[1].split(":") : [];

      const array = day.concat(time);

      const matrix = expectedInput
        .split(" ")[0]
        .split(separator)
        .concat(typeof expectedInput.split(" ")[1] !== "undefined" ? expectedInput.split(" ")[1].split(":") : []);

      const f = (i: "YYYY" | "DD" | "MM" | "hh" | "mm" | "ss") => {
        let toReturn = array[matrix.indexOf(i)];

        if (typeof toReturn === "undefined") {
          let a: string[] = [];
          Array.from(Array(i.length).keys()).forEach(() => a.push("0"));
          return parseInt(a.join(""));
        }

        if (toReturn.length === 1) toReturn = "0" + toReturn;

        return parseInt(toReturn);
      };

      return new Date(f("YYYY"), f("MM"), f("DD"), f("hh"), f("mm"), f("ss")).getTime();
    }

    if (expectedInput === "timestamp" || expectedInput === "iso") {
      const d = new Date(date);

      //if (output === "timestamp") return d.getTime();

      if (output === "DD/MM/YYYY hh:mm") {
        const separator = output.includes("/") ? "/" : "-";
        const day = [f(d.getDate()), f(d.getMonth() + 1), d.getFullYear()];
        const time = [f(d.getHours()), f(d.getMinutes())];

        return `${day.join(separator)} ${time.join(":")}`;
      }

      if (output === "DD/MM/YYYY" || output === "DD-MM-YYYY") {
        const separator = output.includes("/") ? "/" : "-";
        const newDate = [d.getDate(), d.getMonth() + 1, d.getFullYear()];

        return newDate.join(separator);
      }

      if (output === "YYYY/MM/DD" || output === "YYYY-MM-DD") {
        const separator = output.includes("/") ? "/" : "-";
        const newDate = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
        return newDate.join(separator);
      }
    }

    if (expectedInput === "YYYY-MM-DD hh:mm:ss") {
      if (date === "0000-00-00 00:00:00") return "Infinito";

      const day = (date as string).split(" ")[0];
      const time = (date as string).split(" ")[1];

      const inputSeparator = day.includes("/") ? "/" : "-";
      const outputSeparator = output.includes("/") ? "/" : "-";

      if (output === "DD/MM/YYYY hh:mm") {
        return day.split(inputSeparator).reverse().join(outputSeparator) + " " + time.split(":").slice(0, 2).join(":");
      }

      if (output === "DD/MM") {
        return day.split(inputSeparator).reverse().slice(0, 2).join(outputSeparator);
      }

      if (output === "DD-MM-YYYY" || output === "DD/MM/YYYY") {
        return day.split(inputSeparator).reverse().join(outputSeparator);
      }
    }

    const inputSeparator = expectedInput.includes("/") ? "/" : "-";
    const outputSeparator = output.includes("/") ? "/" : "-";

    let str = (date as string).split(inputSeparator);

    if (expectedInput.split(inputSeparator)[0] !== output.split(outputSeparator)[0]) str.reverse();

    if (output === "DD/MM") str.splice(0, 2);

    return str.join(outputSeparator);
  } catch (error) {
    if (typeof error === "string") return error;

    return "Error!";
  }
};

export default formatDate;

const f = (input: number) => {
  if (input.toString().length === 1) return "0" + input;

  return input;
};
