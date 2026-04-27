import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Sun, Moon, Bell, Search, Activity, Network, Server, Shield, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-background text-textMain flex flex-col md:flex-row font-sans transition-colors duration-300">
      {/* Mobile Header Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 h-screen z-30 w-64 glass-card rounded-none border-t-0 border-b-0 border-l-0 border-r flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}`}>
        <div className="p-4 flex items-center justify-between">
          <div className={`flex items-center gap-3 font-bold text-xl ${!isSidebarOpen && 'md:hidden'}`}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg glow-primary">
              <Activity size={18} />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-info">LocalNet View</span>
          </div>
          <button className="md:hidden text-textMuted hover:text-textMain" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2">
          <NavItem to="/dashboard" icon={<Network size={20} />} label="Dashboard" isOpen={isSidebarOpen} />
          <NavItem to="/devices" icon={<Server size={20} />} label="Devices" isOpen={isSidebarOpen} />
          <NavItem to="/security" icon={<Shield size={20} />} label="Security" isOpen={isSidebarOpen} />
          <NavItem to="/analytics" icon={<Activity size={20} />} label="Analytics" isOpen={isSidebarOpen} />
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" isOpen={isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-border">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'md:justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-info p-[2px]">
              <div className="w-full h-full bg-surface rounded-full flex items-center justify-center">
                <span className="font-bold text-sm">TW</span>
              </div>
            </div>
            <div className={`${!isSidebarOpen && 'md:hidden'}`}>
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-textMuted">admin@localnet</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        {/* Header */}
        <header className="h-16 glass-card rounded-none border-t-0 border-l-0 border-r-0 border-b flex items-center justify-between px-4 md:px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-textMuted hover:text-textMain" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search networks, devices..." 
                className="bg-surface/50 border border-border rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all focus:w-80"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-textMuted hover:text-textMain hover:bg-surface rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-pulse-slow glow-error"></span>
            </button>
            <button 
              className="p-2 text-textMuted hover:text-textMain hover:bg-surface rounded-full transition-colors"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label, isOpen }: { to: string, icon: React.ReactNode, label: string, isOpen: boolean }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-textMuted hover:bg-surface hover:text-textMain'} group`}
  >
    {({ isActive }) => (
      <>
        <div className={`${isActive ? 'text-primary' : 'text-textMuted group-hover:text-textMain'}`}>
          {icon}
        </div>
        <span className={`transition-opacity duration-200 ${!isOpen ? 'md:opacity-0 md:hidden' : 'opacity-100'}`}>
          {label}
        </span>
      </>
    )}
  </NavLink>
);
