import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAppContext } from '../App';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Package, 
  Leaf,
  Clock
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ViewReports() {
  const { reports, setCurrentAssessment, setCurrentPage } = useAppContext();

  // Fixed values matching OutputPage (always shows 900 units data)
  const lcaData = {
    totalCO2: 80730,
    totalElectricity: 211500,
    totalWater: 79200,
    totalCost: 588000,
    stages: [
      { name: 'Casting', co2: 14400, electricity: 36000, cost: 110700, naturalGas: 135, wastewater: 16200 },
      { name: 'Extrusion', co2: 25200, electricity: 67500, cost: 211500, naturalGas: 225, wastewater: 22500 },
      { name: 'Quenching', co2: 6750, electricity: 19800, cost: 46800, naturalGas: 54, wastewater: 9000 },
      { name: 'Hot Rolling', co2: 5580, electricity: 16200, cost: 40500, naturalGas: 45, wastewater: 7200 },
      { name: 'Finishing', co2: 7200, electricity: 18000, cost: 58500, naturalGas: 63, wastewater: 10800 },
      { name: 'Heat/Aging', co2: 21600, electricity: 54000, cost: 130500, naturalGas: 180, wastewater: 13500 }
    ]
  };

  const calculateReportMetrics = (units: number) => {
    // Return fixed values to match OutputPage
    return {
      co2: lcaData.totalCO2,
      electricity: lcaData.totalElectricity,
      cost: lcaData.totalCost,
      wastewater: lcaData.totalWater
    };
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProductDisplayName = (product: string) => {
    if (product.startsWith('custom-')) {
      return product.replace('custom-', '').replace('-', ' ').toUpperCase();
    }
    return product.replace('-', ' ').toUpperCase();
  };

  const getRouteColor = (route: string) => {
    return route === 'recycled' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  const handleViewReport = (report: any) => {
    // Set the current assessment without adding it to reports again
    setCurrentAssessment(report);
    setCurrentPage('output');
  };

  const handleDownloadReport = (report: any) => {
    const doc = new jsPDF();
    const metrics = calculateReportMetrics(report.units);
    
    // Header with EcoCycle branding
    doc.setFillColor(34, 197, 94); // Green color
    doc.circle(20, 20, 8, 'F');
    doc.setTextColor(34, 197, 94);
    doc.setFontSize(24);
    doc.text('EcoCycle', 30, 25);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('Life Cycle Assessment Report', 30, 32);
    
    // Report title and date
    doc.setFontSize(18);
    doc.text('LCA Assessment Report', 20, 50);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${formatDate(report.timestamp)}`, 20, 58);
    doc.text(`Report ID: ${report.id}`, 20, 64);
    
    // Product Information Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Product Information', 20, 78);
    
    doc.setFontSize(10);
    const productInfo = [
      ['Product Type', getProductDisplayName(report.product)],
      ['Units', `${report.units} units`],
      ['Manufacturing Route', report.route.charAt(0).toUpperCase() + report.route.slice(1)],
      ['Bauxite Grade', report.bauxiteGrade || 'Standard'],
      ['Energy Source', report.energySource.charAt(0).toUpperCase() + report.energySource.slice(1)],
      ['End of Life', report.endOfLife.charAt(0).toUpperCase() + report.endOfLife.slice(1)]
    ];
    
    (doc as any).autoTable({
      startY: 82,
      head: [['Parameter', 'Value']],
      body: productInfo,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] },
      margin: { left: 20, right: 20 }
    });
    
    // Dimensions Section
    let currentY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Dimensions', 20, currentY);
    
    const dimensionsData = Object.entries(report.dimensions).map(([key, value]) => [
      key.charAt(0).toUpperCase() + key.slice(1),
      `${typeof value === 'number' ? value.toFixed(3) : value}${typeof value === 'number' && key !== 'density' ? ' m' : ''}`
    ]);
    
    (doc as any).autoTable({
      startY: currentY + 4,
      head: [['Dimension', 'Value']],
      body: dimensionsData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 }
    });
    
    // Environmental Impact Summary
    currentY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Environmental Impact Summary', 20, currentY);
    
    const impactData = [
      ['Total CO₂ Emissions', `${metrics.co2.toLocaleString()} kg`],
      ['Total Electricity', `${metrics.electricity.toLocaleString()} kWh`],
      ['Total Wastewater', `${metrics.wastewater.toLocaleString()} L`],
      ['Total Cost', `₹${metrics.cost.toLocaleString()}`]
    ];
    
    (doc as any).autoTable({
      startY: currentY + 4,
      head: [['Metric', 'Value']],
      body: impactData,
      theme: 'striped',
      headStyles: { fillColor: [239, 68, 68] },
      margin: { left: 20, right: 20 }
    });
    
    // Stage-wise Breakdown
    currentY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Stage-wise LCA Breakdown', 20, currentY);
    
    const stageData = lcaData.stages.map(stage => [
      stage.name,
      `${stage.co2.toLocaleString()} kg`,
      `${stage.electricity.toLocaleString()} kWh`,
      `${stage.wastewater.toLocaleString()} L`,
      `₹${stage.cost.toLocaleString()}`
    ]);
    
    (doc as any).autoTable({
      startY: currentY + 4,
      head: [['Stage', 'CO₂ (kg)', 'Electricity (kWh)', 'Wastewater (L)', 'Cost (₹)']],
      body: stageData,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 8 }
    });
    
    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
      doc.text(
        'EcoCycle LCA Platform - Sustainable Manufacturing Analytics',
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 6,
        { align: 'center' }
      );
    }
    
    // Save the PDF
    doc.save(`EcoCycle_LCA_Report_${report.id}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl mb-4 text-center">Assessment Reports</h1>
        <p className="text-gray-600 text-center">
          Access and download your LCA assessment history
        </p>
      </motion.div>

      {reports.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <div className="mb-6">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-gray-600 mb-2">No Reports Yet</h3>
            <p className="text-gray-500">
              Complete your first LCA assessment to see reports here
            </p>
          </div>
          <Button
            onClick={() => setCurrentPage('lca-assessment')}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            Start New Assessment
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-2">
                          {getProductDisplayName(report.product)}
                          {report.isCustom && (
                            <Badge variant="outline" className="ml-2 text-purple-600 border-purple-600">
                              Custom
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(report.timestamp)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Package className="h-4 w-4" />
                            <span>{report.units} units</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReport(report)}
                        className="group hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4 mr-2 group-hover:text-blue-600" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReport(report.id)}
                        className="group hover:bg-green-50"
                      >
                        <Download className="h-4 w-4 mr-2 group-hover:text-green-600" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Route</p>
                      <Badge className={getRouteColor(report.route)}>
                        {report.route}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Energy Source</p>
                      <div className="flex items-center space-x-1">
                        {report.energySource === 'renewable' ? (
                          <Leaf className="h-4 w-4 text-green-500" />
                        ) : (
                          <Leaf className="h-4 w-4 text-orange-500" />
                        )}
                        <span className="text-sm capitalize">{report.energySource}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">End of Life</p>
                      <span className="text-sm capitalize">{report.endOfLife}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Assessment Type</p>
                      <span className="text-sm">
                        {report.isCustom ? 'Custom Product' : 'Standard Product'}
                      </span>
                    </div>
                  </div>

                  {/* Dimensions Preview */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Dimensions</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(report.dimensions).map(([key, value]) => {
                        let displayValue = typeof value === 'number' ? value.toFixed(3) : value;
                        let unit = '';
                        
                        if (typeof value === 'number') {
                          if (key === 'density') {
                            unit = ' kg/m³';
                          } else if (key === 'metalPercentage') {
                            displayValue = value.toFixed(1);
                            unit = '%';
                          } else {
                            unit = ' m';
                          }
                        }
                        
                        return (
                          <Badge key={key} variant="secondary" className="text-xs">
                            {key}: {displayValue}{unit}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-2 bg-red-50 rounded-lg">
                        <p className="text-xs text-red-600">CO₂ Emissions</p>
                        <p className="font-semibold text-red-700">
                          {calculateReportMetrics(report.units).co2.toLocaleString()} kg
                        </p>
                      </div>
                      <div className="p-2 bg-yellow-50 rounded-lg">
                        <p className="text-xs text-yellow-600">Electricity</p>
                        <p className="font-semibold text-yellow-700">
                          {calculateReportMetrics(report.units).electricity.toLocaleString()} kWh
                        </p>
                      </div>
                      <div className="p-2 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-600">Total Cost</p>
                        <p className="font-semibold text-green-700">
                          ₹{calculateReportMetrics(report.units).cost.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {reports.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Assessment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-semibold">{reports.length}</p>
                  <p className="text-sm text-gray-600">Total Reports</p>
                </div>
                
                <div>
                  <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-semibold">
                    {reports.filter(r => r.route === 'recycled').length}
                  </p>
                  <p className="text-sm text-gray-600">Recycled Route</p>
                </div>
                
                <div>
                  <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-semibold">
                    {reports.filter(r => r.isCustom).length}
                  </p>
                  <p className="text-sm text-gray-600">Custom Products</p>
                </div>
                
                <div>
                  <div className="p-3 bg-orange-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <p className="text-2xl font-semibold">
                    {reports.length > 0 ? Math.max(0, Math.floor((Date.now() - new Date(reports[reports.length - 1]?.timestamp || Date.now()).getTime()) / (1000 * 60 * 60 * 24))) : 0}
                  </p>
                  <p className="text-sm text-gray-600">Days Since Last</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}