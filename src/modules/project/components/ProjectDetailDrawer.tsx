import {
  Drawer,
  Descriptions,
  Tag,
  Space,
  Button,
  Divider,
  Typography,
  Card,
  Row,
  Col,
  Progress,
  List,
  Statistic,
  Timeline,
} from "antd";
import {
  EditOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  ToolOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { Project } from "../dto/project.dto";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  CONSTRUCTION_TYPE_LABELS,
  PERMIT_STATUS_COLORS,
  PERMIT_STATUS_LABELS,
} from "../constants";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
} from "../../../utils/Formatters";

const { Title, Text, Paragraph } = Typography;

type Props = {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onEdit: () => void;
};

export default function ProjectDetailDrawer({
  open,
  onClose,
  project,
  onEdit,
}: Props) {
  if (!project) return null;

  const budgetUsagePercent = (project.currentCost / project.budget) * 100;
  const balance = project.paymentsReceived - project.currentCost;
  const profitMargin =
    project.budget > 0 ? (project.estimatedProfit / project.budget) * 100 : 0;

  const daysElapsed = dayjs().diff(dayjs(project.startDate), "day");
  const totalDays = dayjs(project.estimatedEndDate).diff(
    dayjs(project.startDate),
    "day",
  );
  const progressPercent = totalDays > 0 ? (daysElapsed / totalDays) * 100 : 0;

  return (
    <Drawer
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Detalles del Proyecto
          </Title>
        </Space>
      }
      open={open}
      onClose={onClose}
      width={800}
      extra={
        <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
          Editar
        </Button>
      }
    >
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        {/* Header */}
        <Card>
          <Space orientation="vertical" size="small" style={{ width: "100%" }}>
            <Space>
              <Tag color={STATUS_COLORS[project.status]}>
                {STATUS_LABELS[project.status]}
              </Tag>
              <Tag color={PRIORITY_COLORS[project.priority]}>
                {PRIORITY_LABELS[project.priority]}
              </Tag>
              <Tag>{CONSTRUCTION_TYPE_LABELS[project.constructionType]}</Tag>
            </Space>
            <Title level={3} style={{ margin: 0 }}>
              {project.name}
            </Title>
            <Text type="secondary" strong>
              {project.code}
            </Text>
          </Space>
        </Card>

        {/* Estadísticas */}
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Presupuesto"
                value={project.budget}
                prefix={<DollarOutlined />}
                formatter={(value) => formatCurrency(Number(value))}
              />
              <Progress
                percent={Math.min(budgetUsagePercent, 100)}
                status={
                  budgetUsagePercent > 100
                    ? "exception"
                    : budgetUsagePercent > 80
                      ? "normal"
                      : "success"
                }
                format={() => `${budgetUsagePercent.toFixed(1)}%`}
              />
              <Text type="secondary">Utilizado del presupuesto</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Balance"
                value={balance}
                prefix={<DollarOutlined />}
                formatter={(value) => formatCurrency(Number(value))}
                valueStyle={{ color: balance >= 0 ? "#52c41a" : "#ff4d4f" }}
              />
              <Text type="secondary">Ingresos - Costos</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Margen Estimado"
                value={profitMargin}
                suffix="%"
                precision={1}
                prefix={<BarChartOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
              <Text type="secondary">Ganancia / Presupuesto</Text>
            </Card>
          </Col>
        </Row>

        {/* Información General */}
        <Card title="Información General">
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Descripción" span={1}>
              {project.description || "—"}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <EnvironmentOutlined /> Ubicación
                </>
              }
            >
              {project.location}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <UserOutlined /> Cliente
                </>
              }
            >
              {project.client}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <TeamOutlined /> Gerente
                </>
              }
            >
              {project.projectManager}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Cronograma */}
        <Card
          title={
            <>
              <CalendarOutlined /> Cronograma
            </>
          }
        >
          <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Fecha de Inicio">
                {formatDate(project.startDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Fin Estimado">
                {formatDate(project.estimatedEndDate)}
              </Descriptions.Item>
              {project.actualEndDate && (
                <Descriptions.Item label="Fin Real" span={2}>
                  {formatDate(project.actualEndDate)}
                </Descriptions.Item>
              )}
            </Descriptions>

            <div>
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Text>Progreso temporal</Text>
                <Text type="secondary">
                  {daysElapsed} de {totalDays} días
                </Text>
              </Space>
              <Progress
                percent={Math.min(progressPercent, 100)}
                status={
                  progressPercent > 100
                    ? "exception"
                    : project.status === "completed"
                      ? "success"
                      : "active"
                }
              />
            </div>
          </Space>
        </Card>

        {/* Información Financiera */}
        <Card
          title={
            <>
              <DollarOutlined /> Información Financiera
            </>
          }
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Statistic
                title="Presupuesto Total"
                value={project.budget}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Costos Actuales"
                value={project.currentCost}
                formatter={(value) => formatCurrency(Number(value))}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Pagos Recibidos"
                value={project.paymentsReceived}
                formatter={(value) => formatCurrency(Number(value))}
                valueStyle={{ color: "#52c41a" }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Ganancia Estimada"
                value={project.estimatedProfit}
                formatter={(value) => formatCurrency(Number(value))}
                valueStyle={{ color: "#1890ff" }}
              />
            </Col>
          </Row>
        </Card>

        {/* Información Técnica */}
        <Card
          title={
            <>
              <ToolOutlined /> Información Técnica
            </>
          }
        >
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Área">
              {project.area.toLocaleString()} m²
            </Descriptions.Item>
            {project.floors && (
              <Descriptions.Item label="Pisos">
                {project.floors}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Especificaciones" span={2}>
              {project.technicalSpecs || "—"}
            </Descriptions.Item>
          </Descriptions>

          {project.mainMaterials.length > 0 && (
            <>
              <Divider plain style={{ marginTop: 16 }}>
                Materiales Principales
              </Divider>
              <Space wrap>
                {project.mainMaterials.map((material, idx) => (
                  <Tag key={idx}>{material}</Tag>
                ))}
              </Space>
            </>
          )}
        </Card>

        {/* Equipo */}
        <Card
          title={
            <>
              <TeamOutlined /> Equipo
            </>
          }
        >
          {project.assignedTeam.length > 0 ? (
            <List
              size="small"
              dataSource={project.assignedTeam}
              renderItem={(member) => (
                <List.Item>
                  <UserOutlined /> {member}
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">No hay miembros asignados</Text>
          )}
        </Card>

        {/* Permisos y Licencias */}
        {project.permits.length > 0 && (
          <Card
            title={
              <>
                <SafetyCertificateOutlined /> Permisos y Licencias
              </>
            }
          >
            <Timeline
              items={project.permits.map((permit) => ({
                color: PERMIT_STATUS_COLORS[permit.status],
                children: (
                  <Space direction="vertical" size="small">
                    <Space>
                      <Text strong>{permit.name}</Text>
                      <Tag color={PERMIT_STATUS_COLORS[permit.status]}>
                        {PERMIT_STATUS_LABELS[permit.status]}
                      </Tag>
                    </Space>
                    {permit.expiryDate && (
                      <Text type="secondary">
                        Vence: {formatDate(permit.expiryDate)}
                      </Text>
                    )}
                  </Space>
                ),
              }))}
            />
          </Card>
        )}

        {/* Notas */}
        {project.notes && (
          <Card
            title={
              <>
                <FileTextOutlined /> Notas
              </>
            }
          >
            <Paragraph>{project.notes}</Paragraph>
          </Card>
        )}

        {/* Documentos */}
        {project.documents.length > 0 && (
          <Card title="Documentos">
            <List
              size="small"
              dataSource={project.documents}
              renderItem={(doc) => <List.Item>{doc}</List.Item>}
            />
          </Card>
        )}

        {/* Metadatos */}
        <Card title="Información del Sistema" size="small">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Creado">
              {formatDateTime(project.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Última Actualización">
              {formatDateTime(project.updatedAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Creado por">
              {project.createdBy}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </Drawer>
  );
}
