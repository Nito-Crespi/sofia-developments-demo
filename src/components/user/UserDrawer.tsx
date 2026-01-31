import { Descriptions, Drawer, Space, Typography } from "antd";
import { useMemo } from "react";
import { useAuthStore } from "../../store/authStore";

const { Text } = Typography;

function formatMs(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function UserDrawer({ open, onClose }: Props) {
  const session = useAuthStore((s) => s.session);

  const remainingMs = useMemo(() => {
    if (!session) return 0;
    return session.expiresAt - Date.now();
  }, [session, open]);

  return (
    <Drawer
      title="Usuario"
      placement="right"
      open={open}
      onClose={onClose}
      size={360}
    >
      {!session ? (
        <Text type="secondary">No hay sesión activa.</Text>
      ) : (
        <Space orientation="vertical" size="large" style={{ width: "100%" }}>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Usuario">
              {session.user.username}
            </Descriptions.Item>
            <Descriptions.Item label="Rol">
              {session.user.role}
            </Descriptions.Item>

            <Descriptions.Item label="Expira en">
              {remainingMs > 0 ? formatMs(remainingMs) : "Expirada"}
            </Descriptions.Item>
          </Descriptions>
        </Space>
      )}
    </Drawer>
  );
}
