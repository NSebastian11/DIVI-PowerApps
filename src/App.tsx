import { useState } from 'react'
import './App.css'

const kpis = [
  { label: 'Ventas Totales', value: '$284,500', change: '+12.4%', up: true, icon: '💰' },
  { label: 'Clientes Activos', value: '1,342', change: '+8.1%', up: true, icon: '👥' },
  { label: 'Pedidos del Mes', value: '876', change: '-3.2%', up: false, icon: '📦' },
  { label: 'Tasa de Conversión', value: '24.8%', change: '+2.1%', up: true, icon: '📈' },
]

const barData = [
  { mes: 'Ene', valor: 45000 },
  { mes: 'Feb', valor: 52000 },
  { mes: 'Mar', valor: 48000 },
  { mes: 'Abr', valor: 61000 },
  { mes: 'May', valor: 55000 },
  { mes: 'Jun', valor: 67000 },
  { mes: 'Jul', valor: 72000 },
  { mes: 'Ago', valor: 69000 },
  { mes: 'Sep', valor: 78000 },
  { mes: 'Oct', valor: 82000 },
  { mes: 'Nov', valor: 91000 },
  { mes: 'Dic', valor: 95000 },
]

const donutData = [
  { label: 'Producto A', value: 38, color: '#0078d4' },
  { label: 'Producto B', value: 27, color: '#00b4d8' },
  { label: 'Producto C', value: 20, color: '#48cae4' },
  { label: 'Otros', value: 15, color: '#90e0ef' },
]

const tableData = [
  { id: 'PED-001', cliente: 'Corporación Alpha', monto: '$12,400', estado: 'Completado', fecha: '2026-06-01' },
  { id: 'PED-002', cliente: 'Industrias Beta', monto: '$8,750', estado: 'En proceso', fecha: '2026-06-03' },
  { id: 'PED-003', cliente: 'Grupo Gamma', monto: '$21,300', estado: 'Completado', fecha: '2026-06-04' },
  { id: 'PED-004', cliente: 'Servicios Delta', monto: '$5,900', estado: 'Pendiente', fecha: '2026-06-05' },
  { id: 'PED-005', cliente: 'Logística Épsilon', monto: '$14,200', estado: 'En proceso', fecha: '2026-06-07' },
  { id: 'PED-006', cliente: 'Tech Zeta Corp', monto: '$33,100', estado: 'Completado', fecha: '2026-06-08' },
]

const maxBarVal = Math.max(...barData.map(d => d.valor))

