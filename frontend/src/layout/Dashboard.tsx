import { Layout } from "antd";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import { useAuthStore } from "../modules/auth/store/authStore";

const { Content } = Layout;
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
  }, [now]);

  if (!session) return null;

  return (
    <Layout
      style={{
        width: "100%",
        minHeight: "calc(100vh - var(--app-header-height, 64px))",
      }}
    >
      <DashboardSidebar onLogout={logout} />

      <Content style={{ padding: 24 }}>
        <Outlet />
      </Content>
    </Layout>
  );
}
