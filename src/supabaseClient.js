import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hunijzihfknqcwbmfwtu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bmlqemloZmtucWN3Ym1md3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MTY1MDEsImV4cCI6MjA1MTM5MjUwMX0.d2EIAXOLQzyDuVjAYS4Je_zbgLdvYT5wBLX6IS7wTiA';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;