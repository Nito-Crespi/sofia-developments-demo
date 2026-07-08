import { Button, Tooltip } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useThemeStore } from "../../store/themeStore";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const mode = useThemeStore((s) => s.mode);
  const toggle = useThemeStore((s) => s.toggle);

  const isLight = mode === "light";

  return (
    <Tooltip title={isLight ? "Modo oscuro" : "Modo claro"}>
      <Button
        className={styles.themeToggleButton}
        shape="circle"
        type="text"
        onClick={toggle}
        icon={isLight ? <MoonOutlined /> : <SunOutlined />}
        style={{
          fontSize: 18,
          display: "flex",
          alignItems: "center",
        }}
      />
    </Tooltip>
  );
}
