import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <h1 className="text-4xl font-bold text-primary mb-6">NutriFlare</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-md">
        Your ultimate fitness and nutrition companion. Start your journey today.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          Login
        </Link>
        <Link 
          href="/register" 
          className="bg-secondary text-secondary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          Register
        </Link>
      </div>
    </main>
  );
}
