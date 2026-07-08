import { Tag, Space, Button, Tooltip, Popconfirm, Typography } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Project } from "../dto/project.dto";
import {
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
} from "../constants";
import { formatCurrency, formatDate } from "../../../utils/Formatters";

const { Text } = Typography;

type ColumnCallbacks = {
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onView?: (project: Project) => void;
};

/**
 * Genera las columnas de la tabla de proyectos con los callbacks necesarios
 */
export const getProjectTableColumns = ({
  onEdit,
  onDelete,
  onView,
}: ColumnCallbacks): ColumnsType<Project> => [
  {
    title: "Código",
    dataIndex: "code",
    key: "code",
    width: 140,
    fixed: "left",
    render: (code: string) => <Text strong>{code}</Text>,
  },
  {
    title: "Nombre",
    dataIndex: "name",
    key: "name",
    width: 220,
    fixed: "left",
    ellipsis: true,
  },
  {
    title: "Cliente",
    dataIndex: "client",
    key: "client",
    width: 160,
    ellipsis: true,
  },
  {
    title: "Estado",
    dataIndex: "status",
    key: "status",
    width: 130,
    render: (status: Project["status"]) => (
      <Tag color={STATUS_COLORS[status]}>{STATUS_LABELS[status]}</Tag>
    ),
  },
  {
    title: "Prioridad",
    dataIndex: "priority",
    key: "priority",
    width: 110,
    render: (priority: Project["priority"]) => (
      <Tag color={PRIORITY_COLORS[priority]}>{PRIORITY_LABELS[priority]}</Tag>
    ),
  },
  {
    title: "Presupuesto",
    dataIndex: "budget",
    key: "budget",
    width: 140,
    align: "right",
    render: (budget: number) => formatCurrency(budget),
  },
  {
    title: "Costo Actual",
    dataIndex: "currentCost",
    key: "currentCost",
    width: 140,
    align: "right",
    render: (cost: number, record: Project) => {
      const percentage = (cost / record.budget) * 100;
      const color =
        percentage > 100 ? "red" : percentage > 80 ? "orange" : "green";
      return (
        <Tooltip title={`${percentage.toFixed(1)}% del presupuesto`}>
          <Text style={{ color }}>{formatCurrency(cost)}</Text>
        </Tooltip>
      );
    },
  },
  {
    title: "Área (m²)",
    dataIndex: "area",
    key: "area",
    width: 110,
    align: "right",
    render: (area: number) => area.toLocaleString(),
  },
  {
    title: "Gerente",
    dataIndex: "projectManager",
    key: "projectManager",
    width: 160,
    ellipsis: true,
  },
  {
    title: "Inicio",
    dataIndex: "startDate",
    key: "startDate",
    width: 120,
    render: (date: string) => formatDate(date),
  },
  {
    title: "Fin Estimado",
    dataIndex: "estimatedEndDate",
    key: "estimatedEndDate",
    width: 120,
    render: (date: string) => formatDate(date),
  },
  {
    title: "Acciones",
    key: "actions",
    width: 140,
    fixed: "right",
    render: (_: any, record: Project) => (
      <Space size="small">
        {onView && (
          <Tooltip title="Ver detalles">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
        )}
        <Tooltip title="Editar">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
        </Tooltip>
        <Popconfirm
          title="¿Eliminar proyecto?"
          description="Esta acción no se puede deshacer"
          onConfirm={() => onDelete(record.id)}
          okText="Eliminar"
          cancelText="Cancelar"
          okButtonProps={{ danger: true }}
        >
          <Tooltip title="Eliminar">
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Tooltip>
        </Popconfirm>
      </Space>
    ),
  },
];
