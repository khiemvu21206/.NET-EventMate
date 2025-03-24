"use client";
import React from 'react';
import MapContainer from '../../../../components/map/MapContainer';
import Navbar from '@/components/group/Navbar';

const App: React.FC = () => {
  return (
    <div>
      <div className="flex min-h-screen bg-white">
        <Navbar />
        <MapContainer />
      </div>

    </div>
  );
};

export default App;  