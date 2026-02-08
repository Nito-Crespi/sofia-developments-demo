import type { ThemeConfig } from "antd";

export const BRAND = {
  gold: "#CDA659",
  navy: "#10243D",
  blue: "#303956",
  gray: "#EBECF0",
};

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: BRAND.gold,
    colorInfo: BRAND.blue,

    colorBgBase: "#ffffff",
    colorBgLayout: BRAND.gray,
    colorTextBase: BRAND.navy,

    colorBorder: "#D6D8E0",

    borderRadius: 8,
  },
};

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: BRAND.gold,
    colorInfo: BRAND.gold,

    colorBgBase: "#0B1220",
    colorBgLayout: BRAND.navy,
    colorTextBase: "#E9EDF5",

    colorBorder: "#2A3550",

    borderRadius: 8,
  },
};
