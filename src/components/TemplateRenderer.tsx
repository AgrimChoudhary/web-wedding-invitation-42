import React from 'react';
import { TemplateProps } from '@/types/template';
import { getTemplateById, getDefaultTemplate } from '@/templates';

interface TemplateRendererProps extends TemplateProps {
  templateId?: string;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  templateId,
  ...templateProps
}) => {
  // Get the template configuration
  const templateConfig = templateId 
    ? getTemplateById(templateId) || getDefaultTemplate()
    : getDefaultTemplate();

  // Get the template component
  const TemplateComponent = templateConfig.component;

  // Render the template with all props
  return <TemplateComponent {...templateProps} />;
};

export default TemplateRenderer;