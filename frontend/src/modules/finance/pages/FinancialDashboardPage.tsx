import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Progress,
  Row,
  Segmented,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  DownloadOutlined,
  DollarOutlined,
  ReloadOutlined,
  RiseOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import type { ColumnsType } from "antd/es/table";
import "./FinancialDashboardPage.css";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  projectId?: string;
  description: string;
};

type MonthlyPoint = { period: string; income: number; expenses: number; balance: number };
type ProjectSummary = { projectId: string; projectName: string; income: number; expenses: number; balance: number };
type CategorySummary = { category: string; amount: number };
type DashboardData = {
  transactions: Transaction[];
  monthly: MonthlyPoint[];
  categories: CategorySummary[];
  projects: ProjectSummary[];
  isDemo: boolean;
};

const demoTransactions: Transaction[] = [
  { id: "tx-01", date: "2026-07-18", amount: 18500, type: "INCOME", category: "SERVICE", projectId: "p-01", description: "Certificación de obra · Residencial Norte" },
  { id: "tx-02", date: "2026-07-17", amount: 6240, type: "EXPENSE", category: "MATERIALS", projectId: "p-01", description: "Hormigón y acero · Residencial Norte" },
  { id: "tx-03", date: "2026-07-15", amount: 3850, type: "EXPENSE", category: "WORKER_PAYMENT", projectId: "p-02", description: "Nómina semanal · Equipo de obra" },
  { id: "tx-04", date: "2026-07-12", amount: 12800, type: "INCOME", category: "SERVICE", projectId: "p-02", description: "Hito 02 · Reforma Alameda" },
  { id: "tx-05", date: "2026-07-10", amount: 2140, type: "EXPENSE", category: "EQUIPMENT", projectId: "p-03", description: "Alquiler de plataforma elevadora" },
  { id: "tx-06", date: "2026-07-08", amount: 980, type: "EXPENSE", category: "FUEL", projectId: "p-01", description: "Combustible y desplazamientos" },
];

const demoMonthly: MonthlyPoint[] = [
  { period: "2026-02", income: 19800, expenses: 14200, balance: 5600 },
  { period: "2026-03", income: 25400, expenses: 16100, balance: 9300 },
  { period: "2026-04", income: 23100, expenses: 18700, balance: 4400 },
  { period: "2026-05", income: 31200, expenses: 20500, balance: 10700 },
  { period: "2026-06", income: 28900, expenses: 22400, balance: 6500 },
  { period: "2026-07", income: 31300, expenses: 13210, balance: 18090 },
];

const demoCategories: CategorySummary[] = [
  { category: "MATERIALS", amount: 6240 },
  { category: "WORKER_PAYMENT", amount: 3850 },
  { category: "EQUIPMENT", amount: 2140 },
  { category: "FUEL", amount: 980 },
];

const demoProjects: ProjectSummary[] = [
  { projectId: "p-01", projectName: "Residencial Norte", income: 18500, expenses: 7220, balance: 11280 },
  { projectId: "p-02", projectName: "Reforma Alameda", income: 12800, expenses: 3850, balance: 8950 },
  { projectId: "p-03", projectName: "Oficinas Centro", income: 0, expenses: 2140, balance: -2140 },
];

const categoryLabels: Record<string, string> = {
  MATERIALS: "Materiales", WORKER_PAYMENT: "Personal", EQUIPMENT: "Equipos", FUEL: "Combustible",
  SERVICE: "Servicios", TAX: "Impuestos", INSURANCE: "Seguros", SUPPLIER_PAYMENT: "Proveedores", OTHER: "Otros",
};

const currency = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const money = (value: number) => currency.format(value);

function demoData(): DashboardData {
  return { transactions: demoTransactions, monthly: demoMonthly, categories: demoCategories, projects: demoProjects, isDemo: true };
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

async function loadDashboard(): Promise<DashboardData> {
  const [transactions, monthly, categories, projects] = await Promise.all([
    getJson<Transaction[]>("/transactions"),
    getJson<MonthlyPoint[]>("/dashboard/evolution?from=2026-02-01&to=2026-07-31"),
    getJson<CategorySummary[]>("/dashboard/categories"),
    getJson<ProjectSummary[]>("/dashboard/projects"),
  ]);
  const expenseCategories = transactions.reduce<Record<string, number>>((totals, transaction) => {
    if (transaction.type === "EXPENSE") {
      totals[transaction.category] = (totals[transaction.category] ?? 0) + transaction.amount;
    }
    return totals;
  }, {});
  const expenseCategorySummary = Object.entries(expenseCategories)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  return {
    transactions,
    monthly,
    categories: expenseCategorySummary.length ? expenseCategorySummary : categories.filter((item) => item.amount > 0),
    projects,
    isDemo: false,
  };
}

function periodLabel(period: string) { return dayjs(`${period}-01`).format("MMM").replace(".", ""); }

export default function FinancialDashboardPage() {
  const [data, setData] = useState<DashboardData>(demoData);
  const [range, setRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(5, "month").startOf("month"), dayjs()]);
  const [period, setPeriod] = useState("6 meses");
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try { setData(await loadDashboard()); } catch { setData(demoData()); } finally { setLoading(false); }
  };

  useEffect(() => {
    let active = true;
    loadDashboard()
      .then((nextData) => {
        if (active) setData(nextData);
      })
      .catch(() => {
        if (active) setData(demoData());
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const totals = useMemo(() => {
    const income = data.transactions.filter((item) => item.type === "INCOME").reduce((sum, item) => sum + item.amount, 0);
    const expenses = data.transactions.filter((item) => item.type === "EXPENSE").reduce((sum, item) => sum + item.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [data.transactions]);

  const maxMonthlyValue = Math.max(...data.monthly.map((item) => Math.max(item.income, item.expenses)), 1);
  const maxCategoryValue = Math.max(...data.categories.map((item) => item.amount), 1);
  const latestBalance = data.monthly.at(-1)?.balance ?? totals.balance;
  const recentTransactions = data.transactions.slice().sort((a, b) => b.date.localeCompare(a.date));

  const columns: ColumnsType<Transaction> = [
    { title: "Movimiento", dataIndex: "description", key: "description", render: (value: string, record) => <Space><span className={`transaction-icon ${record.type === "INCOME" ? "income" : "expense"}`}>{record.type === "INCOME" ? <ArrowUpOutlined /> : <ArrowDownOutlined />}</span><Text strong>{value}</Text></Space> },
    { title: "Categoría", dataIndex: "category", key: "category", render: (value: string) => <Tag bordered={false}>{categoryLabels[value] ?? value}</Tag> },
    { title: "Fecha", dataIndex: "date", key: "date", render: (value: string) => dayjs(value).format("DD MMM YYYY") },
    { title: "Importe", dataIndex: "amount", key: "amount", align: "right", render: (value: number, record) => <Text className={record.type === "INCOME" ? "amount-income" : "amount-expense"} strong>{record.type === "INCOME" ? "+" : "−"}{money(value)}</Text> },
  ];

  return (
    <div className="finance-dashboard">
      <div className="finance-hero">
        <div><Text className="eyebrow">CONTROL FINANCIERO</Text><Title level={2}>Resumen financiero</Title><Text className="hero-copy">Una lectura rápida de la salud económica de tus obras y proyectos.</Text></div>
        <Space wrap><RangePicker value={range} onChange={(value) => { if (value?.[0] && value[1]) setRange([value[0], value[1]]); }} suffixIcon={<CalendarOutlined />} /><Button icon={<ReloadOutlined />} loading={loading} onClick={() => void refresh}>Actualizar</Button><Button type="primary" icon={<DownloadOutlined />}>Exportar</Button></Space>
      </div>

      {data.isDemo ? <Alert className="demo-alert" type="warning" showIcon icon={<WarningOutlined />} message="Modo presentación" description="Mostrando datos de ejemplo. Cuando la API financiera esté disponible, este panel se actualizará automáticamente." /> : null}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}><Card className="metric-card balance-card"><Statistic title="Saldo disponible" value={totals.balance} precision={0} suffix="€" prefix={<DollarOutlined />} /><div className="metric-foot"><CheckCircleFilled /> En positivo este periodo</div></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card className="metric-card"><Statistic title="Ingresos" value={totals.income} precision={0} suffix="€" prefix={<ArrowUpOutlined className="stat-income" />} /><div className="metric-foot positive"><RiseOutlined /> +12,4% vs. periodo anterior</div></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card className="metric-card"><Statistic title="Gastos" value={totals.expenses} precision={0} suffix="€" prefix={<ArrowDownOutlined className="stat-expense" />} /><div className="metric-foot"><span className="dot dot-gold" /> 42% en materiales</div></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card className="metric-card"><Statistic title="Margen operativo" value={totals.income ? (totals.balance / totals.income) * 100 : 0} precision={1} suffix="%" /><Progress percent={totals.income ? (totals.balance / totals.income) * 100 : 0} showInfo={false} strokeColor="#2d8f78" trailColor="#e8eee9" /></Card></Col>
      </Row>

      <Row gutter={[16, 16]} className="dashboard-grid">
        <Col xs={24} xl={15}><Card className="chart-card" title={<div><Text className="card-kicker">EVOLUCIÓN</Text><div className="card-title">Ingresos frente a gastos</div></div>} extra={<Segmented size="small" value={period} onChange={(value) => setPeriod(value)} options={["6 meses", "Año"]} />}><div className="chart-legend"><span><i className="legend-dot income-dot" /> Ingresos</span><span><i className="legend-dot expense-dot" /> Gastos</span><Text type="secondary">Saldo último mes: <Text strong>{money(latestBalance)}</Text></Text></div><div className="bar-chart" aria-label="Gráfico de evolución de ingresos y gastos">{data.monthly.map((item) => <div className="bar-group" key={item.period}><div className="bars"><div className="bar income-bar" style={{ height: `${(item.income / maxMonthlyValue) * 100}%` }} title={`Ingresos ${money(item.income)}`} /><div className="bar expense-bar" style={{ height: `${(item.expenses / maxMonthlyValue) * 100}%` }} title={`Gastos ${money(item.expenses)}`} /></div><Text type="secondary">{periodLabel(item.period)}</Text></div>)}</div></Card></Col>
        <Col xs={24} xl={9}><Card className="chart-card" title={<div><Text className="card-kicker">DISTRIBUCIÓN</Text><div className="card-title">Gastos por categoría</div></div>}>{data.categories.length ? <Space direction="vertical" size="middle" style={{ width: "100%" }}>{data.categories.slice(0, 5).map((item) => <div className="category-row" key={item.category}><div className="category-label"><Text>{categoryLabels[item.category] ?? item.category}</Text><Text strong>{money(item.amount)}</Text></div><Progress percent={(item.amount / maxCategoryValue) * 100} showInfo={false} strokeColor={item.category === "MATERIALS" ? "#cda659" : "#55708f"} /></div>)}</Space> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin gastos registrados" />}</Card></Col>
      </Row>

      <Row gutter={[16, 16]}><Col xs={24} xl={14}><Card className="table-card" title={<div><Text className="card-kicker">ACTIVIDAD</Text><div className="card-title">Últimos movimientos</div></div>} extra={<Button type="link">Ver todos</Button>}><Table rowKey="id" columns={columns} dataSource={recentTransactions.slice(0, 5)} pagination={false} size="middle" scroll={{ x: 620 }} /></Card></Col><Col xs={24} xl={10}><Card className="table-card project-card" title={<div><Text className="card-kicker">RENTABILIDAD</Text><div className="card-title">Resultado por proyecto</div></div>} extra={<Button type="link">Detalle</Button>}><Space direction="vertical" size="large" style={{ width: "100%" }}>{data.projects.map((project) => <div className="project-row" key={project.projectId}><div className="project-heading"><Text strong>{project.projectName}</Text><Text className={project.balance >= 0 ? "amount-income" : "amount-expense"} strong>{project.balance >= 0 ? "+" : "−"}{money(Math.abs(project.balance))}</Text></div><Progress percent={project.income ? Math.min((project.expenses / project.income) * 100, 100) : 100} showInfo={false} strokeColor={project.balance >= 0 ? "#2d8f78" : "#c46b58"} /><Text type="secondary">Ingresos {money(project.income)} · Gastos {money(project.expenses)}</Text></div>)}</Space></Card></Col></Row>
    </div>
  );
}