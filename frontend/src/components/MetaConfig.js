import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Save, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MetaConfig = ({ currentMeta, onMetaUpdate }) => {
  const [metaValue, setMetaValue] = useState(2200000);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentMeta) {
      setMetaValue(currentMeta.meta_value || 2200000);
    }
  }, [currentMeta]);

  const handleSave = async () => {
    if (metaValue <= 0) {
      setError('O valor da meta deve ser maior que zero');
      return;
    }

    setSaving(true);
    setError(null);
    setSaveResult(null);

    try {
      const response = await axios.post(`${API}/meta-config`, {
        meta_value: metaValue
      });

      setSaveResult('Meta atualizada com sucesso!');
      if (onMetaUpdate) {
        onMetaUpdate(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao salvar meta');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleInputChange = (e) => {
    const value = parseFloat(e.target.value.replace(/[^\d]/g, ''));
    if (!isNaN(value)) {
      setMetaValue(value);
    }
  };

  const presetValues = [
    { label: 'R$ 1.500.000', value: 1500000 },
    { label: 'R$ 2.000.000', value: 2000000 },
    { label: 'R$ 2.200.000', value: 2200000 },
    { label: 'R$ 2.500.000', value: 2500000 },
    { label: 'R$ 3.000.000', value: 3000000 },
  ];

  return (
    <div className="page-container">
      <div className="container">
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="card-header">
            <h1 className="card-title">
              <Target size={28} style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }} />
              Configuração de Meta
            </h1>
            <p className="card-subtitle">
              Defina a meta mensal de vendas para análise de performance
            </p>
          </div>

          {/* Valor Atual */}
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
            color: 'white',
            marginBottom: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Meta Atual</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>
                {formatCurrency(metaValue)}
              </div>
            </div>
          </div>

          {/* Configuração da Meta */}
          <div className="form-group">
            <label className="form-label">Valor da Meta (R$):</label>
            <input
              type="text"
              className="form-input"
              value={metaValue.toLocaleString('pt-BR')}
              onChange={handleInputChange}
              placeholder="Digite o valor da meta"
              style={{ fontSize: '1.1rem', fontWeight: '500' }}
            />
          </div>

          {/* Valores Pré-definidos */}
          <div className="form-group">
            <label className="form-label">Valores Sugeridos:</label>
            <div className="grid grid-3" style={{ gap: '0.5rem' }}>
              {presetValues.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setMetaValue(preset.value)}
                  className={`btn ${metaValue === preset.value ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Botão de Salvar */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary"
              style={{ minWidth: '200px' }}
            >
              {saving ? (
                <div className="loading">
                  <div className="spinner"></div>
                  Salvando...
                </div>
              ) : (
                <>
                  <Save size={20} />
                  Salvar Meta
                </>
              )}
            </button>
          </div>

          {/* Resultado */}
          {saveResult && (
            <div className="card" style={{ 
              marginTop: '2rem', 
              background: 'linear-gradient(135deg, var(--success-color), #38a169)',
              color: 'white' 
            }}>
              <div style={{ textAlign: 'center' }}>
                <CheckCircle size={48} style={{ marginBottom: '1rem' }} />
                <h3>{saveResult}</h3>
              </div>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="card" style={{ 
              marginTop: '2rem', 
              background: 'linear-gradient(135deg, var(--error-color), #e53e3e)',
              color: 'white' 
            }}>
              <div style={{ textAlign: 'center' }}>
                <AlertCircle size={48} style={{ marginBottom: '1rem' }} />
                <h3>{error}</h3>
              </div>
            </div>
          )}

          {/* Informações */}
          <div className="card" style={{ 
            marginTop: '2rem', 
            background: 'var(--background-light)',
            border: '1px solid var(--border-color)'
          }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
              <TrendingUp size={20} style={{ marginRight: '0.5rem' }} />
              Como funciona a Meta:
            </h4>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0,
              lineHeight: '1.8'
            }}>
              <li>• A meta é usada para calcular a performance mensal</li>
              <li>• Valores acima de 100% indicam superação da meta</li>
              <li>• A análise de IA considera a meta para gerar insights</li>
              <li>• Histórico de metas permite comparação de períodos</li>
              <li>• Meta pode ser ajustada a qualquer momento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaConfig;