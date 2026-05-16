import { Row, Col } from "antd";
import { type METRIC_COLOR_TYPE } from "../constants";
import { MetricsCard } from "../components/MetricCard";

export const FinancePage = () => {
  const metrics = [
    {
      id: 1,
      title: "129.3 M",
      label: "Ingresos YTD",
      subtitle: "+18,4% vs. año ant.",
      currency: "$ARS",
      type: "green" as METRIC_COLOR_TYPE,
    },
    {
      id: 2,
      label: "Egresos YTD",
      title: "89.3 M",
      currency: "US$",
      subtitle: "+28,4% vs. año ant.",
      type: "red" as METRIC_COLOR_TYPE,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {metrics.map((metric) => (
        <Col key={metric.id} xs={24} sm={12} md={8} lg={6}>
          <MetricsCard
            label={metric.label}
            title={metric.title}
            currency={metric.currency}
            subtitle={metric.subtitle}
            type={metric.type}
          />
        </Col>
      ))}
    </Row>
  );
};
