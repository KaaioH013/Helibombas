import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Components
import Dashboard from './components/Dashboard';
import UploadReports from './components/UploadReports';
import MetaConfig from './components/MetaConfig';
import Navbar from './components/Navbar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [metaConfig, setMetaConfig] = useState({ meta_value: 2200000 });

  useEffect(() => {
    fetchAnalyses();
    fetchMetaConfig();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await axios.get(`${API}/analyses`);
      setAnalyses(response.data);
      if (response.data.length > 0) {
        setCurrentAnalysis(response.data[0]);
      }
    } catch (error) {
      console.error('Erro ao buscar análises:', error);
    }
  };

  const fetchMetaConfig = async () => {
    try {
      const response = await axios.get(`${API}/meta-config`);
      setMetaConfig(response.data);
    } catch (error) {
      console.error('Erro ao buscar configuração de meta:', error);
    }
  };

  const handleUploadSuccess = (newAnalysis) => {
    console.log('handleUploadSuccess called with:', newAnalysis);
    setCurrentAnalysis(newAnalysis);
    // Também atualizar a lista de análises
    fetchAnalyses();
  };

  const handleMetaUpdate = (newMeta) => {
    setMetaConfig(newMeta);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route 
            path="/" 
            element={
              <Dashboard 
                analysis={currentAnalysis} 
                metaConfig={metaConfig}
                analyses={analyses}
                onAnalysisSelect={setCurrentAnalysis}
              />
            } 
          />
          <Route 
            path="/upload" 
            element={
              <UploadReports 
                onUploadSuccess={handleUploadSuccess}
              />
            } 
          />
          <Route 
            path="/meta" 
            element={
              <MetaConfig 
                currentMeta={metaConfig}
                onMetaUpdate={handleMetaUpdate}
              />
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;