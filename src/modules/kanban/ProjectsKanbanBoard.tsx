import {
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  Progress,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import type { MenuProps } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import type { DragEventHandler } from "react";
import type { Project } from "../project/dto/project.dto";
import { formatCurrency, formatDate } from "../../utils/Formatters";
import {
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
} from "../project/constants";

const { Text, Title } = Typography;

type Props = {
  projects: Project[];
  onMove: (projectId: string, nextStatus: Project["status"]) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onView: (project: Project) => void;
};

type DragPayload = {
  id: string;
};

function safeParseDragPayload(raw: string | null): DragPayload | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.id === "string") return { id: parsed.id };
    return null;
  } catch {
    return null;
  }
}

export default function ProjectsKanbanBoard({
  projects,
  onMove,
  onEdit,
  onDelete,
  onView,
}: Props) {
  const { token } = theme.useToken();

  const [searchText, setSearchText] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<
    Project["priority"] | "all"
  >("all");
  const [managerFilter, setManagerFilter] = useState<string | "all">("all");

  const managers = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.projectManager) set.add(p.projectManager);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesSearch =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q);

      const matchesPriority =
        priorityFilter === "all" || p.priority === priorityFilter;

      const matchesManager =
        managerFilter === "all" || p.projectManager === managerFilter;

      return matchesSearch && matchesPriority && matchesManager;
    });
  }, [projects, searchText, priorityFilter, managerFilter]);

  const byStatus = useMemo(() => {
    const result: Record<Project["status"], Project[]> = {
      planning: [],
      in_progress: [],
      paused: [],
      completed: [],
      cancelled: [],
    };
    filtered.forEach((p) => result[p.status].push(p));

    (Object.keys(result) as Project["status"][]).forEach((k) => {
      result[k].sort((a, b) => {
        // Urgentes primero, luego por updatedAt desc
        const prioWeight: Record<Project["priority"], number> = {
          urgent: 4,
          high: 3,
          medium: 2,
          low: 1,
        };
        const d = prioWeight[b.priority] - prioWeight[a.priority];
        if (d !== 0) return d;
        return (b.updatedAt || "").localeCompare(a.updatedAt || "");
      });
    });

    return result;
  }, [filtered]);

  const stats = useMemo(() => {
    const total = projects.length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalCost = projects.reduce(
      (sum, p) => sum + (p.currentCost || 0),
      0,
    );
    const completionRate =
      total === 0
        ? 0
        : (projects.filter((p) => p.status === "completed").length / total) *
          100;

    return { total, totalBudget, totalCost, completionRate };
  }, [projects]);

  const columns: Project["status"][] = useMemo(
    () => ["planning", "in_progress", "paused", "completed", "cancelled"],
    [],
  );

  return (
    <Space orientation="vertical" size="large" style={{ width: "100%" }}>
      {/* Filtros + KPIs */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={8}>
          <Card>
            <Space
              orientation="vertical"
              style={{ width: "100%" }}
              size="small"
            >
              <Text type="secondary">Proyectos</Text>
              <Title level={3} style={{ margin: 0 }}>
                {stats.total}
              </Title>
              <Progress
                percent={Math.min(100, stats.completionRate)}
                size="small"
              />
              <Text type="secondary">
                {stats.completionRate.toFixed(1)}% completados
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card>
            <Space
              orientation="vertical"
              style={{ width: "100%" }}
              size="small"
            >
              <Text type="secondary">Presupuesto total</Text>
              <Title level={4} style={{ margin: 0 }}>
                {formatCurrency(stats.totalBudget)}
              </Title>
              <Text type="secondary">Costos actuales</Text>
              <Title level={5} style={{ margin: 0, color: token.colorError }}>
                {formatCurrency(stats.totalCost)}
              </Title>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card>
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12}>
                <Input
                  placeholder="Buscar (nombre, código, cliente, ubicación)"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>

              <Col xs={24} sm={12}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Prioridad"
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  options={[
                    { label: "Todas", value: "all" },
                    ...Object.entries(PRIORITY_LABELS).map(
                      ([value, label]) => ({
                        label,
                        value,
                      }),
                    ),
                  ]}
                />
              </Col>

              <Col xs={24}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Gerente"
                  value={managerFilter}
                  onChange={setManagerFilter}
                  options={[
                    { label: "Todos", value: "all" },
                    ...managers.map((m) => ({ label: m, value: m })),
                  ]}
                  showSearch
                  optionFilterProp="label"
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Tablero */}
      <div
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          paddingBottom: 8,
        }}
      >
        {columns.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            title={STATUS_LABELS[status]}
            color={STATUS_COLORS[status]}
            projects={byStatus[status]}
            token={token}
            onDropProject={(id) => onMove(id, status)}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </div>
    </Space>
  );
}

// TODO: Reemplazar los <div> por tags smarts de AntD

function KanbanColumn({
  title,
  color,
  projects,
  token,
  onDropProject,
  onEdit,
  onDelete,
  onView,
}: {
  status: Project["status"];
  title: string;
  color: string;
  projects: Project[];
  token: any;
  onDropProject: (id: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onView: (project: Project) => void;
}) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave: DragEventHandler<HTMLDivElement> = () => {
    setIsOver(false);
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsOver(false);
    const payload = safeParseDragPayload(
      e.dataTransfer.getData("application/json"),
    );
    if (!payload?.id) return;
    onDropProject(payload.id);
  };

  return (
    <div style={{ minWidth: 320, maxWidth: 360, flex: "0 0 auto" }}>
      <Card
        size="small"
        styles={{
          body: {
            padding: 12,
            background: isOver ? token.colorFillQuaternary : undefined,
          },
        }}
        title={
          <Space
            align="center"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <Space>
              <Tag color={color}>{title}</Tag>
              <Badge
                count={projects.length}
                showZero
                style={{ backgroundColor: token.colorPrimary }}
              />
            </Space>
          </Space>
        }
      >
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            minHeight: 100,
          }}
        >
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}

          {projects.length === 0 && (
            <Text type="secondary" style={{ padding: 8 }}>
              Arrastrá proyectos acá.
            </Text>
          )}
        </div>
      </Card>
    </div>
  );
}

function ProjectCard({
  project,
  onEdit,
  onDelete,
  onView,
}: {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onView: (project: Project) => void;
}) {
  const costPct =
    project.budget > 0 ? (project.currentCost / project.budget) * 100 : 0;

  const menuItems: MenuProps["items"] = [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "Ver",
      onClick: () => onView(project),
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Editar",
      onClick: () => onEdit(project),
    },
    { type: "divider" },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      danger: true,
      label: "Eliminar",
      onClick: () => onDelete(project.id),
    },
  ];

  const handleDragStart: DragEventHandler<HTMLDivElement> = (e) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ id: project.id } satisfies DragPayload),
    );
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div draggable onDragStart={handleDragStart}>
      <Card
        size="small"
        hoverable
        styles={{ body: { padding: 12 } }}
        onClick={() => onView(project)}
      >
        <Space orientation="vertical" size={6} style={{ width: "100%" }}>
          <Space
            style={{ width: "100%", justifyContent: "space-between" }}
            align="start"
          >
            <Space orientation="vertical" size={0} style={{ minWidth: 0 }}>
              <Text strong style={{ lineHeight: 1.2 }}>
                {project.name}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {project.code} · {project.client}
              </Text>
            </Space>

            <Dropdown
              menu={{
                items: menuItems,
                onClick: ({ domEvent }) => domEvent.stopPropagation(),
              }}
              trigger={["click"]}
            >
              <span onClick={(e) => e.stopPropagation()}>
                <Button
                  type="text"
                  size="small"
                  icon={<MoreOutlined />}
                  onClick={(e) => e.stopPropagation()}
                />
              </span>
            </Dropdown>
          </Space>

          <Space wrap size={[6, 6]}>
            <Tag color={PRIORITY_COLORS[project.priority]}>
              {PRIORITY_LABELS[project.priority]}
            </Tag>
            <Tooltip title={`Inicio: ${formatDate(project.startDate)}`}>
              <Tag>{formatDate(project.startDate)}</Tag>
            </Tooltip>
          </Space>

          <Space orientation="vertical" size={2} style={{ width: "100%" }}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Costo / Presupuesto
              </Text>
              <Text
                type={costPct > 100 ? "danger" : "secondary"}
                style={{ fontSize: 12 }}
              >
                {formatCurrency(project.currentCost)} /{" "}
                {formatCurrency(project.budget)}
              </Text>
            </Space>
            <Progress
              percent={Math.min(200, costPct)}
              size="small"
              showInfo={false}
              status={costPct > 100 ? "exception" : "normal"}
            />
          </Space>

          <Text type="secondary" style={{ fontSize: 12 }}>
            PM: {project.projectManager || "-"}
          </Text>
        </Space>
      </Card>
    </div>
  );
}
