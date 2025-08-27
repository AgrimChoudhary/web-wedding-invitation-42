import React from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { CustomField } from '../types/platform';

interface RSVPFieldRendererProps {
  field: CustomField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const RSVPFieldRenderer: React.FC<RSVPFieldRendererProps> = ({
  field,
  value,
  onChange,
  error
}) => {
  const fieldType = field.field_type;
  const isRequired = field.is_required || false;
  const placeholder = field.placeholder_text || '';
  const maxLength = field.max_length;

  console.debug(`[RSVP] Rendering field ${field.field_name} as type ${fieldType}`);

  const renderField = () => {
    switch (fieldType) {
      case 'datetime-local':
        return (
          <Input
            id={field.field_name}
            name={field.field_name}
            type="datetime-local"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={isRequired}
            className="border-wedding-gold/30 focus:border-wedding-gold focus:ring-wedding-gold/20 rounded-lg"
          />
        );

      case 'date':
        return (
          <Input
            id={field.field_name}
            name={field.field_name}
            type="date"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={isRequired}
            className="border-wedding-gold/30 focus:border-wedding-gold focus:ring-wedding-gold/20 rounded-lg"
          />
        );

      case 'time':
        return (
          <Input
            id={field.field_name}
            name={field.field_name}
            type="time"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={isRequired}
            className="border-wedding-gold/30 focus:border-wedding-gold focus:ring-wedding-gold/20 rounded-lg"
          />
        );

      case 'number':
        return (
          <Input
            id={field.field_name}
            name={field.field_name}
            type="number"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={isRequired}
            className="border-wedding-gold/30 focus:border-wedding-gold focus:ring-wedding-gold/20 rounded-lg"
          />
        );

      case 'email':
        return (
          <Input
            id={field.field_name}
            name={field.field_name}
            type="email"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={isRequired}
            maxLength={maxLength}
            className="border-wedding-gold/30 focus:border-wedding-gold focus:ring-wedding-gold/20 rounded-lg"
          />
        );

      case 'tel':
        return (
          <Input
            id={field.field_name}
            name={field.field_name}
            type="tel"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={isRequired}
            maxLength={maxLength}
            className="border-wedding-gold/30 focus:border-wedding-gold focus:ring-wedding-gold/20 rounded-lg"
          />
        );

      case 'select':
        return (
          <Select value={value} onValueChange={onChange} required={isRequired}>
            <SelectTrigger className="border-wedding-gold/30 focus:border-wedding-gold focus:ring-wedding-gold/20 rounded-lg">
              <SelectValue placeholder={placeholder || "Choose an option"} />
            </SelectTrigger>
            <SelectContent className="bg-white border-wedding-gold/30 z-50">
              {(Array.isArray(field.field_options) ? field.field_options : field.field_options?.options || []).map((option) => (
                <SelectItem key={option} value={option} className="hover:bg-wedding-cream/50">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.field_name}
              checked={value === 'true'}
              onCheckedChange={(checked) => onChange(checked ? 'true' : 'false')}
              className="border-wedding-gold/30 data-[state=checked]:bg-wedding-gold data-[state=checked]:border-wedding-gold"
            />
            <Label htmlFor={field.field_name} className="text-sm text-wedding-maroon">
              {field.field_label}
            </Label>
          </div>
        );

      case 'textarea':
        return (
          <Textarea
            id={field.field_name}
            name={field.field_name}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={isRequired}
            maxLength={maxLength}
            className="border-wedding-gold/30 focus:border-wedding-gold focus:ring-wedding-gold/20 rounded-lg resize-none"
            rows={3}
          />
        );

      default: // text fallback
        console.warn(`[RSVP] Unknown field type ${fieldType} for ${field.field_name}, using text input`);
        return (
          <Input
            id={field.field_name}
            name={field.field_name}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={isRequired}
            maxLength={maxLength}
            className="border-wedding-gold/30 focus:border-wedding-gold focus:ring-wedding-gold/20 rounded-lg"
          />
        );
    }
  };

  return (
    <div>
      {fieldType !== 'checkbox' && (
        <Label htmlFor={field.field_name} className="text-wedding-maroon font-medium text-sm">
          {field.field_label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div className={fieldType !== 'checkbox' ? "mt-1" : ""}>
        {renderField()}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};