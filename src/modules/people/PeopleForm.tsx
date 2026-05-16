import type { CSSProperties } from "react";
import { Col, DatePicker, Form, Image, Input, Row, Select } from "antd";
import type { Dayjs } from "dayjs";
import UserProfile from "/src/assets/user_profile.png";

interface PeopleFormValues {
  name: string;
  lastName: string;
  document?: string;
  birthDate?: Dayjs;
  gender?: "M" | "F" | "X" | "NA";
  phone?: string;
  nationality?: string;
  email?: string;
  address?: string;
}

interface PeopleFormProps {
  onFinish?: (values: PeopleFormValues) => void;
  initialValues?: Partial<PeopleFormValues>;
  loading?: boolean;
}

const GENDER_OPTIONS = [
  { value: "M", label: "Masculino" },
  { value: "F", label: "Femenino" },
  { value: "X", label: "Otro" },
  { value: "NA", label: "Prefiero no decir" },
];

const imageContainerStyle: CSSProperties = {
  width: "100%",
  maxWidth: 320,
  margin: "0 auto",
  aspectRatio: "1 / 1",
  overflow: "hidden",
  borderRadius: 12,
  background: "#eee",
};

const imageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const PeopleForm = ({
  onFinish,
  initialValues,
  loading = false,
}: PeopleFormProps) => {
  const [form] = Form.useForm<PeopleFormValues>();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
      disabled={loading}
    >
      <Row gutter={[16, 16]}>
        {/* Foto de perfil */}
        <Col xs={24} md={8}>
          <div style={imageContainerStyle}>
            <Image
              src={UserProfile}
              alt="Foto de perfil"
              preview={false}
              style={imageStyle}
            />
          </div>
        </Col>

        {/* Datos personales */}
        <Col xs={24} md={16}>
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Nombre"
                rules={[{ required: true, message: "El nombre es requerido" }]}
              >
                <Input placeholder="Nombre" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="lastName"
                label="Apellido"
                rules={[
                  { required: true, message: "El apellido es requerido" },
                ]}
              >
                <Input placeholder="Apellido" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item name="document" label="Documento">
                <Input placeholder="Número de documento" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item name="birthDate" label="Fecha de nacimiento">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Seleccionar fecha"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item name="gender" label="Género">
                <Select
                  placeholder="Seleccionar"
                  allowClear
                  options={GENDER_OPTIONS}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item name="phone" label="Teléfono">
                <Input placeholder="+54 11 1234-5678" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item name="nationality" label="Nacionalidad">
                <Input placeholder="Argentina" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ type: "email", message: "Email inválido" }]}
              >
                <Input placeholder="nombre@correo.com" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item name="address" label="Dirección">
                <Input placeholder="Calle y número" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};
