import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import Hamburger from 'hamburger-react';
import './CSS/Navbar.css';

export default function Navbar({ toggleNav, isNavCollapsed }) {
  const [hamburgerDistance, setHamburgerDistance] = useState('md');
  const [menuValue, setMenuValue] = useState('MENU');

  const location = useLocation();

  return (
      <div className={`page-container`}>
        <div className={`justify-content-between w-100 align-items-center menu-container ${!isNavCollapsed ? 'menuValue' : 'closeValue'}`}>
          <NavLink className={`navbar-brand btn`} to="/">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <p
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '50%',
                border: '3.2px solid #fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '1rem'
              }}
            >
              <h5 style={{ margin: '0' }}><b>AV</b></h5>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <h5 style={{ margin: '0' }}><b>Aadhithya Vijayakumar</b></h5>
              <h5 style={{ margin: '0', fontWeight: 'lighter' }}>Web Software Developer</h5>
            </div>
          </div>
          </NavLink>
          <div
            onMouseEnter={() => setHamburgerDistance('lg')}
            onMouseLeave={() => setHamburgerDistance('md')}
            style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
          >
            <b>{menuValue}</b>
            <Hamburger
              toggle={toggleNav}
              toggled={isNavCollapsed}
              direction='left'
              distance={hamburgerDistance}
            />
          </div>
        </div>
        {isNavCollapsed &&
        <nav className={`navbar ${isNavCollapsed ? 'visible' : ''}`} style={{ 'backgroundColor': '#000', 'opacity': '0.9' }}>
          {/* <div className={`nav-links-container mx-auto d-flex justify-content-center ${isNavCollapsed ? 'open' : ''}`}> */}
            <ul className={`navbar-nav mx-auto ${isNavCollapsed ? 'open' : ''}`}>
              MENU
              <li className="nav-item">
                <NavLink className={`nav-link btn btn-2 ${location.pathname === '/' ? '' : 'inactiveLink'}`} to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={`nav-link btn btn-2 ${location.pathname === '/about' ? '' : 'inactiveLink'}`} to="/about">About</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={`nav-link btn btn-2 ${location.pathname === '/projects' ? '' : 'inactiveLink'}`} to="/projects">Projects</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={`nav-link btn btn-2 ${location.pathname === '/contact' ? '' : 'inactiveLink'}`} to="/contact">Contact</NavLink>
              </li>
            </ul>
          {/* </div>   */}
            {/* <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a
                  href="https://github.com/Aadhiv01"
                  className={`nav-link btn`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faGithub} />
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="https://www.linkedin.com/in/aadhithya-vijayakumar-av/"
                  className={`nav-link btn`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
              </li>
            </ul> */}
        </nav>}
    </div>
)};
