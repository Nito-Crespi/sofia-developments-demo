import { Button, Card, Form, Input, Select, Space, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "../../../data/usersDb";
import { useEmployeesStore, type EmployeeFormData } from "../store/employeesStore";

const { Title } = Typography;

const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: "Administrador", value: "admin" },
  { label: "Finanzas", value: "finance" },
  { label: "Ingeniería", value: "engineer" },
];

export default function EmployeeCreatePage() {
  const navigate = useNavigate();
  const create = useEmployeesStore((s) => s.create);
  const [form] = Form.useForm<EmployeeFormData>();

  const onFinish = (values: EmployeeFormData) => {
    create(values);
    message.success("Empleado creado");
    form.resetFields();
    navigate("/employees/profiles");
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Title level={3} style={{ margin: 0 }}>
        Agregar empleado
      </Title>
      <Card style={{ maxWidth: 640 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ role: "engineer" as UserRole }}
        >
          <Form.Item
            name="fullName"
            label="Nombre completo"
            rules={[{ required: true, message: "Requerido" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Usuario"
            rules={[{ required: true, message: "Requerido" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Rol"
            rules={[{ required: true, message: "Requerido" }]}
          >
            <Select options={ROLE_OPTIONS} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Requerido" },
              { type: "email", message: "Email inválido" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Teléfono"
            rules={[{ required: true, message: "Requerido" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="department"
            label="Departamento"
            rules={[{ required: true, message: "Requerido" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="position"
            label="Puesto"
            rules={[{ required: true, message: "Requerido" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Space>
  );
}
