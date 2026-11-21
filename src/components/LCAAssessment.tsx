import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAppContext } from '../App';
import { ArrowRight, Package, Settings, Zap, Recycle, Plus, Truck } from 'lucide-react';

interface FormData {
  product: string;
  units: number;
  route: string;
  bauxiteGrade: string;
  energySource: string;
  endOfLife: string;
  dimensions: Record<string, number>;
  transportationSegments: Array<{
    mode: string;
    distance: number;
  }>;
}

export default function LCAAssessment() {
  const { setCurrentPage, setCurrentAssessment } = useAppContext();
  
  const [formData, setFormData] = useState<FormData>({
    product: '',
    units: 0,
    route: '',
    bauxiteGrade: '',
    energySource: '',
    endOfLife: '',
    dimensions: {},
    transportationSegments: [{ mode: '', distance: 0 }]
  });

  const productOptions = [
    { value: 'aluminium-pipe', label: 'Aluminium Pipe' },
    { value: 'aluminium-sheet', label: 'Aluminium Sheet' }
  ];

  const getDimensionFields = () => {
    if (formData.product === 'aluminium-pipe') {
      return [
        { key: 'outerRadius', label: 'Outer Radius (m)', placeholder: '0.1' },
        { key: 'innerRadius', label: 'Inner Radius (m)', placeholder: '0.08' },
        { key: 'length', label: 'Length (m)', placeholder: '2.0' }
      ];
    } else if (formData.product === 'aluminium-sheet') {
      return [
        { key: 'length', label: 'Length (m)', placeholder: '1.0' },
        { key: 'width', label: 'Width (m)', placeholder: '0.5' },
        { key: 'thickness', label: 'Thickness (m)', placeholder: '0.005' }
      ];
    }
    return [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate assessment data
    const assessmentData = {
      ...formData,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    };
    
    setCurrentAssessment(assessmentData);
    setCurrentPage('output');
  };

  const isFormValid = () => {
    const requiredFields = ['product', 'route', 'bauxiteGrade', 'energySource', 'endOfLife'];
    const hasAllFields = requiredFields.every(field => formData[field as keyof FormData]);
    
    const dimensionFields = getDimensionFields();
    const hasAllDimensions = dimensionFields.every(field => 
      formData.dimensions[field.key] && formData.dimensions[field.key] > 0
    );

    const hasValidTransportation = formData.transportationSegments.every(segment =>
      segment.mode && segment.distance > 0
    );
    
    return hasAllFields && hasAllDimensions && formData.units > 0 && hasValidTransportation;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl mb-4 text-center">
          {formData.product ? 
            `${productOptions.find(p => p.value === formData.product)?.label || 'Product'} Assessment` : 
            'LCA Assessment Configuration'
          }
        </h1>
        {formData.product && Object.keys(formData.dimensions).length > 0 && (
          <div className="text-center mb-4">
            <p className="text-lg text-gray-700">
              Dimensions: {Object.entries(formData.dimensions)
                .filter(([_, value]) => value > 0)
                .map(([key, value]) => `${key}: ${value}m`)
                .join(', ')
              }
            </p>
          </div>
        )}
        <p className="text-gray-600 text-center">
          Configure your product specifications and manufacturing parameters
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Product Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-blue-600" />
                <span>Product Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="product">Product Type</Label>
                <Select
                  value={formData.product}
                  onValueChange={(value) => setFormData({ ...formData, product: value, dimensions: {} })}
                >
                  <SelectTrigger className="transition-all duration-200 focus:scale-105">
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    {productOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="units">Units</Label>
                <Input
                  id="units"
                  type="number"
                  min="1"
                  max="1000000"
                  value={formData.units || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setFormData({ ...formData, units: 0 });
                    } else {
                      const numValue = parseInt(value);
                      if (!isNaN(numValue) && numValue >= 1 && numValue <= 1000000) {
                        setFormData({ ...formData, units: numValue });
                      }
                    }
                  }}
                  placeholder="Enter quantity"
                  className="transition-all duration-200 focus:scale-105"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="route">Manufacturing Route</Label>
                <Select
                  value={formData.route}
                  onValueChange={(value) => setFormData({ ...formData, route: value })}
                >
                  <SelectTrigger className="transition-all duration-200 focus:scale-105">
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conventional">Conventional</SelectItem>
                    <SelectItem value="recycled">Recycled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Manufacturing Parameters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-green-600" />
                <span>Manufacturing Parameters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bauxiteGrade">Bauxite Grade</Label>
                <Select
                  value={formData.bauxiteGrade}
                  onValueChange={(value) => setFormData({ ...formData, bauxiteGrade: value })}
                >
                  <SelectTrigger className="transition-all duration-200 focus:scale-105">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Grade</SelectItem>
                    <SelectItem value="medium">Medium Grade</SelectItem>
                    <SelectItem value="high">High Grade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="energySource">Energy Source</Label>
                <Select
                  value={formData.energySource}
                  onValueChange={(value) => setFormData({ ...formData, energySource: value })}
                >
                  <SelectTrigger className="transition-all duration-200 focus:scale-105">
                    <SelectValue placeholder="Select energy source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="renewable">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-green-500" />
                        <span>Renewable</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="non-renewable">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-orange-500" />
                        <span>Non-renewable</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endOfLife">End of Life</Label>
                <Select
                  value={formData.endOfLife}
                  onValueChange={(value) => setFormData({ ...formData, endOfLife: value })}
                >
                  <SelectTrigger className="transition-all duration-200 focus:scale-105">
                    <SelectValue placeholder="Select end of life option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recycle">
                      <div className="flex items-center space-x-2">
                        <Recycle className="h-4 w-4 text-green-500" />
                        <span>Recycle</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="reuse">Re-use</SelectItem>
                    <SelectItem value="landfill">Landfill</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Product Dimensions */}
        {formData.product && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-center">
                  {formData.product === 'aluminium-pipe' ? 'Pipe Dimensions' : 'Sheet Dimensions'}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getDimensionFields().map((field, index) => (
                  <motion.div
                    key={field.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <Input
                      id={field.key}
                      type="number"
                      step="0.000001"
                      min="0"
                      value={formData.dimensions[field.key] || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow empty string, positive numbers, and decimal points
                        if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
                          setFormData({
                            ...formData,
                            dimensions: {
                              ...formData.dimensions,
                              [field.key]: value === '' ? 0 : parseFloat(value) || 0
                            }
                          });
                        }
                      }}
                      placeholder={field.placeholder}
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Transportation Mode */}
        {formData.product && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-orange-600" />
                    <span>Transportation Mode</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        transportationSegments: [
                          ...formData.transportationSegments,
                          { mode: '', distance: 0 }
                        ]
                      });
                    }}
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Segment
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.transportationSegments.map((segment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="space-y-2">
                      <Label htmlFor={`transportation-mode-${index}`}>Transportation Mode</Label>
                      <Select
                        value={segment.mode}
                        onValueChange={(value) => {
                          const newSegments = [...formData.transportationSegments];
                          newSegments[index].mode = value;
                          setFormData({ ...formData, transportationSegments: newSegments });
                        }}
                      >
                        <SelectTrigger className="transition-all duration-200 focus:scale-105">
                          <SelectValue placeholder="Select transportation mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="roadways">Roadways</SelectItem>
                          <SelectItem value="railways">Railways</SelectItem>
                          <SelectItem value="waterways">Waterways</SelectItem>
                          <SelectItem value="airways">Airways</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`distance-${index}`}>Distance (km)</Label>
                      <Input
                        id={`distance-${index}`}
                        type="number"
                        min="0.1"
                        max="1000000"
                        step="0.1"
                        value={segment.distance || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
                            const newSegments = [...formData.transportationSegments];
                            newSegments[index].distance = value === '' ? 0 : parseFloat(value) || 0;
                            setFormData({ ...formData, transportationSegments: newSegments });
                          }
                        }}
                        placeholder="Enter distance"
                        className="transition-all duration-200 focus:scale-105"
                      />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center pt-8"
        >
          <Button
            type="submit"
            size="lg"
            disabled={!isFormValid()}
            className="group bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Compute Assessment
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
          </Button>
        </motion.div>
      </form>
    </div>
  );
}