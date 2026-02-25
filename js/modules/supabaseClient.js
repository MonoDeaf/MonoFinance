import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://uidetbywqpicjjhrzkmq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_TmOwIi2JcXvtVDUpnj_oCw_3TY92z8I';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const TABLE_NAME = 'mono_app_state';