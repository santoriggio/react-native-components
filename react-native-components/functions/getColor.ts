type Colors = {
  [key: string]: string | { [key: string]: string };
};

function getColor(color: string, colors: Colors) {
  if (typeof color == "undefined" || color == null) return undefined;

  const splitColor = color.split(".");

  if (color[0] == "#") return color;

  if (color.indexOf("rgb") != -1) return color;

  if (splitColor.length > 0) {
    let toReturn: any = colors;

    if (typeof colors[splitColor[0]] == "undefined") {
      return colors.text;
    }

    splitColor.forEach((str) => {
      if (typeof toReturn[str] != "undefined") {
        toReturn = toReturn[str];
      }
    });

    return toReturn;
  }

  return colors.text;
}

export default getColor;
