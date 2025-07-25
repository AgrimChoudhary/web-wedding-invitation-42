import React from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CustomField } from '../types/platform';

interface DynamicFormFieldProps {
  field: CustomField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  field,
  value,
  onChange,
  error
}) => {
  const getFieldType = (fieldType: string): 'text' | 'textarea' | 'select' | 'email' | 'number' => {
    const validTypes = ['text', 'textarea', 'select', 'email', 'number'];
    return validTypes.includes(fieldType) ? fieldType as any : 'text';
  };

  const fieldType = getFieldType(field.field_type);
  const isRequired = field.is_required || false;
  const placeholder = field.placeholder_text || '';
  const maxLength = field.max_length;

  const renderField = () => {
    switch (fieldType) {
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

      case 'select':
        return (
          <Select value={value} onValueChange={onChange} required={isRequired}>
            <SelectTrigger className="border-wedding-gold/30 focus:border-wedding-gold focus:ring-wedding-gold/20 rounded-lg">
              <SelectValue placeholder={placeholder || "Choose an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.field_options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

      default: // text
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
      <Label htmlFor={field.field_name} className="text-wedding-maroon font-medium text-sm">
        {field.field_label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="mt-1">
        {renderField()}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};