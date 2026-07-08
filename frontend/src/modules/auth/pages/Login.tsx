import { Button, Card, Form, Input, Space, Typography, message } from "antd";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";

const { Title } = Typography;

type LoginValues = {
  username: string;
  password: string;
};

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginValues) => {
    setLoading(true);
    try {
      await login(values.username.trim(), values.password);
      message.success("Sesión iniciada");
    } catch (e: any) {
      message.error(e?.message ?? "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space
      style={{
        height: "calc(100vh - var(--app-header-height, 64px))",
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Card style={{ width: 420 }}>
        <Title
          level={3}
          style={{
            marginTop: 0,
            textAlign: "center",
          }}
        >
          Iniciar sesión
        </Title>

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 16 }}>
          <Form.Item
            label="Usuario"
            name="username"
            rules={[{ required: true, message: "Debe ingresar un usuario" }]}
          >
            <Input placeholder="Ingrese su usuario" autoComplete="username" />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              { required: true, message: "Debe ingresar una contraseña" },
            ]}
          >
            <Input.Password
              placeholder="Ingrese su contraseña"
              autoComplete="current-password"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Ingresar
          </Button>
        </Form>
      </Card>
    </Space>
  );
}
