import {
  Space,
  Typography,
  Tooltip,
  Drawer,
  Button,
  Alert,
  Divider,
  Row,
  Col,
  Card,
} from "antd";
import {
  CloudOutlined,
  EyeOutlined,
  SunOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  DashboardOutlined,
  CompassOutlined,
  CloudSyncOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";

const { Text, Title } = Typography;

type WeatherCurrent = {
  temperature_2m?: number;
  apparent_temperature?: number;
  relative_humidity_2m?: number;
  precipitation?: number;
  rain?: number;
  showers?: number;
  snowfall?: number;
  cloud_cover?: number;
  surface_pressure?: number;
  visibility?: number;
  wind_speed_10m?: number;
  wind_direction_10m?: number;
  wind_gusts_10m?: number;
  weather_code?: number;
  time?: string;
};

type WeatherDaily = {
  time: string[]; // yyyy-mm-dd
  weather_code?: number[];
  temperature_2m_max?: number[];
  temperature_2m_min?: number[];
  precipitation_sum?: number[];
  precipitation_probability_max?: number[];
  wind_speed_10m_max?: number[];
  wind_gusts_10m_max?: number[];
  wind_direction_10m_dominant?: number[];
  sunrise?: string[];
  sunset?: string[];
};

type WeatherData = {
  place: string;
  ts: number;
  lat: number;
  lon: number;
  timezone?: string;

  current: WeatherCurrent;
  daily?: WeatherDaily;
};

const CACHE_KEY = "demo_weather_cache_v2";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 min

function roundCoord(v: number) {
  return Math.round(v * 100) / 100;
}

function safeNum(v: any): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function iconFromWeatherCode(code: number) {
  if (code === 0) return <SunOutlined />;
  if ([1, 2, 3].includes(code)) return <CloudOutlined />;
  if ([45, 48].includes(code)) return <EyeOutlined />;

  // lluvia
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return <CloudDownloadOutlined />;
  }

  // nieve
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return <CloudOutlined />;
  }

  // tormenta
  if ([95, 96, 99].includes(code)) {
    return <ThunderboltOutlined />;
  }

  return <CloudOutlined />;
}

function labelFromWeatherCode(code: number) {
  if (code === 0) return "Despejado";
  if ([1, 2, 3].includes(code)) return "Nublado";
  if ([45, 48].includes(code)) return "Niebla";
  if ([51, 53, 55, 56, 57].includes(code)) return "Llovizna";
  if ([61, 63, 65, 66, 67].includes(code)) return "Lluvia";
  if ([80, 81, 82].includes(code)) return "Chubascos";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Nieve";
  if ([95, 96, 99].includes(code)) return "Tormenta";
  return "Clima";
}

function degToCompass(deg: number) {
  const dirs = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  const idx = Math.round((deg % 360) / 45) % 8;
  return dirs[idx];
}

function fmtMaybe(n: number | null, suffix = "") {
  if (n == null) return "—";
  return `${n}${suffix}`;
}

function fmtKmh(n: number | null) {
  if (n == null) return "—";
  return `${Math.round(n)} km/h`;
}

function fmtMm(n: number | null) {
  if (n == null) return "—";
  return `${n.toFixed(1)} mm`;
}

function fmtPct(n: number | null) {
  if (n == null) return "—";
  return `${Math.round(n)}%`;
}

function timeAgo(ts: number) {
  const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (diffSec < 60) return `${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  return `${diffH}h`;
}

function loadCache(): WeatherData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WeatherData;
    if (!parsed?.ts) return null;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveCache(data: WeatherData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

async function fetchPlace(lat: number, lon: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const json: any = await res.json();
  const a = json?.address;

  const city =
    a?.city ||
    a?.town ||
    a?.village ||
    a?.hamlet ||
    a?.municipality ||
    a?.county;
  const country = a?.country;

  if (city && country) return `${city}, ${country}`;
  if (country) return String(country);
  return "Ubicación";
}

async function fetchWeatherFull(lat: number, lon: number) {
  const currentFields = [
    "temperature_2m",
    "apparent_temperature",
    "relative_humidity_2m",
    "precipitation",
    "rain",
    "showers",
    "snowfall",
    "cloud_cover",
    "surface_pressure",
    "visibility",
    "wind_speed_10m",
    "wind_direction_10m",
    "wind_gusts_10m",
    "weather_code",
  ].join(",");

  const dailyFields = [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_sum",
    "precipitation_probability_max",
    "wind_speed_10m_max",
    "wind_gusts_10m_max",
    "wind_direction_10m_dominant",
    "sunrise",
    "sunset",
  ].join(",");

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=${encodeURIComponent(currentFields)}` +
    `&daily=${encodeURIComponent(dailyFields)}` +
    `&timezone=auto`;

  const res = await fetch(url);
  const json: any = await res.json();

  const current: WeatherCurrent = json?.current ?? {};
  const daily: WeatherDaily | undefined = json?.daily;

  const temp = safeNum(current?.temperature_2m);
  const code = safeNum(current?.weather_code);
  if (temp == null || code == null) {
    throw new Error("No se pudo leer el clima");
  }

  return {
    current,
    daily,
    timezone: String(json?.timezone ?? ""),
  };
}

type IpLocation = {
  latitude: number;
  longitude: number;
  city?: string;
  country_name?: string;
};

async function fetchLocationByIp(): Promise<{
  lat: number;
  lon: number;
  place: string;
}> {
  const res = await fetch("https://ipapi.co/json/");
  if (!res.ok) throw new Error("No se pudo obtener ubicación por IP");

  const json = (await res.json()) as IpLocation;

  const lat = Number(json.latitude);
  const lon = Number(json.longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error("Ubicación IP inválida");
  }

  const city = json.city ? String(json.city) : "";
  const country = json.country_name ? String(json.country_name) : "";
  const place = [city, country].filter(Boolean).join(", ") || "Ubicación";

  return { lat: roundCoord(lat), lon: roundCoord(lon), place };
}

function LabelValue({
  label,
  icon,
  value,
}: {
  label: string;
  icon?: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <Space size={6}>
        {icon}
        <Text type="secondary">{label}:</Text>
      </Space>
      <div style={{ marginTop: 2 }}>
        <Text style={{ fontSize: 14 }}>{value}</Text>
      </div>
    </div>
  );
}

function StatCard({
  title,
  icon,
  value,
  subtitle,
}: {
  title: string;
  icon: React.ReactNode;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <Card size="small" style={{ height: "100%" }}>
      <Space orientation="vertical" size={2} style={{ width: "100%" }}>
        <Space size={8}>
          {icon}
          <Text type="secondary">{title}</Text>
        </Space>
        <Text style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.1 }}>
          {value}
        </Text>
        {subtitle ? <Text type="secondary">{subtitle}</Text> : null}
      </Space>
    </Card>
  );
}

