import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Utility: Check if user is main admin
async function isMainAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('is_main_admin')
    .eq('user_id', userId)
    .single();
  return !!data?.is_main_admin;
}

// Utility: Log admin action
async function logAdminAction(actorId: string, action: string, targetUserId?: string, details?: any) {
  await supabase.from('admin_audit_log').insert([
    {
      actor_id: actorId,
      action,
      target_user_id: targetUserId,
      details,
    },
  ]);
}

// Example: Add new admin (only main admin allowed)
// Use generic req/res types for portability
export default async function handler(req: any, res: any) {
  const { actorId, newAdminEmail, newAdminName } = req.body;

  // 1. Auth check (in production, use JWT from headers)
  if (!actorId) return res.status(401).json({ error: 'Unauthorized' });

  // 2. Main admin check
  if (!(await isMainAdmin(actorId))) {
    await logAdminAction(actorId, 'unauthorized_admin_add_attempt', undefined, { newAdminEmail });
    return res.status(403).json({ error: 'Only main admin can add new admins' });
  }

  // 3. Invite new admin user via Supabase Admin API
  // This requires the service role key and the "invite" endpoint
  const inviteRes = await supabase.auth.admin.createUser({
    email: newAdminEmail,
    user_metadata: {
      name: newAdminName,
      role: 'admin',
      is_main_admin: false // Set to true only if this is the main admin
    },
    email_confirm: false // Send invite email
  });

  if (inviteRes.error) {
    await logAdminAction(actorId, 'admin_invite_failed', undefined, { newAdminEmail, error: inviteRes.error.message });
    return res.status(500).json({ error: inviteRes.error.message });
  }

  // 4. Log action
  await logAdminAction(actorId, 'add_admin', inviteRes.data.user?.id, { newAdminEmail, newAdminName });

  return res.status(200).json({ success: true, user: inviteRes.data.user });
}
