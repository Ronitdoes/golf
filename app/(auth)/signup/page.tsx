'use client';

// Signup page wrapped in Shared AuthForm using Zod for client validation
import AuthForm, { type AuthField } from '@/components/ui/AuthForm';
import { signUp, verifyEmailOTP } from '@/app/actions/auth';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import Link from 'next/link';

const signupSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});
export default function SignupPage() {
  const router = useRouter();
  const currentEmail = useRef<string>('');

  const fields: AuthField[] = [
    { name: 'full_name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    { name: 'confirm_password', label: 'Confirm Password', type: 'password', required: true },
  ];

  const handleSubmit = async (formData: FormData) => {
    const obj = Object.fromEntries(formData.entries());
    const result = signupSchema.safeParse(obj);
    
    // Client-side validation blocks action submission if invalid
    if (!result.success) {
      return { error: result.error.issues[0].message };
    }
    
    currentEmail.current = obj.email as string;
    
    // Call server action
    return signUp(formData);
  };

  const handleVerify = async (code: string) => {
    const res = await verifyEmailOTP(currentEmail.current, code);
    if (res && res.success) {
      // Redirect after a short delay for feedback
      setTimeout(() => router.push('/login?success=Account+confirmed!+Please+log+in.'), 1500);
    }
    return res;
  };

  const footer = (
    <p>
      Already have an account?{' '}
      <Link href="/login" className="text-green-500 hover:text-green-400 font-medium">
        Log in instead
      </Link>
    </p>
  );

  return (
    <AuthForm 
      title={currentEmail.current ? "Verify your email" : "Create your account"} 
      fields={fields} 
      submitLabel="Sign Up" 
      onSubmit={handleSubmit}
      onVerify={handleVerify}
      footer={footer}
    />
  );
}
