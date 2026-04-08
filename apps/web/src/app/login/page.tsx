'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { loginSchema, LoginFormData, useTranslate } from '@repo/shared';
import '@/lib/i18n';

export default function LoginPage() {
  const t = useTranslate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log('Login attempt:', data);
    alert(`Logged in as: ${data.email}\nCheck console for logic check.`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Dynamic Background */}
      <div className="bg-gradient" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass-card"
        style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', margin: '0 1rem', zIndex: 1 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: '2.25rem', fontWeight: 700, color: 'white' }}
          >
            {t('auth.welcome')}
          </motion.h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
               {t('auth.login_description')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#cbd5e1', marginLeft: '0.25rem' }}>
              {t('auth.email')}
            </label>
            <input
              {...register('email')}
              placeholder="name@company.com"
              className="input-field"
            />
            {errors.email && (
              <p className="error-text" style={{ marginLeft: '0.25rem' }}>{errors.email.message}</p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#cbd5e1', marginLeft: '0.25rem' }}>
               {t('auth.password')}
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="input-field"
            />
            {errors.password && (
              <p className="error-text" style={{ marginLeft: '0.25rem' }}>{errors.password.message}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="btn-primary"
            style={{ fontSize: '1.125rem', marginTop: '0.5rem' }}
          >
            {t('auth.login')}
          </motion.button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Don't have an account? <span style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 500 }}>Sign up</span>
          </p>
        </div>
      </motion.div>

      {/* Floating Decorative Elements */}
      <div style={{ position: 'absolute', top: '25%', left: '-5rem', width: '16rem', height: '16rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '9999px', filter: 'blur(64px)' }} />
      <div style={{ position: 'absolute', bottom: '25%', right: '-5rem', width: '16rem', height: '16rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '9999px', filter: 'blur(64px)' }} />
    </div>
  );
}
