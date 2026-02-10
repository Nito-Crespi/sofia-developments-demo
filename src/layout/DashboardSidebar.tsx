import { Layout, Menu, theme } from "antd";
import type { MenuProps } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  DollarOutlined,
  ProjectOutlined,
  LogoutOutlined,
  BarChartOutlined,
  FileOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebarStore } from "../store/sidebarStore";
import { useAuthStore } from "../modules/auth/store/authStore";

const { Sider } = Layout;

type Props = {
  onLogout: () => void;
};

export default function DashboardSidebar({ onLogout }: Props) {
  // TODO: Transformar en un tipo de datos los 'menuItem'
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);

  const session = useAuthStore((s) => s.session);
  const allowed = session?.user.menus ?? [];

  const can = (k: string) => allowed.includes(k as any);

  const items = useMemo<MenuProps["items"]>(() => {
    const result: MenuProps["items"] = [
      {
        key: "toggle",
        icon: collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
        label: collapsed ? "Desplegar" : "Minimizar",
        onClick: toggle,
      },
      { type: "divider" },
    ];

    if (can("dashboard")) {
      result.push({
        key: "/dashboard",
        icon: <DashboardOutlined />,
        label: "Dashboard",
        onClick: () => navigate("/dashboard"),
      });
    }

    if (can("finance")) {
      result.push({
        key: "finance",
        icon: <DollarOutlined />,
        label: "Finanzas",
        children: [
          {
            key: "/finance/summary",
            icon: <ApartmentOutlined />,
            label: "Resumen",
            onClick: () => navigate("/finance/summary"),
          },
          {
            key: "/finance/reports",
            icon: <BarChartOutlined />,
            label: "Reportes",
            onClick: () => navigate("/finance/reports"),
          },
        ],
      });
    }

    if (can("projects")) {
      result.push({
        key: "projects",
        icon: <ProjectOutlined />,
        label: "Proyectos",
        children: [
          {
            key: "/projects/constructions",
            icon: <ApartmentOutlined />,
            label: "Construcciones",
            onClick: () => navigate("/projects/constructions"),
          },
          {
            key: "/projects/reports",
            icon: <BarChartOutlined />,
            label: "Reportes",
            onClick: () => navigate("/projects/reports"),
          },
          {
            key: "/projects/files",
            icon: <FileOutlined />,
            label: "Archivos",
            onClick: () => navigate("/projects/files"),
          },
        ],
      });
    }

    result.push(
      { type: "divider" },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Logout",
        onClick: onLogout,
        danger: true,
      },
    );

    return result;
  }, [allowed, collapsed, toggle, onLogout, navigate]);

  const selectedKeys = useMemo(() => {
    const p = location.pathname;
    return [p];
  }, [location.pathname]);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={240}
      collapsedWidth={80}
      style={{
        background: token.colorBgContainer,
        borderRight: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        items={items}
        selectedKeys={selectedKeys}
        style={{
          background: "transparent",
          borderInlineEnd: "none",
          paddingTop: 8,
        }}
      />
    </Sider>
  );
}
