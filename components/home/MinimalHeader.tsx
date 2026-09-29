import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { Menu, X, ChevronDown, Edit3, BookOpen, LogOut, Check, Loader2 } from 'lucide-react';

export function MinimalHeader() {
  const { user, openAuthModal, signOut, updateProfileName } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameInput, setEditNameInput] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameError, setNameError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState<{
    tier?: string;
    planName?: string;
    maxPages?: number;
    booksRemaining?: number;
    hasWatermark?: boolean;
    commercialUse?: boolean;
  } | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Load active plan quota whenever user is logged in
  useEffect(() => {
    let isSubscribed = true;
    if (!user) {
      const timer = setTimeout(() => {
        if (isSubscribed) setQuotaInfo(null);
      }, 0);
      return () => {
        isSubscribed = false;
        clearTimeout(timer);
      };
    }

    fetch('/api/subscription/upgrade')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isSubscribed && data) setQuotaInfo(data);
      })
      .catch(() => {});

    return () => {
      isSubscribed = false;
    };
  }, [user]);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
        setIsEditingName(false);
        setNameError('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserDisplayName = () =>
    user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || '';

  const handleSaveName = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setNameError('');
    const trimmed = editNameInput.trim();
    if (!trimmed || trimmed.length < 2) {
      setNameError('Name must be at least 2 characters');
      return;
    }
    if (trimmed.length > 50) {
      setNameError('Name cannot exceed 50 characters');
      return;
    }

    setIsSavingName(true);
    try {
      const success = await updateProfileName(trimmed);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          setIsEditingName(false);
        }, 800);
      } else {
        setNameError('Could not save name. Try again.');
      }
    } catch {
      setNameError('Failed to update name.');
    } finally {
      setIsSavingName(false);
    }
  };

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (pathname === '/') {
      const pricingEl = document.getElementById('pricing');
      if (pricingEl) {
        pricingEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    } else {
      router.push('/#pricing');
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isHome = pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#0000000d] transition-all">
      <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/"
          onClick={handleHomeClick}
          className="flex items-center gap-2 group select-none cursor-pointer"
        >
          <svg
            className="w-5 h-5 text-[#111111]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 1-4 4v14a3 3 0 0 0 3-3h7z" />
          </svg>
          <span className="font-semibold text-lg tracking-tight text-[#111111] font-sans">
            BookGenie
          </span>
        </Link>

        {/* Center: Exactly Two Navigation Options — Home & Pricing */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            onClick={handleHomeClick}
            className={`relative text-[14px] font-medium transition-colors py-1 ${
              isHome
                ? 'text-[#111111]'
                : 'text-[#666666] hover:text-[#111111]'
            }`}
          >
            Home
            {isHome && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111111] rounded-full" />
            )}
          </Link>

          <Link
            href="/#pricing"
            onClick={handlePricingClick}
            className="text-[14px] font-medium text-[#666666] hover:text-[#111111] transition-colors py-1 cursor-pointer"
          >
            Pricing
          </Link>
        </nav>

        {/* Right: User Profile / Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 relative" ref={profileRef}>
              <Link
                href="/my-ebooks"
                className="text-[13px] font-medium text-[#111111] px-4 py-1.5 rounded-full border border-[#EAEAEA] hover:border-[#111111] transition-all"
              >
                My eBooks
              </Link>

              {/* Corner User Name / Profile Icon Button */}
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border transition-all cursor-pointer select-none group ${
                  profileOpen
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white hover:bg-neutral-50 border-[#EAEAEA] text-[#111111]'
                }`}
                title="Account & Profile Settings"
                aria-expanded={profileOpen}
              >
                <div
                  className="w-7 h-7 rounded-full bg-white text-[#111111] border border-[#EAEAEA] shadow-2xs flex items-center justify-center text-xs font-bold select-none shrink-0"
                >
                  {((user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'U')[0]).toUpperCase()}
                </div>
                <span className="text-[13px] font-medium max-w-[120px] truncate">
                  {user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    profileOpen ? 'rotate-180 text-white' : 'text-[#777777] group-hover:text-[#111111]'
                  }`}
                />
              </button>

              {/* Profile Dropdown Popover */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white border border-[#EAEAEA] shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* User Profile Header */}
                  <div className="flex items-start gap-3 pb-3 border-b border-[#F0F0F0]">
                    <div className="w-10 h-10 rounded-full bg-white text-[#111111] border border-[#EAEAEA] shadow-2xs flex items-center justify-center text-sm font-bold shrink-0">
                      {((user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'U')[0]).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-semibold text-[#111111] truncate">
                          {user.user_metadata?.full_name || user.user_metadata?.name || 'BookGenie Creator'}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            quotaInfo?.tier === 'creator'
                              ? 'bg-[#111111] text-white border-[#111111]'
                              : quotaInfo?.tier === 'pro'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : quotaInfo?.tier === 'single'
                              ? 'bg-blue-50 text-blue-900 border-blue-200'
                              : 'bg-[#F6F5F2] text-[#666666] border-[#EAEAEA]'
                          }`}
                        >
                          {quotaInfo?.planName || 'Free Plan'}
                        </span>
                      </div>
                      <span className="text-xs text-[#777777] truncate mt-0.5">{user.email}</span>
                    </div>
                  </div>

                  {/* Active Quota Breakdown Card */}
                  <div className="p-3 my-2 rounded-xl bg-[#FAF9F6] border border-[#EAEAEA] flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#666666]">Max Length:</span>
                      <span className="font-semibold text-[#111111]">
                        Up to {quotaInfo?.maxPages || 20} pages / book
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#666666]">Books Remaining:</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
                        {quotaInfo?.booksRemaining ?? 1} available
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#666666]">Commercial Rights:</span>
                      <span className="font-medium text-[#111111]">
                        {quotaInfo?.commercialUse ? 'Licensed ✓' : 'Personal only'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#666666]">Watermark:</span>
                      <span className="font-medium text-[#111111]">
                        {quotaInfo?.hasWatermark ? 'Included' : 'Removed ✓'}
                      </span>
                    </div>

                    <Link
                      href="/#pricing"
                      onClick={() => setProfileOpen(false)}
                      className="mt-1 text-center py-1.5 rounded-lg bg-white border border-[#EAEAEA] hover:border-[#111111] text-[11px] font-semibold text-[#111111] transition-colors"
                    >
                      {quotaInfo?.tier === 'creator' ? 'Manage Subscription' : 'Upgrade Plan & Quota →'}
                    </Link>
                  </div>

                  {/* Edit Name Section */}
                  <div className="py-3 border-b border-[#F0F0F0]">
                    {!isEditingName ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditNameInput(getUserDisplayName());
                          setIsEditingName(true);
                          setNameError('');
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#111111] hover:bg-[#F6F5F2] transition-colors cursor-pointer group"
                      >
                        <span className="flex items-center gap-2">
                          <Edit3 className="w-3.5 h-3.5 text-[#666666] group-hover:text-[#111111]" />
                          Edit Profile Name
                        </span>
                        <span className="text-[11px] text-[#888888] group-hover:text-[#111111]">
                          Change →
                        </span>
                      </button>
                    ) : (
                      <form onSubmit={handleSaveName} className="flex flex-col gap-2 pt-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#777777]">
                            Update Your Name
                          </label>
                          {saveSuccess && (
                            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                              <Check className="w-3 h-3" /> Saved!
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={editNameInput}
                          onChange={(e) => setEditNameInput(e.target.value)}
                          placeholder="Enter your name"
                          autoFocus
                          disabled={isSavingName}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#DDDDDD] focus:border-[#111111] focus:ring-1 focus:ring-[#111111] text-xs text-[#111111] bg-white outline-none transition-all"
                        />
                        {nameError && (
                          <span className="text-[11px] text-red-600">{nameError}</span>
                        )}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="submit"
                            disabled={isSavingName}
                            className="flex-1 py-1.5 rounded-lg bg-[#111111] hover:bg-[#222222] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {isSavingName ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Saving...</span>
                              </>
                            ) : (
                              'Save Name'
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingName(false);
                              setNameError('');
                            }}
                            disabled={isSavingName}
                            className="px-3 py-1.5 rounded-lg border border-[#EAEAEA] hover:border-[#111111] text-xs font-medium text-[#666666] hover:text-[#111111] transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Menu Quick Links */}
                  <div className="py-2 flex flex-col gap-1">
                    <Link
                      href="/my-ebooks"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#111111] hover:bg-[#F6F5F2] transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#666666]" />
                      <span>My eBooks Library</span>
                    </Link>
                  </div>

                  {/* Sign Out Action */}
                  <div className="pt-2 border-t border-[#F0F0F0]">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => openAuthModal('signin', '/')}
                className="px-4 py-2 rounded-full border border-[#EAEAEA] text-[13px] font-medium text-[#111111] hover:border-[#111111] transition-all cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('signup', '/')}
                className="px-5 py-2 rounded-full bg-[#111111] hover:bg-[#222222] text-[13px] font-medium text-white transition-all shadow-xs cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#111111] rounded-lg hover:bg-black/5 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#0000000d] px-6 py-5 flex flex-col gap-4 shadow-lg animate-in fade-in duration-150">
          <Link
            href="/"
            onClick={handleHomeClick}
            className={`text-sm font-medium py-1 ${isHome ? 'text-[#111111] font-semibold' : 'text-[#666666]'}`}
          >
            Home
          </Link>
          <Link
            href="/#pricing"
            onClick={handlePricingClick}
            className="text-sm font-medium text-[#666666] py-1 cursor-pointer"
          >
            Pricing
          </Link>

          <div className="pt-4 border-t border-[#F0F0F0] flex flex-col gap-3">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5 py-1">
                  <div className="w-9 h-9 rounded-full bg-white text-[#111111] border border-[#EAEAEA] shadow-2xs flex items-center justify-center text-xs font-bold shrink-0">
                    {((user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'U')[0]).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-semibold text-[#111111] truncate">
                      {user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]}
                    </span>
                    <span className="text-[11px] text-[#888888] truncate">{user.email}</span>
                  </div>
                </div>

                {/* Mobile Edit Name */}
                <div className="p-3 bg-[#F6F5F2] rounded-xl border border-[#EAEAEA]">
                  {!isEditingName ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditNameInput(getUserDisplayName());
                        setIsEditingName(true);
                        setNameError('');
                      }}
                      className="w-full flex items-center justify-between text-xs font-medium text-[#111111] cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5" /> Edit Profile Name
                      </span>
                      <span className="text-[11px] text-[#777777]">Edit →</span>
                    </button>
                  ) : (
                    <form onSubmit={handleSaveName} className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={editNameInput}
                        onChange={(e) => setEditNameInput(e.target.value)}
                        placeholder="Your name"
                        disabled={isSavingName}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#CCCCCC] text-xs bg-white text-[#111111]"
                      />
                      {nameError && <span className="text-[11px] text-red-600">{nameError}</span>}
                      {saveSuccess && <span className="text-[11px] text-emerald-600">Saved!</span>}
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={isSavingName}
                          className="flex-1 py-1 bg-[#111111] text-white rounded-md text-xs font-medium"
                        >
                          {isSavingName ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingName(false)}
                          className="px-3 py-1 border border-[#CCCCCC] rounded-md text-xs font-medium text-[#666666]"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F0F0F0]">
                  <Link
                    href="/my-ebooks"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-[#111111]"
                  >
                    My eBooks
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-red-600 font-medium hover:text-red-700 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    openAuthModal('signin', '/');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 rounded-full border border-[#EAEAEA] text-xs font-medium text-[#111111] text-center cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openAuthModal('signup', '/');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 rounded-full bg-[#111111] text-white text-xs font-medium text-center cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
