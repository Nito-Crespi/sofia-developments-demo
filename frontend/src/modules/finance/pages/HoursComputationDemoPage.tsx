import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Form,
  Space,
  Switch,
  Tabs,
  TimePicker,
  Typography,
  message,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  computeDemoDayHours,
  MEAL_DEDUCTION_HOURS,
  RAIN_EARLY_LEAVE_HOURS,
  STANDARD_DAY_HOURS,
  type DemoDayHoursResult,
} from "../utils/demoDayHours";

const { Title, Text, Paragraph } = Typography;

type FormValues = {
  start: Dayjs | null;
  end: Dayjs | null;
  rain: boolean;
  mealUsed: boolean;
};

function formatHours(n: number): string {
  return `${n.toFixed(2)} h`;
}

export default function HoursComputationDemoPage() {
  const [form] = Form.useForm<FormValues>();
  const [result, setResult] = useState<DemoDayHoursResult | null>(null);

  const onCalculate = async () => {
    try {
      const values = await form.validateFields();
      const { start, end, rain, mealUsed } = values;
      if (!start || !end) return;
      if (!end.isAfter(start)) {
        message.warning("La hora fin debe ser posterior a la hora inicio.");
        setResult(null);
        return;
      }
      setResult(computeDemoDayHours({ start, end, rain, mealUsed }));
    } catch {
      /* validateFields rejected */
    }
  };

  const rulesTab = (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Paragraph style={{ marginBottom: 0 }}>
        Reglas fijas de esta demo (solo para conversación con cliente):
      </Paragraph>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        <li>
          <Text strong>Horas brutas:</Text> diferencia entre hora fin e inicio (mismo día).
        </li>
        <li>
          <Text strong>Lluvia:</Text> se restan {RAIN_EARLY_LEAVE_HOURS} h como salida temprana
          típica de obra.
        </li>
        <li>
          <Text strong>Comida del día:</Text> si marcó que usó la comida, se restan{" "}
          {MEAL_DEDUCTION_HOURS} h.
        </li>
        <li>
          <Text strong>Regular vs extra:</Text> hasta {STANDARD_DAY_HOURS} h cuentan como jornada
          regular; el resto se muestra como horas extra (sin tarifas).
        </li>
      </ul>
    </Space>
  );

  const entriesTab = (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          start: dayjs().hour(7).minute(0).second(0),
          end: dayjs().hour(17).minute(0).second(0),
          rain: false,
          mealUsed: true,
        }}
        style={{ maxWidth: 400 }}
      >
        <Form.Item
          name="start"
          label="Hora inicio"
          rules={[{ required: true, message: "Indique hora de inicio" }]}
        >
          <TimePicker format="HH:mm" needConfirm={false} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="end"
          label="Hora fin"
          rules={[{ required: true, message: "Indique hora de fin" }]}
        >
          <TimePicker format="HH:mm" needConfirm={false} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="rain" label="Llovió (salida temprana en obra)" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item
          name="mealUsed"
          label="Usó comida / descanso del día"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={onCalculate}>
            Calcular
          </Button>
        </Form.Item>
      </Form>

      {result ? (
        <Card size="small" title="Desglose">
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="Horas brutas (inicio → fin)">
              {formatHours(result.rawHours)}
            </Descriptions.Item>
            {result.rainApplied ? (
              <Descriptions.Item label="Tras ajuste lluvia (−2 h demo)">
                {formatHours(result.afterRainHours)}
              </Descriptions.Item>
            ) : null}
            {result.mealApplied ? (
              <Descriptions.Item label="Tras descanso/comida (−0,5 h demo)">
                {formatHours(result.afterMealHours)}
              </Descriptions.Item>
            ) : null}
            <Descriptions.Item label="Base para régimen / extra (tras reglas demo)">
              {formatHours(result.afterMealHours)}
            </Descriptions.Item>
            <Descriptions.Item label={`Horas regulares (hasta ${STANDARD_DAY_HOURS} h)`}>
              {formatHours(result.regularHours)}
            </Descriptions.Item>
            <Descriptions.Item label="Horas extra">
              {formatHours(result.overtimeHours)}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ) : null}
    </Space>
  );

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Title level={3} style={{ margin: 0 }}>
        Cálculo de jornada (demo contadores)
      </Title>
      <Alert
        type="info"
        showIcon
        message="Lógica ilustrativa para reunión con cliente; no es política de nómina definitiva."
      />
      <Card>
        <Tabs
          items={[
            { key: "entries", label: "Entradas", children: entriesTab },
            { key: "rules", label: "Reglas demo", children: rulesTab },
          ]}
        />
      </Card>
    </Space>
  );
}
