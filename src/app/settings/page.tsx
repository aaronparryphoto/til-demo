import { getCurrentUser } from '@/server/actions/user-actions';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { ProfileEditor } from '@/components/settings/ProfileEditor';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const user = await getCurrentUser();

  // If no user, redirect to home (will trigger onboarding)
  if (!user) {
    redirect('/');
  }

  return (
    <main className="min-h-screen py-8 sm:py-12">
      <Container>
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
            <p className="text-text-secondary mt-2">
              Manage your profile and preferences
            </p>
          </div>

          {/* Profile section */}
          <Card>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Profile
            </h2>
            <ProfileEditor user={user} />
          </Card>

          {/* User info section (optional) */}
          <Card>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Account Information
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-text-tertiary">User ID</dt>
                <dd className="text-text-secondary font-mono mt-1">{user.id}</dd>
              </div>
              <div>
                <dt className="text-text-tertiary">Member since</dt>
                <dd className="text-text-secondary mt-1">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </Container>
    </main>
  );
}
