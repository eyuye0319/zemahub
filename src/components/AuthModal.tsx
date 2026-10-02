// src/components/AuthModal.tsx
import React, { useEffect, useState } from 'react';
import { X, AlertCircle, LogIn, UserPlus, KeyRound, Check } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { useAuth, AuthModalMode } from '../context/AuthContext';
import EthiopianCross from './EthiopianCross';

interface AuthModalProps {
  currentLang: Language;
}

export default function AuthModal({ currentLang }: AuthModalProps) {
  const { authModalOpen, authModalMode, closeAuthModal, login, register, changePassword } = useAuth();
  const [mode, setMode] = useState<AuthModalMode>(authModalMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);

  useEffect(() => {
    if (authModalOpen) {
      setMode(authModalMode);
      setError('');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordChanged(false);
    }
  }, [authModalOpen, authModalMode]);

  if (!authModalOpen) return null;

  const t = translations[currentLang];
  const isRegister = mode === 'register';
  const isPasswordChange = mode === 'password';

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError(t.authPasswordMismatch);
      return;
    }
    setSubmitting(true);
    try {
      await changePassword(password, newPassword);
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordChanged(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      setName('');
      setEmail('');
      setPassword('');
      closeAuthModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-[#120205] border border-gold-500/40 rounded-xl px-4 py-3 text-sm text-parchment-100 placeholder-parchment-400/50 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="absolute inset-0" onClick={closeAuthModal}></div>

      <div className="relative w-full max-w-md bg-[#1A0409] text-parchment-100 rounded-2xl border border-gold-500/50 shadow-2xl z-10 text-left overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-burgundy-600"></div>

        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-lg text-parchment-300 hover:text-rose-400 hover:bg-burgundy-900/60 transition-all cursor-pointer"
          aria-label={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-5">
          <div className="text-center space-y-2">
            <EthiopianCross size={36} className="text-gold-400 mx-auto" />
            <h3 className="font-serif font-bold text-xl text-gold-300">
              {isPasswordChange ? t.authChangePassword : isRegister ? t.authRegisterTitle : t.authSignInTitle}
            </h3>
            {!isPasswordChange && <p className="text-xs text-parchment-300/80">{t.authSubtitle}</p>}
          </div>

          {isPasswordChange ? (
            <form onSubmit={handleChangePassword} className="space-y-3">
              {[
                [t.authCurrentPassword, password, setPassword, 'current-password'],
                [t.authNewPassword, newPassword, setNewPassword, 'new-password'],
                [t.authConfirmPassword, confirmPassword, setConfirmPassword, 'new-password']
              ].map(([label, value, setter, autoComplete], i) => (
                <div key={i} className="space-y-1">
                  <label className="text-[11px] text-parchment-300 font-medium">{label as string}</label>
                  <input
                    type="password"
                    value={value as string}
                    onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                    className={inputClass}
                    autoComplete={autoComplete as string}
                    minLength={i > 0 ? 6 : undefined}
                    placeholder={i > 0 ? t.authPasswordHint : ''}
                    required
                  />
                </div>
              ))}

              {error && (
                <div className="flex items-center gap-2 p-3 bg-rose-950/60 border border-rose-600/40 rounded-xl text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {passwordChanged && (
                <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-600/40 rounded-xl text-xs text-emerald-300">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>{t.authPasswordChanged}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 disabled:opacity-60 text-burgundy-950 font-serif font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{submitting ? t.authPleaseWait : t.authChangePassword}</span>
              </button>
            </form>
          ) : (
          <>
          {/* Mode switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-burgundy-950/80 rounded-xl border border-gold-500/20">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError('');
                }}
                className={`py-2 rounded-lg text-xs font-serif font-bold transition-all cursor-pointer ${
                  mode === m ? 'bg-gold-500 text-burgundy-950' : 'text-parchment-300 hover:text-gold-300'
                }`}
              >
                {m === 'login' ? t.authSignIn : t.authRegister}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister && (
              <div className="space-y-1">
                <label className="text-[11px] text-parchment-300 font-medium">{t.authName}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  autoComplete="name"
                  minLength={2}
                  maxLength={60}
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] text-parchment-300 font-medium">{t.authEmail}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-parchment-300 font-medium">{t.authPassword}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                minLength={isRegister ? 6 : undefined}
                placeholder={isRegister ? t.authPasswordHint : ''}
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-950/60 border border-rose-600/40 rounded-xl text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 disabled:opacity-60 text-burgundy-950 font-serif font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{submitting ? t.authPleaseWait : isRegister ? t.authRegister : t.authSignIn}</span>
            </button>
          </form>

          <p className="text-center text-xs text-parchment-400">
            {isRegister ? t.authHaveAccount : t.authNoAccount}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(isRegister ? 'login' : 'register');
                setError('');
              }}
              className="text-gold-400 hover:text-gold-300 font-semibold underline cursor-pointer"
            >
              {isRegister ? t.authSignIn : t.authRegister}
            </button>
          </p>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
