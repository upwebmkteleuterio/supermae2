
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ztxkbyyoxapxmxvetkvg.supabase.co';
const supabaseAnonKey = 'sb_publishable_T3A4lM_OD2aK_LJwMHIWeQ_JD70-EWP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
