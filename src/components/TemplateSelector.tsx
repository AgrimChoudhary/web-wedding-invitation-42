
import React from 'react';
import { Button } from '@/components/ui/button';

interface MessageTemplate {
  name: string;
  template: string;
}

interface TemplateSelectorProps {
  templates: MessageTemplate[];
  selectedTemplate: string | null;
  onSelect: (template: string, name: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onSelect
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {templates.map((template, index) => (
        <Button
          key={index}
          type="button"
          variant="outline"
          className={`h-auto py-2 px-4 border-wedding-gold/30 hover:bg-wedding-cream justify-start text-left ${
            selectedTemplate === template.name ? "bg-wedding-cream border-wedding-gold" : ""
          }`}
          onClick={() => onSelect(template.template, template.name)}
        >
          <div className="font-medium text-wedding-maroon">{template.name}</div>
        </Button>
      ))}
    </div>
  );
};

export default TemplateSelector;
