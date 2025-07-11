
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rkmpycttvbdffmxdmwck.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrbXB5Y3R0dmJkZmZteGRtd2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzOTI5NDMsImV4cCI6MjA1ODk2ODk0M30.BMlfsIaimYeM8yDnoTia11K153q_HbB27_E8SIVn_hI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
