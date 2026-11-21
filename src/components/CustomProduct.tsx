import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { useAppContext } from '../App';
import { Upload, Package, Settings, Zap, ArrowRight, FileText } from 'lucide-react';

interface CustomProductData {
  productName: string;
  alloyGrade: string;
  productionUnits: number;
  length: number;
  width: number;
  thickness: number;
  materialDensity: number;
  metalPercentage: number;
  productionRoute: string;
  energySource: string;
  endOfLifeTreatment: string;
  qualityScore: number;
  transportDistance: number;
  csvFile: File | null;
}

export default function CustomProduct() {
  const { setCurrentPage, setCurrentAssessment } = useAppContext();
  
  const [formData, setFormData] = useState<CustomProductData>({
    productName: '',
    alloyGrade: '',
    productionUnits: 100,
    length: 1000,
    width: 500,
    thickness: 10,
    materialDensity: 2700,
    metalPercentage: 100,
    productionRoute: '',
    energySource: '',
    endOfLifeTreatment: '',
    qualityScore: 85.0,
    transportDistance: 500,
    csvFile: null
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setFormData({ ...formData, csvFile: file });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate custom assessment data
    const assessmentData = {
      product: `custom-${formData.productName}`,
      units: formData.productionUnits,
      route: formData.productionRoute,
      bauxiteGrade: 'custom',
      energySource: formData.energySource,
      endOfLife: formData.endOfLifeTreatment,
      dimensions: {
        length: formData.length / 1000, // Convert mm to m
        width: formData.width / 1000,
        thickness: formData.thickness / 1000,
        density: formData.materialDensity,
        metalPercentage: formData.metalPercentage
      },
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9),
      isCustom: true,
      customData: formData
    };
    
    setCurrentAssessment(assessmentData);
    setCurrentPage('output');
  };

  const isFormValid = () => {
    return formData.productName && 
           formData.alloyGrade && 
           formData.productionRoute && 
           formData.energySource && 
           formData.endOfLifeTreatment;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl mb-4 text-center">Custom Product Analysis</h1>
        <p className="text-gray-600 text-center">
          Configure your custom aluminum product specifications for detailed LCA assessment
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Product Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-blue-600" />
                <span>Basic Product Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="e.g., Custom Aluminum Component"
                  className="transition-all duration-200 focus:scale-105"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alloyGrade">Alloy Grade</Label>
                <Select
                  value={formData.alloyGrade}
                  onValueChange={(value) => setFormData({ ...formData, alloyGrade: value })}
                >
                  <SelectTrigger className="transition-all duration-200 focus:scale-105">
                    <SelectValue placeholder="Select alloy grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000">1000 Series (Pure Aluminum)</SelectItem>
                    <SelectItem value="3000">3000 Series (Manganese)</SelectItem>
                    <SelectItem value="5000">5000 Series (Magnesium)</SelectItem>
                    <SelectItem value="6000">6000 Series (Magnesium & Silicon)</SelectItem>
                    <SelectItem value="7000">7000 Series (Zinc)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productionUnits">Production Units</Label>
                <Input
                  id="productionUnits"
                  type="number"
                  value={formData.productionUnits}
                  onChange={(e) => setFormData({ ...formData, productionUnits: parseInt(e.target.value) || 100 })}
                  placeholder="100"
                  className="transition-all duration-200 focus:scale-105"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Physical Dimensions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Physical Dimensions & Material Composition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="length">Length (mm)</Label>
                  <Input
                    id="length"
                    type="number"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: parseFloat(e.target.value) || 1000 })}
                    placeholder="1000"
                    className="transition-all duration-200 focus:scale-105"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="width">Width (mm)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: parseFloat(e.target.value) || 500 })}
                    placeholder="500"
                    className="transition-all duration-200 focus:scale-105"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thickness">Thickness (mm)</Label>
                  <Input
                    id="thickness"
                    type="number"
                    value={formData.thickness}
                    onChange={(e) => setFormData({ ...formData, thickness: parseFloat(e.target.value) || 10 })}
                    placeholder="10"
                    className="transition-all duration-200 focus:scale-105"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materialDensity">Material Density (kg/m³)</Label>
                  <Input
                    id="materialDensity"
                    type="number"
                    min="2000"
                    max="3000"
                    value={formData.materialDensity}
                    onChange={(e) => setFormData({ ...formData, materialDensity: parseFloat(e.target.value) || 2700 })}
                    placeholder="2700"
                    className="transition-all duration-200 focus:scale-105"
                  />
                </div>
              </div>

              {/* Metal Percentage Section */}
              <div className="border-t pt-6">
                <div className="max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="metalPercentage" className="flex items-center space-x-2">
                      <span>Metal Percentage in Product (%)</span>
                      <span className="text-xs text-gray-500">(Aluminum content)</span>
                    </Label>
                    <Input
                      id="metalPercentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.metalPercentage}
                      onChange={(e) => setFormData({ ...formData, metalPercentage: parseFloat(e.target.value) || 100 })}
                      placeholder="100"
                      className="transition-all duration-200 focus:scale-105"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the percentage of metal (aluminum) in your product. For pure aluminum products, use 100%. 
                      For composite products with other materials, enter the actual aluminum percentage.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Manufacturing Parameters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
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
                <Label htmlFor="productionRoute">Production Route</Label>
                <Select
                  value={formData.productionRoute}
                  onValueChange={(value) => setFormData({ ...formData, productionRoute: value })}
                >
                  <SelectTrigger className="transition-all duration-200 focus:scale-105">
                    <SelectValue placeholder="Select production route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conventional">Conventional (Primary from bauxite ore)</SelectItem>
                    <SelectItem value="recycled">Recycled (Secondary from aluminum scrap)</SelectItem>
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
                        <span>Renewable (Solar, wind, hydro)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="non-renewable">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-orange-500" />
                        <span>Non-renewable (Coal, gas, grid)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endOfLifeTreatment">End-of-Life Treatment</Label>
                <Select
                  value={formData.endOfLifeTreatment}
                  onValueChange={(value) => setFormData({ ...formData, endOfLifeTreatment: value })}
                >
                  <SelectTrigger className="transition-all duration-200 focus:scale-105">
                    <SelectValue placeholder="Select treatment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recycle">Recycle (Material recovery)</SelectItem>
                    <SelectItem value="reuse">Reuse (Direct product reuse)</SelectItem>
                    <SelectItem value="landfill">Landfill (Waste disposal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Parameters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Additional Compatibility Fields</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="qualityScore">Quality Score (0-100)</Label>
                <Input
                  id="qualityScore"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.qualityScore}
                  onChange={(e) => setFormData({ ...formData, qualityScore: parseFloat(e.target.value) || 85.0 })}
                  placeholder="85.0"
                  className="transition-all duration-200 focus:scale-105"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transportDistance">Transport Distance (km)</Label>
                <Input
                  id="transportDistance"
                  type="number"
                  value={formData.transportDistance}
                  onChange={(e) => setFormData({ ...formData, transportDistance: parseFloat(e.target.value) || 500 })}
                  placeholder="500"
                  className="transition-all duration-200 focus:scale-105"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CSV Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-purple-600" />
                <span>Upload CSV Data (Optional)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Upload a CSV file with your product specifications. The file should include columns for dimensions, 
                  material properties, and manufacturing parameters.
                </p>
                
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="csvFile" className="flex flex-col items-center justify-center w-full h-32 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors duration-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-purple-500" />
                      <p className="mb-2 text-sm text-purple-600">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-purple-500">CSV files only</p>
                    </div>
                    <input 
                      id="csvFile" 
                      type="file" 
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden" 
                    />
                  </label>
                </div>

                {formData.csvFile && (
                  <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">{formData.csvFile.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center pt-8"
        >
          <Button
            type="submit"
            size="lg"
            disabled={!isFormValid()}
            className="group bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Compute Custom LCA
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
          </Button>
        </motion.div>
      </form>
    </div>
  );
}