import { createClient } from '@supabase/supabase-js';

const URL = 'https://lhpnnsedbwgbwymvacxr.supabase.co';
const SERVICE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxocG5uc2VkYndnYnd5bXZhY3hyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQzNTA2MSwiZXhwIjoyMDg3MDExMDYxfQ.L9KbPuh95Qergx5yPWizHhHGJmuprrnuTf6b6usR4SM';

const sb = createClient(URL, SERVICE);

const { data } = await sb.from('page_content').select('*').eq('section_key', 'about').single();

console.log('=== ABOUT ROW IN DB ===');
console.log('id:', data?.id);
console.log('title_en:', JSON.stringify(data?.title_en));
console.log('title_ar:', JSON.stringify(data?.title_ar));
console.log('subtitle_en:', JSON.stringify(data?.subtitle_en));
console.log('subtitle_ar:', JSON.stringify(data?.subtitle_ar));
console.log('content_en:', JSON.stringify(data?.content_en));
console.log('content_ar:', JSON.stringify(data?.content_ar));
console.log('image_url:', JSON.stringify(data?.image_url));
console.log('extra_data:', JSON.stringify(data?.extra_data));
console.log('updated_at:', data?.updated_at);

// Also check hero
const { data: hero } = await sb.from('page_content').select('*').eq('section_key', 'hero').single();
console.log('\n=== HERO ROW IN DB ===');
console.log('title_en:', JSON.stringify(hero?.title_en));
console.log('title_ar:', JSON.stringify(hero?.title_ar));
console.log('content_en:', JSON.stringify(hero?.content_en));
console.log('content_ar:', JSON.stringify(hero?.content_ar));
console.log('updated_at:', hero?.updated_at);
