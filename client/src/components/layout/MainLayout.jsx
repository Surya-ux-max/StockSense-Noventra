import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function MainLayout() {
  const [currentStore, setCurrentStore] = useState('WMT_CA_006');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FAF5E8] text-slate-900 font-sans antialiased selection:bg-[#005CE6]/15 selection:text-[#005CE6]">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentStore={currentStore}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          currentStore={currentStore}
          onChangeStore={setCurrentStore}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ currentStore, setCurrentStore }} />
        </main>
      </div>
    </div>
  );
}
