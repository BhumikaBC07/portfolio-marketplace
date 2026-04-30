import { Suspense } from 'react';
import SignupForm from './SignupForm';

function LoadingFallback() {
  return (
      <div
          className="pt-16 min-h-screen flex items-center justify-center"
          style={{ backgroundColor: '#f9f5ef' }}
      >
        <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#2c1810', borderTopColor: 'transparent' }}
        />
      </div>
  );
}

export default function SignupPage() {
  return (
      <Suspense fallback={<LoadingFallback />}>
        <SignupForm />
      </Suspense>
  );
}