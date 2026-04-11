import { useEffect, useMemo, useState } from "react";
import { Card, Col, Empty, List, Row, Space, Tag, Typography } from "antd";
import type { EmployeeRecord } from "../data/employeesDb";
import { useEmployeesStore } from "../store/employeesStore";

const { Title, Text } = Typography;

type ProfileFieldProps = {
  label: string;
  value: string;
};

function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <Space direction="vertical" size={0}>
      <Text type="secondary">{label}</Text>
      <Text strong>{value}</Text>
    </Space>
  );
}

export default function EmployeeProfilePage() {
  const employees = useEmployeesStore((s) => s.employees);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    employees[0]?.id ?? null,
  );

  useEffect(() => {
    if (employees.length === 0) {
      setSelectedEmployeeId(null);
      return;
    }
    const stillExists = employees.some((e) => e.id === selectedEmployeeId);
    if (!stillExists) {
      setSelectedEmployeeId(employees[0]?.id ?? null);
    }
  }, [employees, selectedEmployeeId]);

  const selectedEmployee: EmployeeRecord | null = useMemo(
    () => employees.find((employee) => employee.id === selectedEmployeeId) ?? null,
    [employees, selectedEmployeeId],
  );

  return (
    <Row gutter={16} style={{ width: "100%" }}>
      <Col xs={24} lg={16} xl={18}>
        <Card>
          {selectedEmployee ? (
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Space
                style={{ width: "100%", justifyContent: "space-between" }}
                align="start"
              >
                <div>
                  <Title level={3} style={{ margin: 0 }}>
                    {selectedEmployee.fullName}
                  </Title>
                  <Text type="secondary">@{selectedEmployee.username}</Text>
                </div>
                <Tag color="blue">{selectedEmployee.role.toUpperCase()}</Tag>
              </Space>

              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <ProfileField label="Email" value={selectedEmployee.email} />
                </Col>
                <Col xs={24} md={12}>
                  <ProfileField label="Teléfono" value={selectedEmployee.phone} />
                </Col>
                <Col xs={24} md={12}>
                  <ProfileField
                    label="Departamento"
                    value={selectedEmployee.department}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <ProfileField label="Puesto" value={selectedEmployee.position} />
                </Col>
              </Row>
            </Space>
          ) : (
            <Empty description="Seleccione un empleado para ver el perfil" />
          )}
        </Card>
      </Col>

      <Col xs={24} lg={8} xl={6}>
        <Card title="Empleados">
          <List
            dataSource={employees}
            renderItem={(employee) => (
              <List.Item
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    employee.id === selectedEmployeeId ? "rgba(22, 119, 255, 0.08)" : "transparent",
                  paddingInline: 12,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
                onClick={() => setSelectedEmployeeId(employee.id)}
              >
                <Text strong={employee.id === selectedEmployeeId}>
                  {employee.fullName}
                </Text>
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
}
