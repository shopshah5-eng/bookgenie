'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/#pricing');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] text-neutral-600 text-sm">
      Redirecting to pricing plans...
    </div>
  );
}
