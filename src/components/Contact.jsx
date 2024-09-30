import React, { useState } from 'react'
import MouseFollowFocus from './MouseFollowFocus'
import Navbar from './Navbar'
import styles from './CSS/styles.module.css';

function Contact() {

  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleNav = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  return (
    <div className={`${styles.page__style} ${styles.animate_content}`}  style={{ overflowY: !isNavCollapsed ? 'scroll' : 'hidden' }}>
      <div style={{ zIndex: '50' }}><Navbar toggleNav={toggleNav} isNavCollapsed={isNavCollapsed} /></div>
      <MouseFollowFocus />
      <div className="text-left home-container" style={{ overflowY: !isNavCollapsed ? 'scroll' : 'hidden', float: 'left', width: '50%', zIndex: '1' }}>
        Contact Page
      </div>
    </div>
  )
}

export default Contact
