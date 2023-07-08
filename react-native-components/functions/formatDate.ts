import moment from "moment";
import "moment/locale/it";

export default function formatDate(
  outputFormat: string,
  date: string | Date,
  inputFormat?: string
): string {
  let momentDate: moment.Moment;

  if (inputFormat) {
    momentDate = moment(date, inputFormat);
  } else if (moment.isDate(date)) {
    momentDate = moment(date);
  } else if (moment.isMoment(date)) {
    momentDate = date;
  } else {
    momentDate = moment(date);
  }

  if (!momentDate.isValid()) {
    throw new Error("Invalid date");
  }

  momentDate.locale("it");

  switch (outputFormat) {
    case "YYYY/MM/DD":
      return momentDate.format("YYYY/MM/DD");
    case "YYYY-MM-DD":
      return momentDate.format("YYYY-MM-DD");
    case "DD/MM/YYYY":
      return momentDate.format("DD/MM/YYYY");
    case "DD-MM-YYYY":
      return momentDate.format("DD-MM-YYYY");
    case "DD/MM":
      return momentDate.format("DD/MM");
    case "YYYY-MM-DD hh:mm:ss":
      return momentDate.format("YYYY-MM-DD hh:mm:ss");
    case "DD/MM/YYYY hh:mm":
      return momentDate.format("DD/MM/YYYY hh:mm");
    case "timestamp":
      return momentDate.valueOf().toString();
    case "iso":
      return momentDate.toISOString();
    case "relative":
      return momentDate.fromNow();
    default:
      throw new Error("Invalid output format");
  }
}
