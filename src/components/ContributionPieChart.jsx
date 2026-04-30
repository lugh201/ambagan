import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { formatCurrency } from '../utils/finance'

const COLORS = [
  '#ff6b4a',
  '#1b8f7a',
  '#f4b400',
  '#3b82f6',
  '#ec4899',
]

const ContributionPieChart = ({ data }) => (
  <section className="card chart-card">
    <div className="section-head">
      <h3>Ambag kada tao</h3>
      <span className="muted">Total na binayad</span>
    </div>

    {data.length === 0 ? (
      <p className="muted">Wala pang data para sa chart.</p>
    ) : (
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )}
  </section>
)

export default ContributionPieChart
