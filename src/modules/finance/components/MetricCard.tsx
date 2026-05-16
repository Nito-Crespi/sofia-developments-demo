import { Card, Space, Typography } from "antd";
import {
  METRIC_COLOR_MAP,
  type METRIC_COLOR_TYPE,
  type METRICS_CARD_PROPS,
} from "../constants";
const { Text, Title } = Typography;

export const MetricsCard = ({
  label,
  title,
  currency,
  subtitle,
  type,
}: METRICS_CARD_PROPS) => {
  return (
    <Card style={{ backgroundColor: "white" }}>
      <Text style={{ display: "block", marginBottom: 8 }}>{label}</Text>
      <Space align="baseline">
        <Title level={3} style={{ marginBottom: 0 }}>
          {title}
        </Title>
        <Text>{currency}</Text>
      </Space>
      <Text
        style={{
          display: "block",
          fontSize: 12,
          color: METRIC_COLOR_MAP[type as METRIC_COLOR_TYPE],
        }}
      >
        {subtitle}
      </Text>
    </Card>
  );
};
