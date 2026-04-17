import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://tfrzshffptzhrnoqsgmd.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFmZDc3YjJjLWE3NzAtNGFlMC1iMDM0LWYzMjdlNmM2YmQ5YSJ9.eyJwcm9qZWN0SWQiOiJ0ZnJ6c2hmZnB0emhybm9xc2dtZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc2NDExNzgyLCJleHAiOjIwOTE3NzE3ODIsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.Fkrc121k3vvspuNVdtIW6P3mQvpToUAXYDewj0CzGrw';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };