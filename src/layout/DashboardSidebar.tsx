import { Layout, Menu, theme } from "antd";
import type { MenuProps } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  DollarOutlined,
  ProjectOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BarChartOutlined,
  FileOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { useMemo } from "react";
import { useSidebarStore } from "../store/sidebarStore";
import { useAuthStore } from "../store/authStore";

const { Sider } = Layout;

type Props = {
  onLogout: () => void;
};

export default function DashboardSidebar({ onLogout }: Props) {
  const { token } = theme.useToken();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);

  const session = useAuthStore((s) => s.session);
  const allowed = session?.user.menus ?? [];

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

    const can = (k: string) => allowed.includes(k as any);

    if (can("dashboard")) {
      result.push({
        key: "dashboard",
        icon: <DashboardOutlined />,
        label: "Dashboard",
      });
    }

    if (can("finance")) {
      result.push({
        key: "finance",
        icon: <DollarOutlined />,
        label: "Finanzas",
        children: [
          {
            key: "finance:summary",
            icon: <ApartmentOutlined />,
            label: "Resumen",
          },
          {
            key: "finance:reports",
            icon: <BarChartOutlined />,
            label: "Reportes",
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
            key: "projects:constructions",
            icon: <ApartmentOutlined />,
            label: "Construcciones",
          },
          {
            key: "projects:reports",
            icon: <BarChartOutlined />,
            label: "Reportes",
          },
          { key: "projects:files", icon: <FileOutlined />, label: "Archivos" },
        ],
      });
    }

    if (can("users")) {
      result.push({
        key: "users",
        icon: <UserOutlined />,
        label: "Usuarios",
      });
    }

    if (can("settings")) {
      result.push({
        key: "settings",
        icon: <SettingOutlined />,
        label: "Configuración",
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
  }, [allowed, collapsed, toggle, onLogout]);

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
        style={{
          background: "transparent",
          borderInlineEnd: "none",
          paddingTop: 8,
        }}
      />
    </Sider>
  );
}
