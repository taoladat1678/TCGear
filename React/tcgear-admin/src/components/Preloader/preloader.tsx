import React from 'react';
import './preloader.css';

interface PreloaderProps {
  visible?: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ visible = true }) => {
  if (!visible) return null;

  return (
   <div id="preloader" className={!visible ? 'hidden' : ''}>
  <div className="loader" />
</div>

  );
};

export default Preloader;
