'use client';

// Login page wrapped in Shared AuthForm using Zod for client validation
import AuthForm, { type AuthField } from '@/components/ui/AuthForm';
import { signIn } from '@/app/actions/auth';
import { z } from 'zod';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();
  const successParam = searchParams.get('success');
  const errorParam = searchParams.get('error');

  const fields: AuthField[] = [
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
  ];

  const handleSubmit = async (formData: FormData) => {
    const obj = Object.fromEntries(formData.entries());
    const result = loginSchema.safeParse(obj);
    
    // Client-side validation blocks action submission if invalid
    if (!result.success) {
      return { error: result.error.issues[0].message };
    }
    
    // Call server action
    return signIn(formData);
  };

  const footer = (
    <div className="flex flex-col gap-3 items-center mt-2">
      <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
        Forgot your password?
      </Link>
      <p>
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-green-500 hover:text-green-400 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );

  return (
    <AuthForm 
      title="Welcome back" 
      fields={fields} 
      submitLabel="Log In" 
      onSubmit={handleSubmit}
      footer={footer}
      success={successParam || undefined}
      error={errorParam || undefined}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <LoginContent />
    </Suspense>
  );
}
