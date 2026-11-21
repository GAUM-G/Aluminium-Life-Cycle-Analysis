import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useAppContext } from '../App';
import { ArrowRight, BarChart3, Leaf, Recycle, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { setCurrentPage, user, reports } = useAppContext();

  // Calculate actual metrics from reports
  const recycledReports = reports.filter(r => r.route === 'recycled').length;
  const renewableReports = reports.filter(r => r.energySource === 'renewable').length;
  const recycleEndOfLife = reports.filter(r => r.endOfLife === 'recycle').length;
  
  const co2Reduced = reports.length > 0 ? (recycledReports * 1.2 + renewableReports * 0.8).toFixed(1) + 't' : '0t';
  const materialsRecycled = reports.length > 0 ? Math.round((recycleEndOfLife / reports.length) * 100) + '%' : '0%';
  const efficiencyGain = reports.length > 0 ? Math.round((renewableReports / reports.length) * 45 + 15) + '%' : '0%';

  const stats = [
    {
      icon: BarChart3,
      label: "Total Assessments",
      value: reports.length.toString(),
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Leaf,
      label: "CO₂ Reduced",
      value: co2Reduced,
      color: "from-green-500 to-green-600"
    },
    {
      icon: Recycle,
      label: "Materials Recycled",
      value: materialsRecycled,
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: TrendingUp,
      label: "Efficiency Gain",
      value: efficiencyGain,
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Ready to analyze your product's environmental impact?
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-center"
      >
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-2xl">
          <CardContent className="p-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-5xl mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
            >
              Get Your LCA Report
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-xl text-gray-600 mb-8"
            >
              Analyze the environmental impact of your aluminum products with comprehensive life cycle assessment
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => setCurrentPage('lca-assessment')}
                className="group bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Assessment
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setCurrentPage('custom-product')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg mb-2">Custom Product Analysis</h3>
                <p className="text-gray-600">Upload your own product specifications</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setCurrentPage('view-reports')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg mb-2">View Past Reports</h3>
                <p className="text-gray-600">Access your assessment history</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}