import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { useAppContext } from '../App';
import { LogOut, FileText, User } from 'lucide-react';
import logo from 'figma:asset/f6b327be80ba4de0718cce6e2ba9688d5c68277a.png';

export default function Navbar() {
  const { user, setUser, setCurrentPage } = useAppContext();

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50"
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo and Brand */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setCurrentPage('dashboard')}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img src={logo} alt="EcoCycle Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl text-gray-800">EcoCycle</h1>
        </motion.div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg"
          >
            <User className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700">{user?.username}</span>
          </motion.div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage('view-reports')}
            className="group transition-all duration-300 hover:bg-blue-50"
          >
            <FileText className="h-4 w-4 mr-2 group-hover:text-blue-600 transition-colors" />
            View Reports
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="group transition-all duration-300 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2 group-hover:text-red-600 transition-colors" />
            Logout
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}