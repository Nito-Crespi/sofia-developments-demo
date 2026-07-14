import { Typography } from "antd";
import MetricCard from '../../../components/MetricCard/MetricCard';
import { AmountColor, DotColor, PercentageColor } from '../../../components/MetricCard/constants';

const {  } = Typography;

export default function FinanceSummaryPage() {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
  <MetricCard
    variant="full"
    label="Ingresos YTD"
    amount="129.3 M"
    currency="US$"
    percentage="^ +18,4%"
    text="vs. año ant."
    amountColor={AmountColor.Sofia}
    dotColor={DotColor.Green}
    percentageColor={PercentageColor.Green}
  />
  <MetricCard
    variant="simple"
    label="Completados"
    amount="1"
    dotColor={DotColor.Green}
  />
  <MetricCard
    variant="semifull"
    label="Presupuesto total"
    amount="114 M"
    currency="US$"
    amountColor={AmountColor.Sofia}
    dotColor={DotColor.Sofia}
  />
</div>
    
  );
}