import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Upload, Target } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              backgroundColor: '#5A9B5C',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '18px'
            }}>
              HB
            </div>
            Helibombas Dashboard
          </Link>
          <ul className="navbar-nav">
            <li>
              <Link 
                to="/" 
                className={`navbar-link ${isActive('/') ? 'active' : ''}`}
              >
                <BarChart3 size={18} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/upload" 
                className={`navbar-link ${isActive('/upload') ? 'active' : ''}`}
              >
                <Upload size={18} />
                Upload Relatórios
              </Link>
            </li>
            <li>
              <Link 
                to="/meta" 
                className={`navbar-link ${isActive('/meta') ? 'active' : ''}`}
              >
                <Target size={18} />
                Configurar Meta
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;