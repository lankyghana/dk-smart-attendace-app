import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { BrandService, BrandSettings } from '@/services/brandService';
import { 
  Upload, 
  Download, 
  RotateCcw, 
  Eye, 
  Image as ImageIcon,
  Palette,
  Save,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface LogoConfig {
  id: string;
  name: string;
  description: string;
  currentUrl: string;
  dimensions: string;
  usage: string[];
}

export const BrandManagement = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({});
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({});
  const [brandSettings, setBrandSettings] = useState<BrandSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // File input refs for each logo type
  const fileInputRefs = {
    mainLogo: useRef<HTMLInputElement>(null),
    largeLogo: useRef<HTMLInputElement>(null),
    favicon: useRef<HTMLInputElement>(null),
    sidebarLogo: useRef<HTMLInputElement>(null)
  };

  // Load brand settings on component mount
  useEffect(() => {
    loadBrandSettings();
  }, []);

  const loadBrandSettings = async () => {
    try {
      setIsLoading(true);
      const settings = await BrandService.getBrandSettings();
      setBrandSettings(settings);
    } catch (error) {
      console.error('Error loading brand settings:', error);
      toast({
        title: 'Error loading settings',
        description: 'Failed to load brand settings.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logoConfigs: LogoConfig[] = [
    {
      id: 'logo_mainLogo',
      name: 'Main Logo',
      description: 'Primary logo used in authentication pages and headers',
      currentUrl: brandSettings?.logo_mainLogo || '/dk-logo.svg',
      dimensions: '40×40px (SVG preferred)',
      usage: ['Login page', 'Signup page', 'Reset password', 'Sidebar']
    },
    {
      id: 'logo_largeLogo',
      name: 'Large Logo',
      description: 'Larger version for authentication pages and landing sections',
      currentUrl: brandSettings?.logo_largeLogo || '/dk-logo-large.svg',
      dimensions: '200×200px (SVG preferred)',
      usage: ['Auth pages', 'Welcome screens', 'Landing sections']
    },
    {
      id: 'logo_favicon',
      name: 'Favicon',
      description: 'Browser tab icon and bookmark icon',
      currentUrl: brandSettings?.logo_favicon || '/dk-logo.svg',
      dimensions: '32×32px (ICO or SVG)',
      usage: ['Browser tab', 'Bookmarks', 'Browser history']
    },
    {
      id: 'logo_sidebarLogo',
      name: 'Sidebar Logo',
      description: 'Compact logo for navigation sidebar',
      currentUrl: brandSettings?.logo_sidebarLogo || '/dk-logo.svg',
      dimensions: '40×40px (SVG preferred)',
      usage: ['Navigation sidebar', 'Mobile menu', 'Collapsed sidebar']
    }
  ];

  const handleFileSelect = (logoId: string, file: File) => {
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/ico', 'image/x-icon'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload SVG, PNG, JPG, or ICO files only.',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload files smaller than 5MB.',
        variant: 'destructive'
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreviewUrls(prev => ({ ...prev, [logoId]: previewUrl }));
    setSelectedFiles(prev => ({ ...prev, [logoId]: file }));
  };

  const handleUploadLogo = async (logoId: string) => {
    const file = selectedFiles[logoId];
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a file first.',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);
    try {
      const logoUrl = await BrandService.uploadLogo(file, logoId);
      await BrandService.updateBrandSetting(logoId, logoUrl);

      toast({
        title: 'Logo updated successfully',
        description: `${logoConfigs.find(c => c.id === logoId)?.name} has been updated.`,
      });

      await loadBrandSettings();

      setSelectedFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[logoId];
        return newFiles;
      });
      
      setPreviewUrls(prev => {
        const newUrls = { ...prev };
        if (newUrls[logoId]) {
          URL.revokeObjectURL(newUrls[logoId]);
          delete newUrls[logoId];
        }
        return newUrls;
      });

      const inputKey = logoId.replace('logo_', '') as keyof typeof fileInputRefs;
      if (fileInputRefs[inputKey]?.current) {
        fileInputRefs[inputKey].current!.value = '';
      }

    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload logo. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetToDefault = async (logoId: string) => {
    try {
      let defaultPath = '/dk-logo.svg';
      if (logoId === 'logo_largeLogo') {
        defaultPath = '/dk-logo-large.svg';
      }
      
      await BrandService.updateBrandSetting(logoId, defaultPath);
      
      toast({
        title: 'Logo reset to default',
        description: `${logoConfigs.find(c => c.id === logoId)?.name} has been reset to default.`,
      });

      await loadBrandSettings();
    } catch (error) {
      toast({
        title: 'Reset failed',
        description: 'Failed to reset logo. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const downloadCurrentLogo = (logoConfig: LogoConfig) => {
    const link = document.createElement('a');
    link.href = logoConfig.currentUrl;
    link.download = `${logoConfig.id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Brand Management</h2>
        </div>
        <Button
          onClick={loadBrandSettings}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Upload new logos to customize your application's branding. Changes will be visible immediately across all pages. 
          SVG format is recommended for best quality at all sizes.
        </AlertDescription>
      </Alert>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading brand settings...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {logoConfigs.map((config) => (
            <Card key={config.id} className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  {config.name}
                </CardTitle>
                <CardDescription>{config.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Current Logo</Label>
                  <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                    <div className="w-16 h-16 border rounded-lg bg-white/50 flex items-center justify-center">
                      <img 
                        src={config.currentUrl} 
                        alt={config.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-muted-foreground">Dimensions: {config.dimensions}</p>
                      <div className="flex flex-wrap gap-1">
                        {config.usage.map((usage, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                            {usage}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadCurrentLogo(config)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Upload New Logo</Label>
                  <div className="space-y-3">
                    <Input
                      ref={fileInputRefs[config.id.replace('logo_', '') as keyof typeof fileInputRefs]}
                      type="file"
                      accept=".svg,.png,.jpg,.jpeg,.ico"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileSelect(config.id, file);
                        }
                      }}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    
                    {previewUrls[config.id] && (
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <Label className="text-sm font-medium mb-2 block">Preview</Label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 border rounded-lg bg-white/50 flex items-center justify-center">
                            <img 
                              src={previewUrls[config.id]} 
                              alt="Preview"
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{selectedFiles[config.id]?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {Math.round((selectedFiles[config.id]?.size || 0) / 1024)} KB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleUploadLogo(config.id)}
                    disabled={!selectedFiles[config.id] || isUploading}
                    className="flex-1"
                  >
                    {isUploading ? (
                      <>
                        <Upload className="h-4 w-4 mr-2 animate-pulse" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Logo
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleResetToDefault(config.id)}
                    disabled={isUploading}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => window.open(config.currentUrl, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="glass">
        <CardHeader>
          <CardTitle>Brand Guidelines</CardTitle>
          <CardDescription>Best practices for logo uploads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Recommended Formats</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>SVG:</strong> Best for scalability and quality</li>
                <li>• <strong>PNG:</strong> Good for detailed logos with transparency</li>
                <li>• <strong>ICO:</strong> Required for favicons in older browsers</li>
                <li>• <strong>JPG:</strong> Acceptable but no transparency support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Size Guidelines</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>Main Logo:</strong> 40×40px minimum</li>
                <li>• <strong>Large Logo:</strong> 200×200px for crisp display</li>
                <li>• <strong>Favicon:</strong> 32×32px standard size</li>
                <li>• <strong>File Size:</strong> Keep under 5MB for fast loading</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
