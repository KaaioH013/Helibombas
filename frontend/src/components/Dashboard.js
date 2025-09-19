import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { TrendingUp, TrendingDown, Users, Package, Target, Clock } from 'lucide-react';

const Dashboard = ({ analysis, metaConfig, analyses, onAnalysisSelect }) => {
  const [selectedMonth, setSelectedMonth] = useState('');

  console.log('Dashboard rendered with analysis:', analysis);
  console.log('Dashboard analyses list:', analyses);

  if (!analysis) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Package size={64} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '1rem' }}>Nenhum relatório carregado</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Faça upload dos relatórios 530 e 549 para visualizar o dashboard.
            </p>
            <a href="/upload" className="btn btn-primary">
              Fazer Upload de Relatórios
            </a>
          </div>
        </div>
      </div>
    );
  }

  const { charts_data, ai_analysis, month_year } = analysis;

  // Formatação de moeda brasileira
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Cores para os gráficos
  const COLORS = ['#5A9B5C', '#4a834c', '#6bb46d', '#78c47a', '#2d4a2e'];

  return (
    <div className="page-container">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Dashboard Comercial
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Análise de Performance - {month_year}
          </p>
        </div>

        {/* Seletor de Mês */}
        {analyses.length > 1 && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="form-label">Selecionar Período:</label>
              <select 
                className="form-input" 
                style={{ maxWidth: '300px' }}
                value={selectedMonth}
                onChange={(e) => {
                  const selected = analyses.find(a => a.id === e.target.value);
                  if (selected) onAnalysisSelect(selected);
                }}
              >
                {analyses.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.month_year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* KPIs Principais */}
        <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-value">
              {formatCurrency(charts_data.performance_vs_meta.current_performance)}
            </div>
            <div className="stat-label">Vendas Realizadas</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ 
              color: charts_data.performance_vs_meta.percentage >= 100 ? 'var(--success-color)' : 'var(--warning-color)' 
            }}>
              {formatPercentage(charts_data.performance_vs_meta.percentage)}
            </div>
            <div className="stat-label">Performance vs Meta</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {formatPercentage(charts_data.kpis.conversion_rate)}
            </div>
            <div className="stat-label">Taxa de Conversão</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {formatCurrency(charts_data.kpis.average_ticket)}
            </div>
            <div className="stat-label">Ticket Médio</div>
          </div>
        </div>

        {/* Performance vs Meta */}
        <div className="chart-container">
          <h3 className="chart-title">
            <Target size={24} style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }} />
            Performance vs Meta
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { 
                name: 'Meta', 
                value: charts_data.performance_vs_meta.meta_target,
                color: '#e2e8f0'
              },
              { 
                name: 'Realizado', 
                value: charts_data.performance_vs_meta.current_performance,
                color: '#5A9B5C'
              }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `R$ ${(value / 1000)}K`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="value" fill="#5A9B5C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
          {/* Distribuição Geográfica */}
          <div className="chart-container">
            <h3 className="chart-title">Distribuição Geográfica</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={charts_data.geographic_distribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ state, percentage }) => `${state}: ${percentage}%`}
                >
                  {charts_data.geographic_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status da Produção */}
          <div className="chart-container">
            <h3 className="chart-title">Status da Produção</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Concluído', value: charts_data.production_status.completed, color: '#48bb78' },
                    { name: 'Em Andamento', value: charts_data.production_status.in_progress, color: '#ed8936' },
                    { name: 'Atrasado', value: charts_data.production_status.delayed, color: '#f56565' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  <Cell fill="#48bb78" />
                  <Cell fill="#ed8936" />
                  <Cell fill="#f56565" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendedores Externos */}
        <div className="chart-container">
          <h3 className="chart-title">
            <Users size={24} style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }} />
            Ranking Vendedores Externos
          </h3>
          {charts_data.external_sellers && charts_data.external_sellers.length > 0 && charts_data.external_sellers[0].name !== "Sem dados vendedor externo" ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts_data.external_sellers} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="sales" fill="#5A9B5C" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem',
              color: 'var(--text-secondary)'
            }}>
              <Users size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <h4>Dados de Vendedores Externos Não Disponíveis</h4>
              <p>Os dados do Relatório 549 são necessários para exibir o ranking de vendedores externos.</p>
            </div>
          )}
        </div>

        <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
          {/* Principais Clientes */}
          <div className="chart-container">
            <h3 className="chart-title">Principais Clientes</h3>
            <div style={{ padding: '1rem 0' }}>
              {charts_data.main_clients.map((client, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.75rem 0',
                  borderBottom: index < charts_data.main_clients.length - 1 ? '1px solid var(--border-color)' : 'none'
                }}>
                  <span style={{ fontWeight: '500' }}>{client.client}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                      {formatCurrency(client.value)}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {client.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Análise de Produtos */}
          <div className="chart-container">
            <h3 className="chart-title">Análise de Produtos</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={charts_data.product_analysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis 
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `R$ ${(value/1000000).toFixed(1)}M`;
                    if (value >= 1000) return `R$ ${(value/1000).toFixed(0)}K`;
                    return formatCurrency(value);
                  }}
                />
                <Tooltip 
                  formatter={(value, name) => [formatCurrency(value), name === 'revenue' ? 'Receita' : name]}
                  labelFormatter={(label) => `Produto: ${label}`}
                />
                <Bar dataKey="revenue" fill="#5A9B5C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Análise de IA */}
        <div className="ai-analysis">
          <h3>
            <TrendingUp size={24} style={{ marginRight: '0.5rem' }} />
            Análise do Coordenador Comercial (IA)
          </h3>
          <pre>{ai_analysis.ai_insights || 'Análise não disponível'}</pre>
        </div>

        {/* KPIs Adicionais */}
        <div className="grid grid-4">
          <div className="stat-card">
            <div className="stat-value">{formatPercentage(charts_data.kpis.client_retention)}</div>
            <div className="stat-label">Retenção de Clientes</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{charts_data.kpis.sales_cycle} dias</div>
            <div className="stat-label">Ciclo de Vendas</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{charts_data.external_sellers.length}</div>
            <div className="stat-label">Vendedores Ativos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{charts_data.main_clients.length}</div>
            <div className="stat-label">Clientes Principais</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;