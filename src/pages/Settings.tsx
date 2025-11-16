import PageWrapper from "@/components/PageWrapper";

export default function Settings() {
  return (
    <PageWrapper>
      <div className="p-4 pb-24 space-y-4">
        <h1 className="text-2xl font-bold">Settings</h1>

        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h2 className="font-semibold mb-1">About</h2>
          <p className="text-gray-600 text-sm">
            Personal Budget Planner — Built with React, Vite, Tailwind, Firebase.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h2 className="font-semibold mb-1">Version</h2>
          <p className="text-gray-600 text-sm">v1.0.0</p>
        </div>
      </div>
    </PageWrapper>
  );
}
