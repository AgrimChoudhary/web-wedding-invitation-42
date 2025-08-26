import { WeddingData } from './wedding';
import { PlatformData } from './platform';

export interface TemplateProps {
  // Core wedding data
  weddingData: WeddingData;
  
  // Guest information
  guestName?: string;
  guestId?: string;
  
  // Platform integration
  platformData?: PlatformData;
  isPlatformMode?: boolean;
  
  // RSVP functionality
  rsvpConfig?: 'simple' | 'detailed';
  showEditButton?: boolean;
  wishesEnabled?: boolean;
  
  // Event handlers
  onAcceptInvitation?: () => void;
  onOpenRSVP?: () => void;
  onOpenWishes?: () => void;
  
  // UI state
  isLoading?: boolean;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  component: React.ComponentType<TemplateProps>;
}