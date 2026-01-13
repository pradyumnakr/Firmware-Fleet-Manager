import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Devices from './components/Devices';
import Firmware from './components/Firmware';
import Deployments from './components/Deployments';
import {
  LayoutGrid,
  Server,
  Database,
  Activity,
  Menu,
  Zap,
  ChevronRight,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Define tabs with metadata
  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutGrid },
    { id: 'devices', label: 'Fleet', icon: Server },
    { id: 'firmware', label: 'Firmware', icon: Database },
    { id: 'deploy', label: 'Deployments', icon: Activity },
  ];

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="h-full"
        >
          {(() => {
            switch (activeTab) {
              case 'dashboard': return <Dashboard />;
              case 'devices': return <Devices />;
              case 'firmware': return <Firmware />;
              case 'deploy': return <Deployments />;
              default: return <Dashboard />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  const NavItem = ({ item }) => {
    const isActive = activeTab === item.id;
    return (
      <button
        onClick={() => setActiveTab(item.id)}
        className={`relative w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group overflow-hidden ${isActive
            ? 'text-white bg-white/5 shadow-inner border border-white/5'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
      >
        <item.icon className={`w-4 h-4 mr-3 transition-colors ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-300'}`} />
        {sidebarOpen && <span className="text-sm font-medium tracking-wide">{item.label}</span>}

        {isActive && (
          <motion.div
            layoutId="active-pill"
            className="absolute left-0 w-0.5 h-full bg-indigo-500"
          />
        )}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-black text-gray-200 selection:bg-indigo-500/30 font-sans">

      {/* Background Grid */}
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-20 z-0"></div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 70 }}
        className="relative z-20 flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl"
      >
        <div className="h-16 flex items-center px-5 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Luma<span className="font-normal text-gray-500">OS</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 px-3 py-6 space-y-1">
          <div className="mb-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            {sidebarOpen ? 'Platform' : '..'}
          </div>
          {tabs.map(tab => <NavItem key={tab.id} item={tab} />)}
        </div>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors w-full flex justify-center"
          >
            {sidebarOpen ? <div className="flex items-center text-xs"><span className="mr-2">Collapse</span> <ChevronRight className="w-3 h-3 rotate-180" /></div> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center text-sm text-gray-500">
            <span>Fleet Manager</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-white font-medium capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-0.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3 pl-6 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-800 border border-white/10 ring-2 ring-transparent hover:ring-indigo-500/50 transition-all cursor-pointer"></div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
