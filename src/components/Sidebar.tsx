import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { useAppContext } from '../App';
import { 
  Menu, 
  Home, 
  BarChart3, 
  Settings, 
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'lca-assessment', label: 'LCA Assessment', icon: BarChart3 },
  { id: 'custom-product', label: 'Custom Product', icon: Settings },
  { id: 'view-reports', label: 'View Reports', icon: FileText },
];

export default function Sidebar() {
  const { currentPage, setCurrentPage, sidebarExpanded, setSidebarExpanded } = useAppContext();

  return (
    <motion.aside
      initial={{ x: -240, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white/90 backdrop-blur-md border-r border-gray-200 z-40 transition-all duration-300 ${
        sidebarExpanded ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="flex justify-end p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="group transition-all duration-300"
          >
            {sidebarExpanded ? (
              <ChevronLeft className="h-4 w-4 group-hover:text-gray-600" />
            ) : (
              <ChevronRight className="h-4 w-4 group-hover:text-gray-600" />
            )}
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 pb-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start group transition-all duration-300 ${
                      isActive 
                        ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg" 
                        : "hover:bg-gray-50"
                    } ${!sidebarExpanded ? 'px-3' : ''}`}
                    onClick={() => setCurrentPage(item.id)}
                  >
                    <Icon className={`h-5 w-5 ${sidebarExpanded ? 'mr-3' : ''} transition-colors`} />
                    <AnimatePresence>
                      {sidebarExpanded && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <AnimatePresence>
            {sidebarExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-gray-500 text-center"
              >
                Environmental Impact Assessment Platform
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}