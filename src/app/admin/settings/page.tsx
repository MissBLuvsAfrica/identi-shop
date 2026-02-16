import Link from 'next/link';
import { getSettings } from '@/lib/settings';
import { SettingsForm } from './SettingsForm';

export default async function AdminSettingsPage() {
  let settings: Awaited<ReturnType<typeof getSettings>> | null = null;
  try {
    settings = await getSettings();
  } catch (error) {
    console.error('Failed to fetch settings:', error);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light">Site & Payment Settings</h1>
        <Link href="/admin" className="text-sm text-gray-600 hover:text-black">
          ← Dashboard
        </Link>
      </div>

      <p className="text-gray-600 mb-6">
        These values are stored in the Google Sheets &quot;settings&quot; tab. Contact and social
        overrides appear on the site footer and contact page. Payment toggles control checkout
        behavior; API keys remain in environment variables and are not shown here.
      </p>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
