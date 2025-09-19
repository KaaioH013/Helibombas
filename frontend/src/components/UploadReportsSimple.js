import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const UploadReportsSimple = ({ onUploadSuccess }) => {
  const navigate = useNavigate();
  const [files, setFiles] = useState({ report_530: null, report_549: null });
  const [monthYear, setMonthYear] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileInput530 = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFiles(prev => ({ ...prev, report_530: selectedFile }));
      setError(null);
    }
  };

  const handleFileInput549 = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFiles(prev => ({ ...prev, report_549: selectedFile }));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!files.report_530 || !files.report_549 || !monthYear) {
      setError('Por favor, selecione ambos os relatórios e informe o período');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('month_year', monthYear);
      formData.append('report_530', files.report_530);
      formData.append('report_549', files.report_549);

      const response = await axios.post(`${API}/upload-reports`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadResult(response.data);
      if (onUploadSuccess) {
        // Criar o objeto de análise com a estrutura correta
        const analysisData = {
          id: response.data.analysis_id,
          month_year: monthYear,
          charts_data: response.data.charts_data,
          ai_analysis: response.data.ai_analysis,
          created_at: new Date().toISOString()
        };
        console.log('Calling onUploadSuccess with:', analysisData);
        onUploadSuccess(analysisData);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao fazer upload dos relatórios');
    } finally {
      setUploading(false);
    }
  };

  const getCurrentMonthYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card-header">
            <h1 className="card-title">
              <FileText size={28} style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }} />
              Upload de Relatórios Helibombas
            </h1>
            <p className="card-subtitle">
              Faça upload dos relatórios 530 e 549 para gerar análise automática
            </p>
          </div>

          {/* Seleção do Período */}
          <div className="form-group">
            <label className="form-label">Período (Mês/Ano):</label>
            <input
              type="month"
              className="form-input"
              value={monthYear}
              onChange={(e) => setMonthYear(e.target.value)}
              max={getCurrentMonthYear()}
              style={{ maxWidth: '200px' }}
            />
          </div>

          {/* Upload Relatório 530 */}
          <div className="form-group">
            <label className="form-label">Relatório 530 (Dados Oficiais):</label>
            {files.report_530 ? (
              <div className="card" style={{ 
                background: 'linear-gradient(135deg, var(--success-color), #38a169)',
                color: 'white',
                textAlign: 'center',
                padding: '2rem'
              }}>
                <CheckCircle size={48} style={{ marginBottom: '1rem' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>Relatório 530 Carregado</h3>
                <p style={{ marginBottom: '1rem' }}>
                  {files.report_530.name} ({(files.report_530.size / 1024 / 1024).toFixed(2)} MB)
                </p>
                <button 
                  type="button"
                  onClick={() => setFiles(prev => ({ ...prev, report_530: null }))}
                  className="btn"
                  style={{
                    background: 'white',
                    color: 'var(--success-color)',
                    fontWeight: '600'
                  }}
                >
                  Alterar Arquivo
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <label className="btn btn-primary" style={{ 
                  cursor: 'pointer',
                  minWidth: '300px',
                  padding: '1rem 2rem',
                  fontSize: '1.1rem'
                }}>
                  <Upload size={20} style={{ marginRight: '0.5rem' }} />
                  Selecionar Relatório 530
                  <input
                    type="file"
                    accept=".pdf,.xlsx,.xls"
                    onChange={handleFileInput530}
                    style={{ display: 'none' }}
                  />
                </label>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                  Formatos aceitos: PDF, Excel (.xlsx, .xls)
                </p>
              </div>
            )}
          </div>

          {/* Upload Relatório 549 */}
          <div className="form-group">
            <label className="form-label">Relatório 549 (Análises Detalhadas):</label>
            {files.report_549 ? (
              <div className="card" style={{ 
                background: 'linear-gradient(135deg, var(--success-color), #38a169)',
                color: 'white',
                textAlign: 'center',
                padding: '2rem'
              }}>
                <CheckCircle size={48} style={{ marginBottom: '1rem' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>Relatório 549 Carregado</h3>
                <p style={{ marginBottom: '1rem' }}>
                  {files.report_549.name} ({(files.report_549.size / 1024 / 1024).toFixed(2)} MB)
                </p>
                <button 
                  type="button"
                  onClick={() => setFiles(prev => ({ ...prev, report_549: null }))}
                  className="btn"
                  style={{
                    background: 'white',
                    color: 'var(--success-color)',
                    fontWeight: '600'
                  }}
                >
                  Alterar Arquivo
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <label className="btn btn-primary" style={{ 
                  cursor: 'pointer',
                  minWidth: '300px',
                  padding: '1rem 2rem',
                  fontSize: '1.1rem'
                }}>
                  <Upload size={20} style={{ marginRight: '0.5rem' }} />
                  Selecionar Relatório 549
                  <input
                    type="file"
                    accept=".pdf,.xlsx,.xls"
                    onChange={handleFileInput549}
                    style={{ display: 'none' }}
                  />
                </label>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                  Formatos aceitos: PDF, Excel (.xlsx, .xls)
                </p>
              </div>
            )}
          </div>

          {/* Botão de Upload */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={handleUpload}
              disabled={!files.report_530 || !files.report_549 || !monthYear || uploading}
              className="btn btn-primary"
              style={{ minWidth: '200px' }}
            >
              {uploading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  Processando...
                </div>
              ) : (
                <>
                  <Upload size={20} />
                  Processar Relatórios
                </>
              )}
            </button>
          </div>

          {/* Resultado do Upload */}
          {uploadResult && (
            <div className="card" style={{ 
              marginTop: '2rem', 
              background: 'linear-gradient(135deg, var(--success-color), #38a169)',
              color: 'white' 
            }}>
              <div style={{ textAlign: 'center' }}>
                <CheckCircle size={48} style={{ marginBottom: '1rem' }} />
                <h3 style={{ marginBottom: '1rem' }}>Relatórios Processados com Sucesso!</h3>
                <p style={{ marginBottom: '1.5rem' }}>
                  {uploadResult.message}
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="btn" 
                  style={{ 
                    background: 'white', 
                    color: 'var(--success-color)',
                    fontWeight: '600'
                  }}
                >
                  Ver Dashboard
                </button>
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
                <h3 style={{ marginBottom: '1rem' }}>Erro no Processamento</h3>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Informações Adicionais */}
          <div className="card" style={{ 
            marginTop: '2rem', 
            background: 'var(--background-light)',
            border: '1px solid var(--border-color)'
          }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
              Informações Importantes:
            </h4>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0,
              lineHeight: '1.8'
            }}>
              <li>• <strong>Relatório 530:</strong> Contém dados oficiais de vendas e valores corretos</li>
              <li>• <strong>Relatório 549:</strong> Contém análises detalhadas de vendedores, estados e clientes</li>
              <li>• <strong>Formatos:</strong> PDF ou Excel (.xlsx, .xls)</li>
              <li>• <strong>Análise:</strong> IA gera insights automáticos como coordenador comercial</li>
              <li>• <strong>Histórico:</strong> Relatórios são salvos para comparação mensal</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadReportsSimple;