'use server';

import { createAdminClient } from '@/lib/supabase/admin';

interface AdmissionsPayload {
  parent_name: string;
  student_name: string;
  phone: string;
  email?: string;
  grade_level?: string;
  selected_system?: string;
  notes?: string;
}

interface ContactPayload {
  name: string;
  phone: string;
  email?: string;
  message: string;
}

export async function submitAdmission(payload: AdmissionsPayload) {
  // Basic validation
  if (!payload.parent_name?.trim() || !payload.student_name?.trim() || !payload.phone?.trim()) {
    return { success: false, error: 'Missing required fields' };
  }

  const supabase = createAdminClient();

  const { error } = await supabase.from('admissions').insert({
    parent_name: payload.parent_name.trim(),
    student_name: payload.student_name.trim(),
    phone: payload.phone.trim(),
    email: payload.email?.trim() || null,
    grade_level: payload.grade_level?.trim() || null,
    selected_system: payload.selected_system || null,
    notes: payload.notes?.trim() || null,
  });

  if (error) {
    console.error('Admission submission error:', error.message);
    return { success: false, error: 'Failed to submit. Please try again.' };
  }

  return { success: true };
}

export async function submitContactInquiry(payload: ContactPayload) {
  // Basic validation
  if (!payload.name?.trim() || !payload.phone?.trim() || !payload.message?.trim()) {
    return { success: false, error: 'Missing required fields' };
  }

  const supabase = createAdminClient();

  const { error } = await supabase.from('admissions').insert({
    parent_name: payload.name.trim(),
    student_name: 'N/A',
    phone: payload.phone.trim(),
    email: payload.email?.trim() || null,
    grade_level: 'contact-inquiry',
    notes: payload.message.trim(),
  });

  if (error) {
    console.error('Contact submission error:', error.message);
    return { success: false, error: 'Failed to submit. Please try again.' };
  }

  return { success: true };
}