export default function WeatherBadge() {
  const [data, setData] = useState<WeatherData | null>(() => loadCache());
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const buildAndSave = useCallback(
    async (lat: number, lon: number, placeHint?: string) => {
      const [{ current, daily, timezone }, place] = await Promise.all([
        fetchWeatherFull(lat, lon),
        placeHint
          ? Promise.resolve(placeHint)
          : fetchPlace(lat, lon).catch(() => "Ubicación"),
      ]);

      const next: WeatherData = {
        place,
        ts: Date.now(),
        lat,
        lon,
        timezone,
        current,
        daily,
      };

      saveCache(next);
      setData(next);
      setError(null);
    },
    [],
  );

  const resolveInitial = useCallback(async () => {
    const cached = loadCache();
    if (cached) {
      setData(cached);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const lat = roundCoord(pos.coords.latitude);
            const lon = roundCoord(pos.coords.longitude);
            await buildAndSave(lat, lon);
          } catch (e: any) {
            setError(e?.message ?? "Error de clima");
          }
        },
        async () => {
          try {
            const loc = await fetchLocationByIp();
            await buildAndSave(loc.lat, loc.lon, loc.place);
          } catch (e: any) {
            setError(e?.message ?? "Permiso denegado");
          }
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 },
      );
      return;
    }

    try {
      const loc = await fetchLocationByIp();
      await buildAndSave(loc.lat, loc.lon, loc.place);
    } catch (e: any) {
      setError(e?.message ?? "Sin geolocalización");
    }
  }, [buildAndSave]);

  useEffect(() => {
    resolveInitial();
  }, [resolveInitial]);

  const weatherCode = useMemo(
    () => safeNum(data?.current?.weather_code) ?? null,
    [data],
  );
  const tempC = useMemo(
    () => safeNum(data?.current?.temperature_2m) ?? null,
    [data],
  );

  const icon = useMemo(() => {
    if (weatherCode == null) return <CloudOutlined />;
    return iconFromWeatherCode(weatherCode);
  }, [weatherCode]);

  const label = useMemo(() => {
    if (weatherCode == null) return "Clima";
    return labelFromWeatherCode(weatherCode);
  }, [weatherCode]);

  const handleRefresh = useCallback(async () => {
    try {
      setLoading(true);

      if (data?.lat != null && data?.lon != null) {
        await buildAndSave(data.lat, data.lon, data.place);
        return;
      }
      await resolveInitial();
    } catch (e: any) {
      setError(e?.message ?? "Error al actualizar");
    } finally {
      setLoading(false);
    }
  }, [data, buildAndSave, resolveInitial]);

  const apparent = safeNum(data?.current?.apparent_temperature);
  const humidity = safeNum(data?.current?.relative_humidity_2m);
  const wind = safeNum(data?.current?.wind_speed_10m);
  const windDir = safeNum(data?.current?.wind_direction_10m);
  const gusts = safeNum(data?.current?.wind_gusts_10m);
  const precip = safeNum(data?.current?.precipitation);
  const cloud = safeNum(data?.current?.cloud_cover);
  const pressure = safeNum(data?.current?.surface_pressure);
  const visM = safeNum(data?.current?.visibility);

  const tomorrow = useMemo(() => {
    const d = data?.daily;
    if (!d?.time?.length) return null;
    if (d.time.length < 2) return null;

    const i = 1;

    const code = d.weather_code?.[i] ?? null;
    const tmax = d.temperature_2m_max?.[i] ?? null;
    const tmin = d.temperature_2m_min?.[i] ?? null;
    const psum = d.precipitation_sum?.[i] ?? null;
    const pprob = d.precipitation_probability_max?.[i] ?? null;
    const wmax = d.wind_speed_10m_max?.[i] ?? null;
    const gmax = d.wind_gusts_10m_max?.[i] ?? null;
    const wdir = d.wind_direction_10m_dominant?.[i] ?? null;
    const sunrise = d.sunrise?.[i] ?? null;
    const sunset = d.sunset?.[i] ?? null;
    const date = d.time[i];

    return {
      date,
      code: safeNum(code),
      tmax: safeNum(tmax),
      tmin: safeNum(tmin),
      psum: safeNum(psum),
      pprob: safeNum(pprob),
      wmax: safeNum(wmax),
      gmax: safeNum(gmax),
      wdir: safeNum(wdir),
      sunrise: sunrise ? String(sunrise) : null,
      sunset: sunset ? String(sunset) : null,
    };
  }, [data]);

  const tomorrowLabel = useMemo(() => {
    if (!tomorrow?.code && tomorrow?.code !== 0) return "—";
    return labelFromWeatherCode(tomorrow.code);
  }, [tomorrow]);

  const tomorrowIcon = useMemo(() => {
    if (!tomorrow?.code && tomorrow?.code !== 0) return <CloudOutlined />;
    return iconFromWeatherCode(tomorrow.code);
  }, [tomorrow]);

  return (
    <>
      <Tooltip title="Ver clima">
        <Space
          size={6}
          align="center"
          style={{ cursor: "pointer" }}
          role="button"
          tabIndex={0}
          onClick={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setOpen(true);
          }}
        >
          <Text style={{ fontWeight: 600, lineHeight: 1 }}>
            {tempC == null ? "…" : `${Math.round(tempC)}°`}
          </Text>
          {icon}
        </Space>
      </Tooltip>

      <Drawer
        title={
          <Space size={8}>
            <CloudSyncOutlined />
            <span>Clima</span>
          </Space>
        }
        open={open}
        onClose={() => setOpen(false)}
        width={520}
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Actualizar
          </Button>
        }
      >
        {!data && !error && <Text type="secondary">Cargando clima…</Text>}

        {error && (
          <Alert
            style={{ marginBottom: 12 }}
            type={data ? "warning" : "error"}
            showIcon
            message={
              data ? "Mostrando datos anteriores" : "No se pudo cargar el clima"
            }
            description={error}
          />
        )}

        {data && (
          <>
            <Card size="small">
              <Space
                align="center"
                size={12}
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Space align="center" size={10}>
                  <span style={{ fontSize: 22, display: "inline-flex" }}>
                    {icon}
                  </span>
                  <div>
                    <Title level={5} style={{ margin: 0 }}>
                      {label}
                    </Title>
                    <Text type="secondary">
                      Actualizado hace {timeAgo(data.ts)}
                    </Text>
                  </div>
                </Space>

                <div style={{ textAlign: "right" }}>
                  <Text
                    style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}
                  >
                    {tempC == null ? "—" : `${Math.round(tempC)}°C`}
                  </Text>
                  <div>
                    <Text type="secondary">
                      Sensación{" "}
                      {fmtMaybe(
                        apparent == null ? null : Math.round(apparent),
                        "°C",
                      )}
                    </Text>
                  </div>
                </div>
              </Space>
            </Card>

            <Divider />

            <LabelValue
              label="Ubicación"
              icon={<EnvironmentOutlined />}
              value={data.place}
            />
            <LabelValue
              label="Zona horaria"
              icon={<InfoCircleOutlined />}
              value={data.timezone || "—"}
            />
            <LabelValue
              label="Coordenadas"
              icon={<CompassOutlined />}
              value={`${data.lat}, ${data.lon}`}
            />

            <Divider />

            <Title level={5} style={{ marginTop: 0 }}>
              <Space size={8}>
                <DashboardOutlined />
                <span>Ahora</span>
              </Space>
            </Title>

            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12} md={8}>
                <StatCard
                  title="Humedad"
                  icon={<CloudOutlined />}
                  value={fmtPct(humidity)}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <StatCard
                  title="Viento"
                  icon={<CompassOutlined />}
                  value={fmtKmh(wind)}
                  subtitle={
                    windDir == null
                      ? "—"
                      : `Dirección: ${Math.round(windDir)}° (${degToCompass(windDir)})`
                  }
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <StatCard
                  title="Ráfagas"
                  icon={<ThunderboltOutlined />}
                  value={fmtKmh(gusts)}
                />
              </Col>

              <Col xs={24} sm={12} md={8}>
                <StatCard
                  title="Precipitación"
                  icon={<CloudDownloadOutlined />}
                  value={fmtMm(precip)}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <StatCard
                  title="Nubosidad"
                  icon={<CloudOutlined />}
                  value={fmtPct(cloud)}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <StatCard
                  title="Presión"
                  icon={<InfoCircleOutlined />}
                  value={pressure == null ? "—" : `${Math.round(pressure)} hPa`}
                />
              </Col>

              <Col xs={24} sm={12} md={8}>
                <StatCard
                  title="Visibilidad"
                  icon={<EyeOutlined />}
                  value={visM == null ? "—" : `${Math.round(visM / 1000)} km`}
                />
              </Col>
            </Row>

            <Divider />

            <Title level={5} style={{ marginTop: 0 }}>
              <Space size={8}>
                <CalendarOutlined />
                <span>Mañana</span>
              </Space>
            </Title>

            {tomorrow ? (
              <>
                <Card size="small">
                  <Space
                    align="center"
                    size={12}
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <Space align="center" size={10}>
                      <span style={{ fontSize: 20, display: "inline-flex" }}>
                        {tomorrowIcon}
                      </span>
                      <div>
                        <Text style={{ fontWeight: 600 }}>{tomorrowLabel}</Text>
                        <div>
                          <Text type="secondary">{tomorrow.date}</Text>
                        </div>
                      </div>
                    </Space>

                    <Space size={16}>
                      <Space size={6}>
                        <ArrowUpOutlined />
                        <Text style={{ fontWeight: 600 }}>
                          {tomorrow.tmax == null
                            ? "—"
                            : `${Math.round(tomorrow.tmax)}°`}
                        </Text>
                      </Space>
                      <Space size={6}>
                        <ArrowDownOutlined />
                        <Text style={{ fontWeight: 600 }}>
                          {tomorrow.tmin == null
                            ? "—"
                            : `${Math.round(tomorrow.tmin)}°`}
                        </Text>
                      </Space>
                    </Space>
                  </Space>
                </Card>

                <div style={{ marginTop: 12 }}>
                  <Row gutter={[12, 12]}>
                    <Col xs={24} sm={12} md={8}>
                      <StatCard
                        title="Precipitación"
                        icon={<CloudDownloadOutlined />}
                        value={fmtMm(tomorrow.psum)}
                        subtitle={
                          tomorrow.pprob == null
                            ? undefined
                            : `Prob. máx: ${fmtPct(tomorrow.pprob)}`
                        }
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <StatCard
                        title="Viento máx"
                        icon={<CompassOutlined />}
                        value={fmtKmh(tomorrow.wmax)}
                        subtitle={
                          tomorrow.wdir == null
                            ? "—"
                            : `Dir: ${Math.round(tomorrow.wdir)}° (${degToCompass(tomorrow.wdir)})`
                        }
                      />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <StatCard
                        title="Ráfagas máx"
                        icon={<ThunderboltOutlined />}
                        value={fmtKmh(tomorrow.gmax)}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={12}>
                      <StatCard
                        title="Amanecer"
                        icon={<SunOutlined />}
                        value={
                          tomorrow.sunrise
                            ? new Date(tomorrow.sunrise).toLocaleTimeString()
                            : "—"
                        }
                      />
                    </Col>
                    <Col xs={24} sm={12} md={12}>
                      <StatCard
                        title="Atardecer"
                        icon={<SunOutlined />}
                        value={
                          tomorrow.sunset
                            ? new Date(tomorrow.sunset).toLocaleTimeString()
                            : "—"
                        }
                      />
                    </Col>
                  </Row>
                </div>
              </>
            ) : (
              <Text type="secondary">No hay datos diarios disponibles.</Text>
            )}

            <Divider />

            <LabelValue
              label="Código (Open-Meteo)"
              icon={<InfoCircleOutlined />}
              value={weatherCode == null ? "—" : String(weatherCode)}
            />
          </>
        )}
      </Drawer>
    </>
  );
}
