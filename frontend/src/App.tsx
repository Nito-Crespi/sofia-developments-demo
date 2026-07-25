import { ConfigProvider, Layout, theme } from "antd";
import AppHeader from "./layout/AppHeader";
import { useThemeStore } from "./store/themeStore";
import { darkTheme, lightTheme } from "./theme/token";
import AppRoutes from "./routes/Routes";

const { Content } = Layout;

export default function App() {
  const mode = useThemeStore((s) => s.mode);
  const isDark = mode === "dark";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: isDark ? darkTheme.token : lightTheme.token,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <AppHeader />
        <Content>
          <AppRoutes />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
