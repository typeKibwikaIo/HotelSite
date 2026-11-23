import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-bluegrey-deep flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
        <p className="text-peach-dark text-xs tracking-[0.3em] uppercase text-center">Administration</p>
        <h1 className="font-display text-3xl text-center mt-2">Hotel Dashboard</h1>
        <p className="text-sm text-ink-soft text-center mt-2 mb-8">Sign in to manage your hotel website.</p>
        <LoginForm />
      </div>
    </div>
  );
}
