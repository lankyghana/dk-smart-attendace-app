import { supabase } from '@/integrations/supabase/client';

export interface BrandSettings {
  logo_mainLogo: string;
  logo_largeLogo: string;
  logo_favicon: string;
  logo_sidebarLogo: string;
  brand_name: string;
  brand_description: string;
  primary_color: string;
  secondary_color: string;
}

export class BrandService {
  private static cache: BrandSettings | null = null;
  private static STORAGE_KEY = 'dk_brand_settings';

  // Get all brand settings (fallback to localStorage for now)
  static async getBrandSettings(): Promise<BrandSettings> {
    // Return cached version if available
    if (this.cache) {
      return this.cache;
    }

    try {
      // Try to get from localStorage first (temporary solution)
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const settings = JSON.parse(stored);
        this.cache = settings;
        return settings;
      }

      // Default settings
      const defaultSettings: BrandSettings = {
        logo_mainLogo: '/dk-logo.svg',
        logo_largeLogo: '/dk-logo-large.svg',
        logo_favicon: '/dk-logo.svg',
        logo_sidebarLogo: '/dk-logo.svg',
        brand_name: 'DK Smart Attendance',
        brand_description: 'Professional attendance management system',
        primary_color: '#2563eb',
        secondary_color: '#10b981'
      };

      this.cache = defaultSettings;
      return defaultSettings;
    } catch (error) {
      console.error('Error fetching brand settings:', error);
      
      // Return defaults on error
      const defaultSettings: BrandSettings = {
        logo_mainLogo: '/dk-logo.svg',
        logo_largeLogo: '/dk-logo-large.svg',
        logo_favicon: '/dk-logo.svg',
        logo_sidebarLogo: '/dk-logo.svg',
        brand_name: 'DK Smart Attendance',
        brand_description: 'Professional attendance management system',
        primary_color: '#2563eb',
        secondary_color: '#10b981'
      };
      
      return defaultSettings;
    }
  }

  // Get a specific brand setting
  static async getBrandSetting(key: keyof BrandSettings): Promise<string> {
    const settings = await this.getBrandSettings();
    return settings[key];
  }

  // Update a brand setting (save to localStorage for now)
  static async updateBrandSetting(key: string, value: string): Promise<void> {
    try {
      const currentSettings = await this.getBrandSettings();
      const updatedSettings = { ...currentSettings, [key]: value };
      
      // Save to localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSettings));
      
      // Update cache
      this.cache = updatedSettings;
      
      // Apply to DOM immediately
      this.applyBrandingToDOM(updatedSettings);
    } catch (error) {
      console.error('Error updating brand setting:', error);
      throw error;
    }
  }

  // Update multiple brand settings
  static async updateBrandSettings(settings: Record<string, string>): Promise<void> {
    try {
      const currentSettings = await this.getBrandSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      
      // Save to localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSettings));
      
      // Update cache
      this.cache = updatedSettings;
      
      // Apply to DOM immediately
      this.applyBrandingToDOM(updatedSettings);
    } catch (error) {
      console.error('Error updating brand settings:', error);
      throw error;
    }
  }

  // Upload logo file to Supabase Storage
  static async uploadLogo(file: File, logoType: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${logoType}-${Date.now()}.${fileExt}`;
      
      // Create the bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'brand-assets');
      
      if (!bucketExists) {
        await supabase.storage.createBucket('brand-assets', { public: true });
      }
      
      const { data, error } = await supabase.storage
        .from('brand-assets')
        .upload(`logos/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('brand-assets')
        .getPublicUrl(`logos/${fileName}`);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  }

  // Clear cache
  static clearCache(): void {
    this.cache = null;
  }

  // Apply brand settings to DOM (for dynamic theming)
  static applyBrandingToDOM(settings: BrandSettings): void {
    // Update CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', settings.primary_color);
    root.style.setProperty('--brand-secondary', settings.secondary_color);

    // Update page title
    document.title = settings.brand_name;

    // Update favicon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = settings.logo_favicon;
    }

    // Update meta tags
    const description = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (description) {
      description.content = settings.brand_description;
    }

    const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
    if (ogTitle) {
      ogTitle.content = settings.brand_name;
    }

    const ogDescription = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
    if (ogDescription) {
      ogDescription.content = settings.brand_description;
    }
  }

  // Initialize branding on app start
  static async initializeBranding(): Promise<void> {
    const settings = await this.getBrandSettings();
    this.applyBrandingToDOM(settings);
  }
}
