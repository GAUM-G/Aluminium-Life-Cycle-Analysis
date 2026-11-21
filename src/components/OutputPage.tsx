import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { useAppContext } from '../App';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend
} from 'recharts';
import { 
  Leaf, 
  Zap, 
  Droplets, 
  IndianRupee, 
  TrendingDown, 
  TrendingUp, 
  Download,
  AlertTriangle,
  CheckCircle,
  Recycle
} from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const SANKEY_COLORS = ['#60a5fa', '#f59e0b', '#ec4899'];

// Custom Sankey Diagram Component
const SankeyDiagram: React.FC<{ data: any[], units: number }> = ({ data, units }) => {
  const [showCO2, setShowCO2] = useState(true);
  const [showElectricity, setShowElectricity] = useState(true);
  const [showWastewater, setShowWastewater] = useState(true);
  const [showNaturalGas, setShowNaturalGas] = useState(true);

  const width = 1000;
  const height = 600;
  const nodeWidth = 30;
  const leftX = 120;
  const rightX = 800;

  // Process stages (left side)
  const stages = data.map((stage, i) => ({
    name: stage.name,
    co2: stage.co2,
    electricity: stage.electricity,
    wastewater: stage.electricity * 0.4, // Mock calculation
    naturalGas: stage.co2 * 0.012, // Mock calculation
    color: '#5dbbaa'
  }));

  // Calculate totals
  const totalCO2 = stages.reduce((sum, s) => sum + s.co2, 0);
  const totalElectricity = stages.reduce((sum, s) => sum + s.electricity, 0);
  const totalWastewater = stages.reduce((sum, s) => sum + s.wastewater, 0);
  const totalNaturalGas = stages.reduce((sum, s) => sum + s.naturalGas, 0);

  // Output nodes (right side)
  const outputs = [
    { name: 'Total CO₂', value: totalCO2, color: '#ef4444', enabled: showCO2 },
    { name: 'Total Electricity', value: totalElectricity, color: '#fb923c', enabled: showElectricity },
    { name: 'Total Wastewater', value: totalWastewater, color: '#60a5fa', enabled: showWastewater },
    { name: 'Total Natural Gas', value: totalNaturalGas, color: '#a78bfa', enabled: showNaturalGas }
  ].filter(o => o.enabled);

  // Calculate node heights and positions
  const totalStageValue = stages.reduce((sum, s) => sum + s.co2 + s.electricity * 0.1 + s.wastewater * 0.1 + s.naturalGas * 10, 0);
  const totalOutputValue = outputs.reduce((sum, o) => sum + o.value, 0);
  
  const stageHeightScale = (height - 100) / totalStageValue;
  const outputHeightScale = (height - 100) / Math.max(totalCO2, totalElectricity, totalWastewater * 10, totalNaturalGas * 100);

  let currentStageY = 50;
  const stageNodes = stages.map((stage, i) => {
    const heightValue = stage.co2 + stage.electricity * 0.1 + stage.wastewater * 0.1 + stage.naturalGas * 10;
    const h = Math.max(heightValue * stageHeightScale, 40);
    const node = {
      ...stage,
      y: currentStageY,
      height: h
    };
    currentStageY += h + 10;
    return node;
  });

  let currentOutputY = 50;
  const outputNodes = outputs.map((output, i) => {
    const h = Math.max(output.value * outputHeightScale, 40);
    const node = {
      ...output,
      y: currentOutputY,
      height: h
    };
    currentOutputY += h + 15;
    return node;
  });

  // Create Sankey flow path
  const createSankeyPath = (
    x1: number, y1: number, height1: number,
    x2: number, y2: number, height2: number
  ) => {
    const midX = (x1 + x2) / 2;
    return `
      M ${x1} ${y1}
      L ${x1} ${y1 + height1}
      C ${midX} ${y1 + height1}, ${midX} ${y2 + height2}, ${x2} ${y2 + height2}
      L ${x2} ${y2}
      C ${midX} ${y2}, ${midX} ${y1}, ${x1} ${y1}
      Z
    `;
  };

  // Calculate flows from stages to outputs
  const flows: any[] = [];
  
  stageNodes.forEach((stage, stageIndex) => {
    let stageYOffset = 0;
    
    if (showCO2) {
      const co2Output = outputNodes.find(o => o.name === 'Total CO₂');
      if (co2Output) {
        const flowHeight = (stage.co2 / totalCO2) * co2Output.height;
        flows.push({
          path: createSankeyPath(
            leftX + nodeWidth, stage.y + stageYOffset, flowHeight,
            rightX, co2Output.y + (stage.co2 / totalCO2) * co2Output.height * stageIndex / stageNodes.length, flowHeight
          ),
          color: co2Output.color
        });
        stageYOffset += flowHeight;
      }
    }

    if (showElectricity) {
      const elecOutput = outputNodes.find(o => o.name === 'Total Electricity');
      if (elecOutput) {
        const flowHeight = (stage.electricity / totalElectricity) * elecOutput.height;
        flows.push({
          path: createSankeyPath(
            leftX + nodeWidth, stage.y + stageYOffset, flowHeight,
            rightX, elecOutput.y + (stage.electricity / totalElectricity) * elecOutput.height * stageIndex / stageNodes.length, flowHeight
          ),
          color: elecOutput.color
        });
        stageYOffset += flowHeight;
      }
    }

    if (showWastewater) {
      const waterOutput = outputNodes.find(o => o.name === 'Total Wastewater');
      if (waterOutput) {
        const flowHeight = (stage.wastewater / totalWastewater) * waterOutput.height;
        flows.push({
          path: createSankeyPath(
            leftX + nodeWidth, stage.y + stageYOffset, flowHeight,
            rightX, waterOutput.y + (stage.wastewater / totalWastewater) * waterOutput.height * stageIndex / stageNodes.length, flowHeight
          ),
          color: waterOutput.color
        });
        stageYOffset += flowHeight;
      }
    }

    if (showNaturalGas) {
      const gasOutput = outputNodes.find(o => o.name === 'Total Natural Gas');
      if (gasOutput) {
        const flowHeight = (stage.naturalGas / totalNaturalGas) * gasOutput.height;
        flows.push({
          path: createSankeyPath(
            leftX + nodeWidth, stage.y + stageYOffset, flowHeight,
            rightX, gasOutput.y + (stage.naturalGas / totalNaturalGas) * gasOutput.height * stageIndex / stageNodes.length, flowHeight
          ),
          color: gasOutput.color
        });
      }
    }
  });

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg mb-4">Sankey Flow Diagram Options</h4>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showCO2}
              onChange={(e) => setShowCO2(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500"
            />
            <span className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span>CO₂ Emissions</span>
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showElectricity}
              onChange={(e) => setShowElectricity(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <span className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-orange-400"></div>
              <span>Electricity</span>
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showWastewater}
              onChange={(e) => setShowWastewater(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-400"></div>
              <span>Wastewater</span>
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showNaturalGas}
              onChange={(e) => setShowNaturalGas(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
            />
            <span className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-purple-400"></div>
              <span>Natural Gas</span>
            </span>
          </label>
        </div>
      </div>

      {/* Sankey Diagram */}
      <div className="overflow-x-auto bg-white p-6 rounded-lg border border-gray-200">
        <svg width={width} height={height} className="mx-auto">
          {/* Draw flows */}
          {flows.map((flow, i) => (
            <motion.path
              key={`flow-${i}`}
              d={flow.path}
              fill={flow.color}
              opacity="0.4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            />
          ))}

          {/* Draw stage nodes (left) */}
          {stageNodes.map((stage, i) => (
            <g key={`stage-${i}`}>
              <rect
                x={leftX}
                y={stage.y}
                width={nodeWidth}
                height={stage.height}
                fill={stage.color}
                rx="4"
              />
              <text
                x={leftX - 10}
                y={stage.y + stage.height / 2}
                textAnchor="end"
                className="text-sm fill-gray-700"
                dominantBaseline="middle"
              >
                {stage.name}
              </text>
            </g>
          ))}

          {/* Draw output nodes (right) */}
          {outputNodes.map((output, i) => (
            <g key={`output-${i}`}>
              <rect
                x={rightX}
                y={output.y}
                width={nodeWidth}
                height={output.height}
                fill={output.color}
                rx="4"
              />
              <text
                x={rightX + nodeWidth + 10}
                y={output.y + output.height / 2}
                textAnchor="start"
                className="text-sm fill-gray-700"
                dominantBaseline="middle"
              >
                {output.name}
              </text>
            </g>
          ))}
        </svg>
        <p className="text-center text-sm text-gray-600 mt-4">
          Interactive Sankey diagram showing flow of resources and emissions through production stages
        </p>
      </div>
    </div>
  );
};

export default function OutputPage() {
  const { currentAssessment, addReport, reports } = useAppContext();
  const [activeTab, setActiveTab] = useState('lca');
  const [reportAdded, setReportAdded] = useState(false);

  if (!currentAssessment) {
    return <div>No assessment data available</div>;
  }

  // Add the report to history only if it's a new assessment (not already in reports)
  useEffect(() => {
    if (currentAssessment && !reportAdded) {
      const existingReport = reports.find(r => r.id === currentAssessment.id);
      if (!existingReport) {
        addReport(currentAssessment);
      }
      setReportAdded(true);
    }
  }, [currentAssessment, addReport, reportAdded, reports]);

  const units = currentAssessment.units || 1;

  // Fixed data from images (per unit) - these values stay constant regardless of user input
  const lcaDataPerUnit = {
    totalCO2: 89.7, // Sum of all stages: 16.0+28.0+7.5+6.2+8.0+24.0
    totalElectricity: 235, // Sum of all stages: 40+75+22+18+20+60
    totalWater: 88, // Sum from image 3: 18+25+10+8+12+15
    totalCost: 653, // Sum from image 3: (95+180+40+35+50+110) + (28+55+12+10+15+35) = 510 + 155 = 665
    stages: [
      { name: 'Casting', co2: 16.0, electricity: 40.0, cost: 123, naturalGas: 0.15, wastewater: 18.0, mfgCost: 95.0, transportCost: 28.0 },
      { name: 'Extrusion', co2: 28.0, electricity: 75.0, cost: 235, naturalGas: 0.25, wastewater: 25.0, mfgCost: 180.0, transportCost: 55.0 },
      { name: 'Quenching', co2: 7.5, electricity: 22.0, cost: 52, naturalGas: 0.06, wastewater: 10.0, mfgCost: 40.0, transportCost: 12.0 },
      { name: 'Hot Rolling', co2: 6.2, electricity: 18.0, cost: 45, naturalGas: 0.05, wastewater: 8.0, mfgCost: 35.0, transportCost: 10.0 },
      { name: 'Finishing', co2: 8.0, electricity: 20.0, cost: 65, naturalGas: 0.07, wastewater: 12.0, mfgCost: 50.0, transportCost: 15.0 },
      { name: 'Heat/Aging', co2: 24.0, electricity: 60.0, cost: 145, naturalGas: 0.20, wastewater: 15.0, mfgCost: 110.0, transportCost: 35.0 }
    ]
  };

  // Fixed values for 900 units - these stay constant regardless of user input
  const lcaData = {
    totalCO2: 80730, // Fixed from image 1
    totalElectricity: 211500, // Fixed from image 1  
    totalWater: 79200, // Fixed from image 1
    totalCost: 588000, // Fixed from image 1 (₹588,000)
    stages: [
      { name: 'Casting', co2: 14400, electricity: 36000, cost: 110700, naturalGas: 135, wastewater: 16200, mfgCost: 85500, transportCost: 25200 },
      { name: 'Extrusion', co2: 25200, electricity: 67500, cost: 211500, naturalGas: 225, wastewater: 22500, mfgCost: 162000, transportCost: 49500 },
      { name: 'Quenching', co2: 6750, electricity: 19800, cost: 46800, naturalGas: 54, wastewater: 9000, mfgCost: 36000, transportCost: 10800 },
      { name: 'Hot Rolling', co2: 5580, electricity: 16200, cost: 40500, naturalGas: 45, wastewater: 7200, mfgCost: 31500, transportCost: 9000 },
      { name: 'Finishing', co2: 7200, electricity: 18000, cost: 58500, naturalGas: 63, wastewater: 10800, mfgCost: 45000, transportCost: 13500 },
      { name: 'Heat/Aging', co2: 21600, electricity: 54000, cost: 130500, naturalGas: 180, wastewater: 13500, mfgCost: 99000, transportCost: 31500 }
    ]
  };

  const comparisonData = {
    conventional: { 
      co2: 89.7, 
      manufacturingCost: 510.00,
      transportCost: 143.33,
      totalCost: 653.33, 
      quality: 8.5,
      electricity: 235.0,
      wastewater: 88.0,
      recyclability: 90
    },
    recycled: { 
      co2: 26.9, 
      manufacturingCost: 433.50,
      transportCost: 136.17,
      totalCost: 569.67, 
      quality: 8.0,
      electricity: 47.0,
      wastewater: 26.4,
      recyclability: 85
    }
  };

  const pieData = [
    { name: 'Casting', value: 1350, color: '#10b981' },
    { name: 'Extrusion', value: 2200, color: '#3b82f6' },
    { name: 'Quench', value: 450, color: '#f59e0b' },
    { name: 'Hot', value: 380, color: '#ef4444' },
    { name: 'Finish', value: 520, color: '#8b5cf6' },
    { name: 'Aging/Heat', value: 1821, color: '#06b6d4' }
  ];

  const sankeyData = lcaData.stages.map(stage => ({
    ...stage,
    efficiency: (stage.co2 / lcaData.totalCO2 * 100).toFixed(1)
  }));

  const handleDownloadReport = () => {
    alert('Report downloaded as PDF!');
  };

  const renderLCATab = () => (
    <div className="space-y-8">
      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Zap, label: 'Total Electricity', value: '211,500', unit: 'kWh', color: 'from-yellow-500 to-yellow-600' },
          { icon: Leaf, label: 'Total CO₂ Emission', value: '80,730', unit: 'kg', color: 'from-red-500 to-red-600' },
          { icon: Droplets, label: 'Total Wastewater Produced', value: '79,200', unit: 'L', color: 'from-blue-500 to-blue-600' },
          { icon: IndianRupee, label: 'Total Cost', value: '₹588,000', unit: '', color: 'from-green-500 to-green-600' }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{metric.label}</p>
                      <p className="text-2xl">{metric.value}</p>
                      <p className="text-xs text-gray-500">{metric.unit}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* LCA Stage Breakdown Table */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>LCA Stage Breakdown ({units} unit{units > 1 ? 's' : ''})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 bg-gray-50">Stage</th>
                  <th className="text-right py-3 px-4 bg-gray-50">CO₂ per Unit (kg)</th>
                  <th className="text-right py-3 px-4 bg-gray-50">Total CO₂ (kg)</th>
                  <th className="text-right py-3 px-4 bg-gray-50">Electricity per Unit (kWh)</th>
                  <th className="text-right py-3 px-4 bg-gray-50">Total Electricity (kWh)</th>
                  <th className="text-right py-3 px-4 bg-gray-50">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Casting', co2PerUnit: 16.0, totalCO2: 14400, electricityPerUnit: 40.0, totalElectricity: 36000, percentage: '17.5%' },
                  { name: 'Extrusion', co2PerUnit: 28.0, totalCO2: 25200, electricityPerUnit: 75.0, totalElectricity: 67500, percentage: '32.9%' },
                  { name: 'Quenching', co2PerUnit: 7.5, totalCO2: 6750, electricityPerUnit: 22.0, totalElectricity: 19800, percentage: '9.6%' },
                  { name: 'Hot Rolling', co2PerUnit: 6.2, totalCO2: 5580, electricityPerUnit: 18.0, totalElectricity: 16200, percentage: '7.9%' },
                  { name: 'Finishing', co2PerUnit: 8.0, totalCO2: 7200, electricityPerUnit: 20.0, totalElectricity: 18000, percentage: '8.8%' },
                  { name: 'Heat/Aging', co2PerUnit: 24.0, totalCO2: 21600, electricityPerUnit: 60.0, totalElectricity: 54000, percentage: '23.3%' }
                ].map((stage, index) => (
                  <tr key={stage.name} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">{stage.name}</td>
                    <td className="text-right py-3 px-4">{stage.co2PerUnit}</td>
                    <td className="text-right py-3 px-4">{stage.totalCO2.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">{stage.electricityPerUnit}</td>
                    <td className="text-right py-3 px-4">{stage.totalElectricity.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">
                      <Badge variant="outline">{stage.percentage}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 bg-blue-50">
                  <td className="py-4 px-4">
                    <strong>Total</strong>
                  </td>
                  <td className="text-right py-4 px-4">
                    <strong>89.7</strong>
                  </td>
                  <td className="text-right py-4 px-4">
                    <strong>80,730</strong>
                  </td>
                  <td className="text-right py-4 px-4">
                    <strong>235</strong>
                  </td>
                  <td className="text-right py-4 px-4">
                    <strong>211,500</strong>
                  </td>
                  <td className="text-right py-4 px-4">
                    <Badge className="bg-blue-600">100%</Badge>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown Chart */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Lifecycle Stage Breakdown - Visual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lcaData.stages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="co2" fill="#ef4444" name="CO₂ (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDecarbonizationTab = () => {
    const decarbonizationData = [
      {
        stage: 'Energy Source',
        potential: 40,
        currentCO2: 32.3,
        reducedCO2: 19.4,
        suggestion: 'Switch to renewable energy sources (solar/wind)',
        impact: 'High',
        icon: Zap,
        color: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-yellow-50'
      },
      {
        stage: 'Material Route',
        potential: 35,
        currentCO2: 89.7,
        reducedCO2: 26.9,
        suggestion: 'Use recycled aluminum instead of primary production',
        impact: 'High',
        icon: Recycle,
        color: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-50'
      },
      {
        stage: 'Process Optimization',
        potential: 15,
        currentCO2: 28.0,
        reducedCO2: 23.8,
        suggestion: 'Optimize extrusion process for energy efficiency',
        impact: 'Medium',
        icon: TrendingDown,
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-50'
      },
      {
        stage: 'Transportation',
        potential: 10,
        currentCO2: 5.2,
        reducedCO2: 4.7,
        suggestion: 'Implement local sourcing and shorter supply chains',
        impact: 'Low',
        icon: TrendingUp,
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-50'
      }
    ];

    return (
      <div className="space-y-8">
        {/* Visual Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {decarbonizationData.map((item, index) => {
            const Icon = item.icon;
            const savingsCO2 = (item.currentCO2 - item.reducedCO2).toFixed(1);
            
            return (
              <motion.div
                key={item.stage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`${item.bgColor} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-4 bg-gradient-to-r ${item.color} rounded-2xl shadow-lg`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold">{item.stage}</h4>
                          <Badge 
                            variant={item.impact === 'High' ? 'destructive' : item.impact === 'Medium' ? 'default' : 'secondary'}
                            className="mt-1"
                          >
                            {item.impact} Impact
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600">{item.potential}%</div>
                        <p className="text-xs text-gray-500">Reduction</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Current CO₂: {item.currentCO2} kg</span>
                        <span className="text-green-600 font-semibold">Target: {item.reducedCO2} kg</span>
                      </div>
                      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${100 - item.potential}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                          Save {savingsCO2} kg CO₂
                        </div>
                      </div>
                    </div>

                    {/* Suggestion */}
                    <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">💡 Action:</span> {item.suggestion}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Summary Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Decarbonization Impact Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={decarbonizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis label={{ value: 'CO₂ Emissions (kg)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="currentCO2" fill="#ef4444" name="Current CO₂" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="reducedCO2" fill="#10b981" name="After Optimization" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Insights */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span>Key Insights & Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Leaf className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">Highest Impact</h5>
                    <p className="text-sm text-gray-600">
                      Switching to renewable energy and recycled materials can reduce emissions by 75% combined.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">Quick Wins</h5>
                    <p className="text-sm text-gray-600">
                      Process optimization and transportation improvements offer immediate 25% reduction potential.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingDown className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">Cost Savings</h5>
                    <p className="text-sm text-gray-600">
                      Implementing these measures can reduce operational costs by 15-20% annually.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Recycle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">Circular Economy</h5>
                    <p className="text-sm text-gray-600">
                      Recycled aluminum route aligns with circular economy principles and sustainability goals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBreakdownTab = () => (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl mb-2">Per-Stage Breakdown</h3>
        <p className="text-gray-600">Comprehensive analysis of environmental and cost factors for {units} unit(s)</p>
      </div>

      {/* Breakdown Table */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Detailed Stage Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-50">
                  <th className="text-left py-3 px-4">Stage</th>
                  <th className="text-center py-3 px-4">Scope</th>
                  <th className="text-center py-3 px-4">Units</th>
                  <th className="text-center py-3 px-4">Quality</th>
                  <th className="text-right py-3 px-4">Electricity<br/>(kWh)</th>
                  <th className="text-right py-3 px-4">CO₂<br/>(kg)</th>
                  <th className="text-right py-3 px-4">Natural Gas<br/>(Nm³)</th>
                  <th className="text-right py-3 px-4">Wastewater<br/>(L)</th>
                  <th className="text-right py-3 px-4">Manufacturing Cost<br/>(INR)</th>
                  <th className="text-right py-3 px-4">Transport Cost<br/>(INR)</th>
                </tr>
              </thead>
              <tbody>
                {/* Per Unit Rows */}
                {lcaDataPerUnit.stages.map((stage, index) => {
                  const naturalGas = (stage.co2 * 0.012).toFixed(3);
                  const wastewater = (stage.electricity * 0.4).toFixed(1);
                  const mfgCost = (stage.cost * 0.25).toFixed(2);
                  const transportCost = (stage.cost * 0.08).toFixed(2);
                  
                  return (
                    <tr key={`${stage.name}-per-unit`} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                      <td className="py-3 px-4">{stage.name}</td>
                      <td className="text-center py-3 px-4 text-gray-600">per_unit</td>
                      <td className="text-center py-3 px-4">1</td>
                      <td className="text-center py-3 px-4">0.85</td>
                      <td className="text-right py-3 px-4">{stage.electricity.toFixed(2)}</td>
                      <td className="text-right py-3 px-4">{stage.co2.toFixed(2)}</td>
                      <td className="text-right py-3 px-4">{naturalGas}</td>
                      <td className="text-right py-3 px-4">{wastewater}</td>
                      <td className="text-right py-3 px-4">{mfgCost}</td>
                      <td className="text-right py-3 px-4">{transportCost}</td>
                    </tr>
                  );
                })}

                {/* Separator */}
                <tr className="bg-gray-100">
                  <td colSpan={10} className="py-2"></td>
                </tr>

                {/* Total Rows */}
                {lcaData.stages.map((stage, index) => {
                  const perUnitStage = lcaDataPerUnit.stages[index];
                  const naturalGas = (stage.co2 * 0.012).toFixed(3);
                  const wastewater = (stage.electricity * 0.4).toFixed(1);
                  const mfgCost = (stage.cost * 0.25).toFixed(2);
                  const transportCost = (stage.cost * 0.08).toFixed(2);
                  
                  return (
                    <tr key={`${stage.name}-total`} className="border-b border-gray-200 hover:bg-green-50 transition-colors">
                      <td className="py-3 px-4">{stage.name}</td>
                      <td className="text-center py-3 px-4 text-gray-600">total</td>
                      <td className="text-center py-3 px-4">{units}</td>
                      <td className="text-center py-3 px-4">0.85</td>
                      <td className="text-right py-3 px-4">{stage.electricity.toFixed(2)}</td>
                      <td className="text-right py-3 px-4">{stage.co2.toFixed(2)}</td>
                      <td className="text-right py-3 px-4">{naturalGas}</td>
                      <td className="text-right py-3 px-4">{wastewater}</td>
                      <td className="text-right py-3 px-4">{mfgCost}</td>
                      <td className="text-right py-3 px-4">{transportCost}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Export Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => {
            // Prepare CSV data
            const csvRows = [];
            
            // Header row
            csvRows.push([
              'Stage',
              'Scope',
              'Units',
              'Quality',
              'Electricity (kWh)',
              'CO₂ (kg)',
              'Natural Gas (Nm³)',
              'Wastewater (L)',
              'Manufacturing Cost (INR)',
              'Transport Cost (INR)'
            ].join(','));
            
            // Per Unit rows
            lcaDataPerUnit.stages.forEach(stage => {
              const naturalGas = (stage.co2 * 0.012).toFixed(3);
              const wastewater = (stage.electricity * 0.4).toFixed(1);
              const mfgCost = (stage.cost * 0.25).toFixed(2);
              const transportCost = (stage.cost * 0.08).toFixed(2);
              
              csvRows.push([
                stage.name,
                'per_unit',
                '1',
                '0.85',
                stage.electricity.toFixed(2),
                stage.co2.toFixed(2),
                naturalGas,
                wastewater,
                mfgCost,
                transportCost
              ].join(','));
            });
            
            // Empty row separator
            csvRows.push('');
            
            // Total rows
            lcaData.stages.forEach(stage => {
              const naturalGas = (stage.co2 * 0.012).toFixed(3);
              const wastewater = (stage.electricity * 0.4).toFixed(1);
              const mfgCost = (stage.cost * 0.25).toFixed(2);
              const transportCost = (stage.cost * 0.08).toFixed(2);
              
              csvRows.push([
                stage.name,
                'total',
                units,
                '0.85',
                stage.electricity.toFixed(2),
                stage.co2.toFixed(2),
                naturalGas,
                wastewater,
                mfgCost,
                transportCost
              ].join(','));
            });
            
            // Create blob and download
            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `lca_breakdown_${currentAssessment?.product || 'report'}_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 px-8 py-3"
        >
          <Download className="h-5 w-5 mr-2" />
          Export Breakdown as CSV
        </Button>
      </div>

    </div>
  );

  const renderComparisonsTab = () => (
    <div className="space-y-8">
      <h3 className="text-xl mb-6">Route Comparison: Conventional vs Recycled</h3>
      
      {/* Comparison Table */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4">Parameters</th>
                  <th className="text-center py-3 px-4">Conventional</th>
                  <th className="text-center py-3 px-4">Recycled</th>
                  <th className="text-center py-3 px-4">Difference</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">CO₂ emissions</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <span>{comparisonData.conventional.co2} kg</span>
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </div>
                  </td>
                  <td className="text-center py-3 px-4">{comparisonData.recycled.co2} kg</td>
                  <td className="text-center py-3 px-4 text-green-600 font-medium">−70%</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Electricity</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <span>{comparisonData.conventional.electricity} kWh</span>
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </div>
                  </td>
                  <td className="text-center py-3 px-4">{comparisonData.recycled.electricity} kWh</td>
                  <td className="text-center py-3 px-4 text-green-600 font-medium">−80%</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Wastewater</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <span>{comparisonData.conventional.wastewater} L</span>
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </div>
                  </td>
                  <td className="text-center py-3 px-4">{comparisonData.recycled.wastewater} L</td>
                  <td className="text-center py-3 px-4 text-green-600 font-medium">−70%</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Manufacturing cost</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <span>₹{comparisonData.conventional.manufacturingCost.toFixed(2)}</span>
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </div>
                  </td>
                  <td className="text-center py-3 px-4">₹{comparisonData.recycled.manufacturingCost.toFixed(2)}</td>
                  <td className="text-center py-3 px-4 text-green-600 font-medium">−15%</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Transport cost</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <span>₹{comparisonData.conventional.transportCost.toFixed(2)}</span>
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </div>
                  </td>
                  <td className="text-center py-3 px-4">₹{comparisonData.recycled.transportCost.toFixed(2)}</td>
                  <td className="text-center py-3 px-4 text-green-600 font-medium">−5%</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Total cost</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <span>₹{comparisonData.conventional.totalCost.toFixed(2)}</span>
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </div>
                  </td>
                  <td className="text-center py-3 px-4">₹{comparisonData.recycled.totalCost.toFixed(2)}</td>
                  <td className="text-center py-3 px-4 text-green-600 font-medium">−13%</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Quality score</td>
                  <td className="text-center py-3 px-4">{comparisonData.conventional.quality}/10</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <span>{comparisonData.recycled.quality}/10</span>
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </div>
                  </td>
                  <td className="text-center py-3 px-4 text-orange-600 font-medium">−6%</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Recyclability (EoL recovery)</td>
                  <td className="text-center py-3 px-4">{comparisonData.conventional.recyclability}%</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <span>{comparisonData.recycled.recyclability}%</span>
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </div>
                  </td>
                  <td className="text-center py-3 px-4 text-orange-600 font-medium">−5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-800">CO₂ Emissions</h4>
              <p className="text-green-800">→ Prioritize recycled aluminum feedstock: reduces carbon footprint by ~70%.</p>
              <p className="text-green-800">→ Promote renewable power + scrap-based production for maximum savings.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-green-800">⚡ Electricity Use</h4>
              <p className="text-green-800">→ Recycled route is ~80% more energy-efficient. Encourage secondary smelters and efficient extrusion plants.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-green-800">💧 Wastewater</h4>
              <p className="text-green-800">→ Water treatment and recycling systems should be implemented in conventional routes. Recycled route already uses ~70% less.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-green-800">⚙️ Manufacturing Cost</h4>
              <p className="text-green-800">→ Switching to recycled aluminum saves ~15%. Policy incentives can push industries toward secondary processing.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-green-800">🚚 Transport Cost</h4>
              <p className="text-green-800">→ Difference is minor (~5%). Optimize logistics by preferring rail/ship transport to reduce both cost and emissions further.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-green-800">💰 Total Cost</h4>
              <p className="text-green-800">→ Recycled route cuts ~13% overall costs → more competitive in markets. Promote cost-benefit awareness among manufacturers.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-green-800">✅ Quality Score</h4>
              <p className="text-green-800">→ Conventional route slightly higher (8.5 vs 8.0). To close the gap: improve scrap sorting, alloy control, and refining.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-green-800">♻️ Recyclability</h4>
              <p className="text-green-800">→ Recycled route achieves 95% vs 90%. Enhance waste collection & segregation infrastructure to reach near 100%.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderVisualizationTab = () => (
    <div className="space-y-8">
      {/* Sankey Diagram */}
      <div>
        <SankeyDiagram data={lcaData.stages} units={units} />
      </div>

      {/* Bar Chart Comparison */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Stage-wise Emissions Comparison</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Comparing CO₂, Electricity, and Cost across all stages
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lcaData.stages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#ef4444" />
                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="co2" fill="#ef4444" name="CO₂ (kg)" />
                <Bar yAxisId="right" dataKey="electricity" fill="#3b82f6" name="Electricity (kWh)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>CO₂ Distribution by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Process Flow Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lcaData.stages}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="co2" stroke="#ef4444" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sankey-style bars visualization */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Emission Flow Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sankeyData.map((stage, index) => (
              <div key={stage.name} className="flex items-center space-x-4">
                <div className="w-24 text-sm text-gray-600">{stage.name}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.efficiency}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-black text-sm font-medium">
                    {stage.co2.toFixed(1)} kg ({stage.efficiency}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl mb-4">Complete Assessment Report</h3>
        <p className="text-gray-600 mb-8">Comprehensive analysis of your product's environmental impact</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
          <p className="text-sm text-blue-800">
            <strong>Product:</strong> {currentAssessment.product.replace('-', ' ')} | 
            <strong> Units:</strong> {units} | 
            <strong> Route:</strong> {currentAssessment.route} | 
            <strong> Energy Source:</strong> {currentAssessment.energySource}
          </p>
        </div>
      </div>

      {/* All sections combined */}
      <div className="space-y-12">
        <section>
          <h4 className="text-xl mb-4 flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <span>Life Cycle Assessment</span>
          </h4>
          {renderLCATab()}
        </section>

        <section>
          <h4 className="text-xl mb-4 flex items-center space-x-2">
            <BarChart className="h-5 w-5 text-indigo-600" />
            <span>Detailed Breakdown</span>
          </h4>
          {renderBreakdownTab()}
        </section>

        <section>
          <h4 className="text-xl mb-4 flex items-center space-x-2">
            <TrendingDown className="h-5 w-5 text-blue-600" />
            <span>Visualizations</span>
          </h4>
          {renderVisualizationTab()}
        </section>

        <section>
          <h4 className="text-xl mb-4 flex items-center space-x-2">
            <TrendingDown className="h-5 w-5 text-purple-600" />
            <span>Decarbonization Potential</span>
          </h4>
          {renderDecarbonizationTab()}
        </section>

        <section>
          <h4 className="text-xl mb-4 flex items-center space-x-2">
            <BarChart className="h-5 w-5 text-orange-600" />
            <span>Route Comparisons</span>
          </h4>
          {renderComparisonsTab()}
        </section>

        <div className="text-center pt-8 space-y-6">
          <Button
            onClick={handleDownloadReport}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Complete Report (PDF)
          </Button>
          
          {/* Carbon Footprint Only Download Section */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg mb-4 text-gray-700">Carbon Footprint Only</h4>
            <p className="text-sm text-gray-600 mb-4">
              Download only the carbon footprint analysis section of this assessment
            </p>
            <Button
              onClick={() => alert(`Downloading carbon footprint data for ${currentAssessment.product}...`)}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-2"
            >
              <Leaf className="mr-2 h-4 w-4" />
              Download Carbon Footprint (PDF)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl mb-4">Assessment Results</h1>
        <p className="text-gray-600">
          Analysis for {currentAssessment.product.replace('-', ' ')} - {currentAssessment.route} route
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-8">
          <TabsTrigger value="lca">LCA</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="decarbonization">Decarbonization</TabsTrigger>
          <TabsTrigger value="comparisons">Comparisons</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="lca">{renderLCATab()}</TabsContent>
        <TabsContent value="breakdown">{renderBreakdownTab()}</TabsContent>
        <TabsContent value="decarbonization">{renderDecarbonizationTab()}</TabsContent>
        <TabsContent value="comparisons">{renderComparisonsTab()}</TabsContent>
        <TabsContent value="visualization">{renderVisualizationTab()}</TabsContent>
        <TabsContent value="reports">{renderReportsTab()}</TabsContent>
      </Tabs>
    </div>
  );
}