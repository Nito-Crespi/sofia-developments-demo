import { Card, Typography, Space } from 'antd';
import styles from './MetricCard.module.css';

export const AmountColor = {
  Sofia: '#907232',
  Green: '#17A588',
  Black: '#000000',
  Red: '#D4463B',
} as const;
type AmountColor = typeof AmountColor[keyof typeof AmountColor];

export const PercentageColor = {
  Green: '#17A588',
  Red: '#D4463B',
} as const;
type PercentageColor = typeof PercentageColor[keyof typeof PercentageColor];

export const DotColor = {
  Sofia: '#907232',
  Green: '#17A588',
  Red: '#D4463B',
} as const;
type DotColor = typeof DotColor[keyof typeof DotColor];

type MetricCard =
 | { variant: 'full'; dotColor: DotColor; label: string; amount: string; currency: string; percentage?: string; text?: string; amountColor: AmountColor; percentageColor?: PercentageColor; }
 | { variant: 'simple'; dotColor: DotColor; label: string; amount: string; }
 | { variant: 'semifull'; dotColor: DotColor; label: string; amount: string; currency: string; amountColor: AmountColor; }

const MetricCard = (props: MetricCard) => {
  switch (props.variant) {
    case 'full':
      return (
        <Card className={styles.card}>
          <div className={styles.body}>
            <Space>
              <span className={styles.dot} style={{ backgroundColor: props.dotColor }} />
              <Typography.Text>{props.label}</Typography.Text>
            </Space>
            <Space>
              <Typography.Title level={3} className={styles.title} style={{ color: props.amountColor }}>{props.amount}</Typography.Title>
              <Typography.Text>{props.currency}</Typography.Text>
            </Space>
            {props.percentage && (
              <Space>
                <Typography.Text style={{ color: props.percentageColor }}>{props.percentage}</Typography.Text>
                <Typography.Text>{props.text}</Typography.Text>
              </Space>
            )}
          </div>
        </Card>
      );

    case 'simple':
      return (
        <Card className={styles.card}>
          <div className={styles.body}>
            <Space>
              <span className={styles.dot} style={{ backgroundColor: props.dotColor }} />
              <Typography.Text>{props.label}</Typography.Text>
            </Space>
            <Typography.Title level={3} className={styles.title}>{props.amount}</Typography.Title>
          </div>
        </Card>
      );

    case 'semifull':
      return (
        <Card className={styles.card}>
          <div className={styles.body}>
            <Space>
              <span className={styles.dot} style={{ backgroundColor: props.dotColor }} />
              <Typography.Text>{props.label}</Typography.Text>
            </Space>
            <Space>
              <Typography.Title level={3} className={styles.title} style={{ color: props.amountColor }}>{props.amount}</Typography.Title>
              <Typography.Text>{props.currency}</Typography.Text>
            </Space>
          </div>
        </Card>
      );
  }
};

export default MetricCard;