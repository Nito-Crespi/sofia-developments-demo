import { Card, Typography, Space, Flex } from 'antd';
import styles from './MetricCard.module.css';
import type { AmountColor, PercentageColor, DotColor } from './constants';

type MetricCardProps =
 | { variant: 'full'; dotColor: DotColor; label: string; amount: string; currency: string; percentage?: string; text?: string; amountColor: AmountColor; percentageColor?: PercentageColor; }
 | { variant: 'simple'; dotColor: DotColor; label: string; amount: string; }
 | { variant: 'semifull'; dotColor: DotColor; label: string; amount: string; currency: string; amountColor: AmountColor; }

const hasCurrency = (props: MetricCardProps): props is Extract<MetricCardProps, { variant: 'full' | 'semifull' }> => {
  return props.variant === 'full' || props.variant === 'semifull';
};

const isFull = (props: MetricCardProps): props is Extract<MetricCardProps, { variant: 'full' }> => {
  return props.variant === 'full';
};

const MetricCard = (props: MetricCardProps) => {
  return (
    <Card className={styles.card}>
      <Flex vertical gap={4}>
        <Space>
          <span className={styles.dot} style={{ backgroundColor: props.dotColor }} />
          <Typography.Text>{props.label}</Typography.Text>
        </Space>

        {hasCurrency(props) ? (
          <Space>
            <Typography.Title level={3} className={styles.title} style={{ color: props.amountColor }}>
              {props.amount}
            </Typography.Title>
            <Typography.Text>{props.currency}</Typography.Text>
          </Space>
        ) : (
          <Typography.Title level={3} className={styles.title}>
            {props.amount}
          </Typography.Title>
        )}

        {isFull(props) && props.percentage && (
          <Space>
            <Typography.Text style={{ color: props.percentageColor }}>{props.percentage}</Typography.Text>
            {props.text && <Typography.Text>{props.text}</Typography.Text>}
          </Space>
        )}
      </Flex>
    </Card>
  );
};

export default MetricCard;