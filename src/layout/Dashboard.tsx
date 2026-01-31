import { Button, Card, Layout, Space, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../store/authStore";
import DashboardSidebar from "./DashboardSidebar";

const { Content } = Layout;
const { Title, Text } = Typography;

function formatMs(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

export default function Dashboard() {
  const session = useAuthStore((s) => s.session);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  const remainingMs = useMemo(() => {
    if (!session) return 0;
    return session.expiresAt - now;
  }, [session, now]);

  if (!session) return null;

  return (
    <Layout
      style={{
        width: "100%",
        height: "calc(100vh - var(--app-header-height, 64px))",
        background: "gray",
      }}
    >
      <DashboardSidebar onLogout={logout} />

      <Content style={{ padding: 24 }}>
        <Space
          style={{
            width: "100%",
            minHeight: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card style={{ width: 520 }}>
            <Title level={3} style={{ marginTop: 0 }}>
              Dashboard
            </Title>

            <Text>
              <Text>
                Logueado como: <b>{session.user.username}</b> (
                {session.user.role})
              </Text>
            </Text>
            <br />
            <Text type={remainingMs <= 10_000 ? "danger" : "secondary"}>
              Expira en: <b>{formatMs(remainingMs)}</b>
            </Text>

            <div style={{ marginTop: 16 }}>
              <Button danger onClick={logout}>
                Cerrar sesión
              </Button>
            </div>
          </Card>
        </Space>
      </Content>
    </Layout>
  );
}
