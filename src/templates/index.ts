import { TemplateConfig } from '@/types/template';
import { RoyalTemplate } from './RoyalTemplate';
import { ModernTemplate } from './ModernTemplate';
import { MinimalTemplate } from './MinimalTemplate';

export const AVAILABLE_TEMPLATES: TemplateConfig[] = [
  {
    id: 'royal',
    name: 'Royal Indian Wedding',
    description: 'Traditional Indian wedding template with ornate designs and cultural elements',
    thumbnail: '/lovable-uploads/a3236bd1-0ba5-41b5-a422-ef2a60c43cd4.png',
    component: RoyalTemplate,
  },
  {
    id: 'modern',
    name: 'Modern Elegance',
    description: 'Clean, contemporary design with beautiful gradients and modern typography',
    thumbnail: '/images/modern-template-preview.jpg',
    component: ModernTemplate,
  },
  {
    id: 'minimal',
    name: 'Minimal Chic',
    description: 'Sophisticated minimalist design with clean lines and elegant simplicity',
    thumbnail: '/images/minimal-template-preview.jpg',
    component: MinimalTemplate,
  },
];

export const getTemplateById = (templateId: string): TemplateConfig | undefined => {
  return AVAILABLE_TEMPLATES.find(template => template.id === templateId);
};

export const getDefaultTemplate = (): TemplateConfig => {
  return AVAILABLE_TEMPLATES[0]; // Royal template as default
};

export { RoyalTemplate, ModernTemplate, MinimalTemplate };