import PortalHeader from "@/components/PortalHeader";
import PortalFooter from "@/components/PortalFooter";

export default function SettingsPage() {
  return (
    <>
      <PortalHeader />
      <main className="min-h-screen max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
        <p className="mt-4 text-lg text-gray-600">
          Configure your account, preferences, and team access controls here.
        </p>
        <div className="mt-10 text-gray-500">
          ⚙️ Settings options coming soon.
        </div>
      </main>
      <PortalFooter />
    </>
  );
}
