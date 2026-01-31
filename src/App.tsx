import { ConfigProvider, Layout, theme } from "antd";
import Dashboard from "./layout/Dashboard";
import Login from "./pages/Login";
import { useAuthStore } from "./store/authStore";
import AppHeader from "./layout/AppHeader";
import { useThemeStore } from "./store/themeStore";

const { Content } = Layout;

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const session = useAuthStore((s) => s.session);
  const mode = useThemeStore((s) => s.mode);

  const authed = session && isAuthenticated();

  const algorithm =
    mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm;

  return (
    <ConfigProvider theme={{ algorithm }}>
      <Layout style={{ minHeight: "100vh" }}>
        <AppHeader />

        <Content>{authed ? <Dashboard /> : <Login />}</Content>
      </Layout>
    </ConfigProvider>
  );
}