function BarChart() {
  const W = 600, H = 200, pad = 30
  const barW = (W - pad * 2) / barData.length - 6

  return (
    <svg viewBox={`0 0 ${W} ${H + 30}`} className="chart-svg" aria-label="Gráfico de ventas mensuales">
      {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
        const y = pad + (H - pad * 2) * (1 - tick)
        return (
          <g key={tick}>
            <line x1={pad} y1={y} x2={W - 10} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={pad - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#6b7280">
              {Math.round(maxBarVal * tick / 1000)}k
            </text>
          </g>
        )
      })}
      {barData.map((d, i) => {
        const barH = ((d.valor / maxBarVal) * (H - pad * 2))
        const x = pad + i * ((W - pad * 2) / barData.length) + 3
        const y = pad + (H - pad * 2) - barH
        return (
          <g key={d.mes}>
            <rect
              x={x} y={y} width={barW} height={barH}
              rx="4"
              fill="url(#barGrad)"
              className="bar-rect"
            />
            <text x={x + barW / 2} y={H + pad - 10} textAnchor="middle" fontSize="9" fill="#6b7280">
              {d.mes}
            </text>
          </g>
        )
      })}
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0078d4" />
          <stop offset="100%" stopColor="#00b4d8" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function DonutChart() {
  const R = 70, cx = 100, cy = 100, inner = 40
  let cumAngle = -Math.PI / 2

  const slices = donutData.map(d => {
    const angle = (d.value / 100) * 2 * Math.PI
    const start = cumAngle
    cumAngle += angle
    const x1 = cx + R * Math.cos(start)
    const y1 = cy + R * Math.sin(start)
    const x2 = cx + R * Math.cos(cumAngle)
    const y2 = cy + R * Math.sin(cumAngle)
    const xi1 = cx + inner * Math.cos(start)
    const yi1 = cy + inner * Math.sin(start)
    const xi2 = cx + inner * Math.cos(cumAngle)
    const yi2 = cy + inner * Math.sin(cumAngle)
    const large = angle > Math.PI ? 1 : 0
    return {
      ...d,
      path: `M${xi1} ${yi1} L${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2} L${xi2} ${yi2} A${inner} ${inner} 0 ${large} 0 ${xi1} ${yi1} Z`,
    }
  })

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 200 200" className="donut-svg" aria-label="Distribución por producto">
        {slices.map(s => (
          <path key={s.label} d={s.path} fill={s.color} className="donut-slice" />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="#374151" fontWeight="600">Total</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="18" fill="#0078d4" fontWeight="700">100%</text>
      </svg>
      <div className="donut-legend">
        {donutData.map(d => (
          <div key={d.label} className="legend-item">
            <span className="legend-dot" style={{ background: d.color }} />
            <span className="legend-label">{d.label}</span>
            <span className="legend-val">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'resumen' | 'ventas' | 'pedidos'>('resumen')
  const [search, setSearch] = useState('')

  const filtered = tableData.filter(r =>
    r.cliente.toLowerCase().includes(search.toLowerCase()) ||
    r.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-brand">
          <div className="dash-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="11" height="11" fill="#f25022" />
              <rect x="13" width="11" height="11" fill="#7fba00" />
              <rect y="13" width="11" height="11" fill="#00a4ef" />
              <rect x="13" y="13" width="11" height="11" fill="#ffb900" />
            </svg>
          </div>
          <span className="dash-title">Panel de Controll</span>
        </div>
        <nav className="dash-nav">
          {(['resumen', 'ventas', 'pedidos'] as const).map(tab => (
            <button
              key={tab}
              className={`nav-btn${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        <div className="dash-meta">
          <span className="dash-date">Junio 2026</span>
          <div className="dash-avatar">NS</div>
        </div>
      </header>

      <main className="dash-main">
        {/* KPI Cards */}
        <section className="kpi-grid">
          {kpis.map(k => (
            <div key={k.label} className="kpi-card">
              <div className="kpi-icon">{k.icon}</div>
              <div className="kpi-info">
                <p className="kpi-label">{k.label}</p>
                <p className="kpi-value">{k.value}</p>
              </div>
              <span className={`kpi-change${k.up ? ' up' : ' down'}`}>
                {k.up ? '▲' : '▼'} {k.change}
              </span>
            </div>
          ))}
        </section>

        {/* Charts */}
        <section className="charts-row">
          <div className="chart-card wide">
            <div className="chart-header">
              <h3 className="chart-title">Ventas Mensuales</h3>
              <span className="chart-sub">Enero – Diciembre 2026</span>
            </div>
            <BarChart />
          </div>
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Distribución de Ventas</h3>
              <span className="chart-sub">Por categoría</span>
            </div>
            <DonutChart />
          </div>
        </section>

        {/* Table */}
        <section className="table-card">
          <div className="table-header">
            <h3 className="chart-title">Pedidos Recientes</h3>
            <input
              className="search-input"
              type="text"
              placeholder="Buscar pedido o cliente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Cliente</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="no-results">Sin resultados</td></tr>
                ) : (
                  filtered.map(row => (
                    <tr key={row.id}>
                      <td className="td-id">{row.id}</td>
                      <td>{row.cliente}</td>
                      <td className="td-monto">{row.monto}</td>
                      <td>
                        <span className={`badge badge-${row.estado.replace(' ', '-').toLowerCase()}`}>
                          {row.estado}
                        </span>
                      </td>
                      <td className="td-fecha">{row.fecha}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            Mostrando {filtered.length} de {tableData.length} registros
          </div>
        </section>
      </main>
    </div>
  )
}
