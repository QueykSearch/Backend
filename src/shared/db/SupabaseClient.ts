import {createClient} from '@supabase/supabase-js';
import * as process from 'process';

const {SUPABASE_URL, SUPABASE_ANON_KEY} = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Faltan variables de entorno para Supabase');
}

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
