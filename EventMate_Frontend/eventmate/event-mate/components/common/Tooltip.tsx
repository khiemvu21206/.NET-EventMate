import React, { useState } from 'react';

interface TooltipProps {
  title: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ title, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap">
          {title}
        </div>
      )}
    </div>
  );
};

export default Tooltip; 