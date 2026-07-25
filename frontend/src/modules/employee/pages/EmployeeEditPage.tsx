import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UserRole } from "../../../data/usersDb";
import type { EmployeeRecord } from "../data/employeesDb";
import {
  useEmployeesStore,
  type EmployeeFormData,
} from "../store/employeesStore";

const { Title } = Typography;

const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: "Administrador", value: "admin" },
  { label: "Finanzas", value: "finance" },
  { label: "Ingeniería", value: "engineer" },
];

export default function EmployeeEditPage() {
  const employees = useEmployeesStore((s) => s.employees);
  const updateEmployee = useEmployeesStore((s) => s.update);
  const deleteEmployee = useEmployeesStore((s) => s.delete);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EmployeeRecord | null>(null);
  const [form] = Form.useForm<EmployeeFormData>();

  const openEdit = (record: EmployeeRecord) => {
    setEditing(record);
    form.setFieldsValue({
      fullName: record.fullName,
      username: record.username,
      role: record.role,
      email: record.email,
      phone: record.phone,
      department: record.department,
      position: record.position,
    });
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (!editing) return;
      updateEmployee(editing.id, values);
      message.success("Empleado actualizado");
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
    } catch {
      /* validation failed */
    }
  };

  const handleDelete = (id: string) => {
    deleteEmployee(id);
    message.success("Empleado eliminado");
  };

  const columns: ColumnsType<EmployeeRecord> = useMemo(
    () => [
      { title: "Nombre", dataIndex: "fullName", key: "fullName" },
      { title: "Usuario", dataIndex: "username", key: "username" },
      { title: "Rol", dataIndex: "role", key: "role" },
      { title: "Departamento", dataIndex: "department", key: "department" },
      {
        title: "Acciones",
        key: "actions",
        width: 200,
        render: (_, record) => (
          <Space>
            <Button type="link" onClick={() => openEdit(record)}>
              Editar
            </Button>
            <Popconfirm
              title="¿Eliminar este empleado?"
              okText="Sí"
              cancelText="No"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="link" danger>
                Eliminar
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [],
  );

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Title level={3} style={{ margin: 0 }}>
        Editar / eliminar empleados
      </Title>
      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={employees}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <Modal
        title="Editar empleado"
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        okText="Guardar"
        cancelText="Cancelar"
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="fullName" label="Nombre completo" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="username" label="Usuario" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Rol" rules={[{ required: true }]}>
            <Select options={ROLE_OPTIONS} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true }, { type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Teléfono" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="department" label="Departamento" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="position" label="Puesto" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
