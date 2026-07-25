import {
  Table,
  Space,
  Button,
  Input,
  Select,
  Row,
  Col,
  Card,
  Statistic,
  Progress,
} from "antd";
import {
  SearchOutlined,
  DollarOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import type { Project } from "../dto/project.dto";
import { loadSampleProjects } from "../data/sampleProjects";
import { formatCurrency } from "../../../utils/Formatters";
import { PRIORITY_LABELS, STATUS_LABELS } from "../constants";
import { getProjectTableColumns } from "../config/tableColumns";

type Props = {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onView?: (project: Project) => void;
};

export default function ProjectsTable({
  projects,
  onEdit,
  onDelete,
  onView,
}: Props) {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<Project["status"] | "all">(
    "all",
  );
  const [priorityFilter, setPriorityFilter] = useState<
    Project["priority"] | "all"
  >("all");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        searchText === "" ||
        project.name.toLowerCase().includes(searchText.toLowerCase()) ||
        project.code.toLowerCase().includes(searchText.toLowerCase()) ||
        project.client.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" || project.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [projects, searchText, statusFilter, priorityFilter]);

  const statistics = useMemo(() => {
    const total = projects.length;
    const inProgress = projects.filter(
      (p) => p.status === "in_progress",
    ).length;
    const completed = projects.filter((p) => p.status === "completed").length;
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const totalCost = projects.reduce((sum, p) => sum + p.currentCost, 0);
    const totalRevenue = projects.reduce(
      (sum, p) => sum + p.paymentsReceived,
      0,
    );

    return {
      total,
      inProgress,
      completed,
      totalBudget,
      totalCost,
      totalRevenue,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [projects]);

  const columns = useMemo(
    () => getProjectTableColumns({ onEdit, onDelete, onView }),
    [onEdit, onDelete, onView],
  );

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Estadísticas */}
      <Button
        onClick={() => {
          loadSampleProjects();
          window.location.reload();
        }}
      >
        Cargar Datos de Prueba
      </Button>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Proyectos"
              value={statistics.total}
              prefix={<ProjectOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="En Progreso"
              value={statistics.inProgress}
              prefix={<ClockCircleOutlined />}
              styles={{ content: { color: "#1890ff" } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completados"
              value={statistics.completed}
              prefix={<CheckCircleOutlined />}
              styles={{ content: { color: "#52c41a" } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tasa de Completación"
              value={statistics.completionRate}
              precision={1}
              suffix="%"
            />
            <Progress
              percent={statistics.completionRate}
              showInfo={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Presupuesto Total"
              value={statistics.totalBudget}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Costos Totales"
              value={statistics.totalCost}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrency(Number(value))}
              styles={{ content: { color: "#ff4d4f" } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Ingresos Totales"
              value={statistics.totalRevenue}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrency(Number(value))}
              styles={{ content: { color: "#52c41a" } }}
            />
          </Card>
        </Col>
      </Row>
      {/* Filtros */}
      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Buscar por nombre, código o cliente"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: "100%" }}
              placeholder="Filtrar por estado"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: "Todos los estados", value: "all" },
                ...Object.entries(STATUS_LABELS).map(([value, label]) => ({
                  label,
                  value,
                })),
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: "100%" }}
              placeholder="Filtrar por prioridad"
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[
                { label: "Todas las prioridades", value: "all" },
                ...Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
                  label,
                  value,
                })),
              ]}
            />
          </Col>
        </Row>
      </Card>
      {/* Tabla */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredProjects}
          rowKey="id"
          scroll={{ x: 1800 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total: ${total} proyectos`,
          }}
        />
      </Card>
    </Space>
  );
}
