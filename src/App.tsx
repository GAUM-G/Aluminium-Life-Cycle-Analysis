import React, { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import LCAAssessment from './components/LCAAssessment';
import OutputPage from './components/OutputPage';
import CustomProduct from './components/CustomProduct';
import ViewReports from './components/ViewReports';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Context for global state management
interface User {
  username: string;
  email: string;
}

interface AssessmentData {
  product: string;
  units: number;
  route: string;
  bauxiteGrade: string;
  energySource: string;
  endOfLife: string;
  dimensions: Record<string, number>;
  timestamp: string;
  id: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentAssessment: AssessmentData | null;
  setCurrentAssessment: (assessment: AssessmentData | null) => void;
  reports: AssessmentData[];
  addReport: (report: AssessmentData) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentData | null>(null);
  const [reports, setReports] = useState<AssessmentData[]>([]);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const addReport = (report: AssessmentData) => {
    setReports(prev => [report, ...prev]);
  };

  const contextValue: AppContextType = {
    user,
    setUser,
    currentPage,
    setCurrentPage,
    currentAssessment,
    setCurrentAssessment,
    reports,
    addReport,
    sidebarExpanded,
    setSidebarExpanded,
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignupPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'lca-assessment':
        return <LCAAssessment />;
      case 'output':
        return <OutputPage />;
      case 'custom-product':
        return <CustomProduct />;
      case 'view-reports':
        return <ViewReports />;
      default:
        return <Dashboard />;
    }
  };

  const showLayout = user && currentPage !== 'login' && currentPage !== 'signup';

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {showLayout && (
          <>
            <Navbar />
            <Sidebar />
          </>
        )}
        
        <div className={showLayout ? `${sidebarExpanded ? 'ml-64' : 'ml-16'} pt-16 transition-all duration-300` : ""}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="min-h-screen"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AppContext.Provider>
  );
}