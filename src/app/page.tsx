import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left-side navigation menu */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-zinc-800">Billiard Booking System</h1>
        <p className="text-zinc-600">Select an option from the menu to get started.</p>
      </main>
    </div>
  );
}
