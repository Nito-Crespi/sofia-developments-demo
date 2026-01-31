import { Layout, Space, Typography, theme, Button, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import ThemeToggle from "../components/theme/ThemeToggle";
import UserDrawer from "../components/user/UserDrawer";
import { useAuthStore } from "../store/authStore";
import WeatherBadge from "../components/weather/WeatherBadge";

const { Header } = Layout;
const { Text } = Typography;

export default function AppHeader() {
  const APP_DISPLAY_NAME = import.meta.env.VITE_APP_DISPLAY_NAME;
  const { token } = theme.useToken();

  const session = useAuthStore((s) => s.session);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: 16,
          background: token.colorBgContainer,
          color: token.colorText,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          height: 64,
        }}
        id="app-header"
      >
        <Text style={{ color: token.colorText }}>{APP_DISPLAY_NAME}</Text>

        <Space>
          {/* TODO: Hay que hacer que cada icon este separado por un '|' que la solucion sea mas elegante que hardcodearlo a mano */}
          <WeatherBadge />
          <>|</>
          <ThemeToggle />
          <>|</>
          {session ? (
            <Tooltip title="Cuenta">
              <Button
                shape="circle"
                type="text"
                icon={<UserOutlined />}
                onClick={() => setDrawerOpen(true)}
              />
            </Tooltip>
          ) : null}
        </Space>
      </Header>

      {session ? (
        <UserDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      ) : null}
    </>
  );
}
