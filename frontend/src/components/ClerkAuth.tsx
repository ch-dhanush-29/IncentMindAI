import React from 'react';
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  UserButton, 
  useUser 
} from '@clerk/clerk-react';
import { LogIn, Shield, UserCheck } from 'lucide-react';

interface ClerkAuthControlProps {
  compact?: boolean;
}

export const ClerkAuthControl: React.FC<ClerkAuthControlProps> = ({ compact = false }) => {
  return (
    <div className="flex items-center gap-2">
      <SignedIn>
        <SignedInContent compact={compact} />
      </SignedIn>

      <SignedOut>
        <SignedOutContent compact={compact} />
      </SignedOut>
    </div>
  );
};

const SignedInContent: React.FC<{ compact: boolean }> = ({ compact }) => {
  const { user } = useUser();
  const displayName = user?.fullName || user?.firstName || 'Incident Commander';
  const email = user?.primaryEmailAddress?.emailAddress || 'commander@incidentmind.ai';

  return (
    <div className="flex items-center gap-2.5">
      {!compact && (
        <div className="text-right hidden sm:block">
          <div className="text-xs font-semibold text-[#172033] dark:text-[#F1F5F9] leading-tight flex items-center gap-1.5 justify-end">
            <span>{displayName}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Active SRE Session" />
          </div>
          <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono leading-tight truncate max-w-[150px]">
            {email}
          </div>
        </div>
      )}
      <div className="p-0.5 rounded-full border border-[#E2E8F0] dark:border-[#2D3545] bg-white dark:bg-[#161F30]">
        <UserButton 
          afterSignOutUrl="/" 
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 rounded-full",
              userButtonPopoverCard: "shadow-xl border border-[#E2E8F0] dark:border-[#2D3545]"
            }
          }}
        />
      </div>
    </div>
  );
};

const SignedOutContent: React.FC<{ compact: boolean }> = ({ compact }) => {
  return (
    <div className="flex items-center gap-2">
      <SignInButton mode="modal">
        <button 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-medium shadow-xs transition-all cursor-pointer active:scale-98"
          title="Sign in with Clerk Single Sign-On"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>{compact ? 'Sign In' : 'Sign In with Clerk'}</span>
        </button>
      </SignInButton>

      {!compact && (
        <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F8FAFC] dark:bg-[#161F30] border border-[#E2E8F0] dark:border-[#222834] text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8]">
          <Shield className="w-3 h-3 text-emerald-500" />
          <span>SRE Sandbox</span>
        </div>
      )}
    </div>
  );
};
