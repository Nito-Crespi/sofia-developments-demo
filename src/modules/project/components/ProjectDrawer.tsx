import {
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Space,
  Row,
  Col,
  Divider,
  Typography,
  message,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import dayjs from "dayjs";
import type { Project, ProjectFormData } from "../dto/project.dto";
import {
  CONSTRUCTION_TYPE_OPTIONS,
  PERMIT_STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
} from "../constants";

const { Title } = Typography;
const { TextArea } = Input;

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: ProjectFormData) => void;
  project?: Project | null;
};

export default function ProjectDrawer({
  open,
  onClose,
  onSave,
  project,
}: Props) {
  const [form] = Form.useForm();
  const isEdit = !!project;

  useEffect(() => {
    if (open && project) {
      form.setFieldsValue({
        ...project,
        startDate: project.startDate ? dayjs(project.startDate) : null,
        estimatedEndDate: project.estimatedEndDate
          ? dayjs(project.estimatedEndDate)
          : null,
        actualEndDate: project.actualEndDate
          ? dayjs(project.actualEndDate)
          : null,
        permits: project.permits.map((p) => ({
          ...p,
          expiryDate: p.expiryDate ? dayjs(p.expiryDate) : null,
        })),
      });
    } else if (open) {
      form.resetFields();
      // Valores por defecto
      form.setFieldsValue({
        status: "planning",
        priority: "medium",
        currentCost: 0,
        paymentsReceived: 0,
        estimatedProfit: 0,
        mainMaterials: [],
        assignedTeam: [],
        permits: [],
        documents: [],
      });
    }
  }, [open, project, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData: ProjectFormData = {
        ...values,
        startDate: values.startDate?.toISOString() || new Date().toISOString(),
        estimatedEndDate: values.estimatedEndDate?.toISOString() || "",
        actualEndDate: values.actualEndDate?.toISOString() || undefined,
        permits: (values.permits || []).map((p: any) => ({
          ...p,
          expiryDate: p.expiryDate?.toISOString() || undefined,
        })),
        createdBy: "current_user",
      };

      onSave(formData);
      message.success(
        isEdit ? "Proyecto actualizado" : "Proyecto creado exitosamente",
      );
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Drawer
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            {isEdit ? "Editar Proyecto" : "Nuevo Proyecto"}
          </Title>
        </Space>
      }
      open={open}
      onClose={onClose}
      width={720}
      extra={
        <Space>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSubmit}>
            Guardar
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        {/* INFORMACIÓN GENERAL */}
        <Title level={5}>Información General</Title>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Nombre del Proyecto"
              name="name"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Input placeholder="Ej: Edificio Residencial Torre A" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Código"
              name="code"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Input placeholder="Ej: PROJ-2024-001" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Descripción" name="description">
          <TextArea rows={3} placeholder="Descripción detallada del proyecto" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Cliente"
              name="client"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Input placeholder="Nombre del cliente" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ubicación"
              name="location"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Input placeholder="Dirección completa" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Estado"
              name="status"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Select options={STATUS_OPTIONS as any} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Prioridad"
              name="priority"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Select options={PRIORITY_OPTIONS as any} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Tipo de Construcción"
              name="constructionType"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Select options={CONSTRUCTION_TYPE_OPTIONS as any} />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {/* FECHAS */}
        <Title level={5}>Cronograma</Title>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Fecha de Inicio"
              name="startDate"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Fecha Estimada de Fin"
              name="estimatedEndDate"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Fecha Real de Fin" name="actualEndDate">
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {/* INFORMACIÓN FINANCIERA */}
        <Title level={5}>Información Financiera</Title>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Presupuesto Total"
              name="budget"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) =>
                  parseFloat(value!.replace(/\$\s?|(,*)/g, "") || "0") as any
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Costos Actuales" name="currentCost">
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) =>
                  parseFloat(value!.replace(/\$\s?|(,*)/g, "") || "0") as any
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Pagos Recibidos" name="paymentsReceived">
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) =>
                  parseFloat(value!.replace(/\$\s?|(,*)/g, "") || "0") as any
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Ganancia Estimada" name="estimatedProfit">
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) =>
                  parseFloat(value!.replace(/\$\s?|(,*)/g, "") || "0") as any
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {/* INFORMACIÓN TÉCNICA */}
        <Title level={5}>Información Técnica</Title>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Área (m²)"
              name="area"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="Área en metros cuadrados"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Número de Pisos" name="floors">
              <InputNumber
                style={{ width: "100%" }}
                min={1}
                placeholder="Opcional"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Especificaciones Técnicas" name="technicalSpecs">
          <TextArea rows={3} placeholder="Detalles técnicos del proyecto" />
        </Form.Item>

        <Form.Item label="Materiales Principales" name="mainMaterials">
          <Select
            mode="tags"
            placeholder="Agregue materiales (presione Enter)"
            tokenSeparators={[","]}
          />
        </Form.Item>

        <Divider />

        {/* RECURSOS HUMANOS */}
        <Title level={5}>Recursos Humanos</Title>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Gerente de Proyecto"
              name="projectManager"
              rules={[{ required: true, message: "Campo requerido" }]}
            >
              <Input placeholder="Nombre del responsable" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Equipo Asignado" name="assignedTeam">
              <Select
                mode="tags"
                placeholder="Agregue miembros del equipo"
                tokenSeparators={[","]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {/* PERMISOS */}
        <Title level={5}>Permisos y Licencias</Title>

        <Form.List name="permits">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: "flex",
                    marginBottom: 8,
                    alignItems: "flex-start",
                  }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    rules={[{ required: true, message: "Nombre requerido" }]}
                  >
                    <Input placeholder="Nombre del permiso" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "status"]}
                    rules={[{ required: true, message: "Estado requerido" }]}
                  >
                    <Select
                      placeholder="Estado"
                      options={PERMIT_STATUS_OPTIONS as any}
                      style={{ width: 140 }}
                    />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "expiryDate"]}>
                    <DatePicker placeholder="Vencimiento" format="DD/MM/YYYY" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Agregar Permiso
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider />

        {/* NOTAS Y DOCUMENTOS */}
        <Title level={5}>Notas y Documentos</Title>

        <Form.Item label="Notas" name="notes">
          <TextArea rows={4} placeholder="Notas adicionales del proyecto" />
        </Form.Item>

        <Form.Item label="Documentos" name="documents">
          <Select
            mode="tags"
            placeholder="URLs o referencias a documentos"
            tokenSeparators={[","]}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
