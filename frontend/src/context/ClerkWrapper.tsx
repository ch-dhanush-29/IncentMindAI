import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_bG9naWNhbC1yYXR0bGVyLTI4NzguY2xlcmsuYWNjb3VudHMuZGV2JA";

export const ClerkWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!PUBLISHABLE_KEY) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
};
