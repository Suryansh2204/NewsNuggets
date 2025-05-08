import { SignupForm } from '@/components/SignupForm';

export default function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">
          Create Your Account
        </h1>
        <SignupForm />
      </div>
    </div>
  );
}
