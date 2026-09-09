'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, AlertCircle, HelpCircle, Loader2, X } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  icon?: React.ReactNode;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  icon,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          iconBg: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
          defaultIcon: <AlertCircle className="w-6 h-6" />,
          buttonBg: 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-navy-950 shadow-amber-500/20',
          cardBorder: 'border-amber-500/30',
        };
      case 'primary':
        return {
          iconBg: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400',
          defaultIcon: <HelpCircle className="w-6 h-6" />,
          buttonBg: 'bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 text-navy-950 shadow-cyan-500/20',
          cardBorder: 'border-cyan-500/30',
        };
      case 'danger':
      default:
        return {
          iconBg: 'bg-red-500/20 border-red-500/30 text-red-400',
          defaultIcon: <AlertTriangle className="w-6 h-6" />,
          buttonBg: 'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-red-600/30',
          cardBorder: 'border-red-500/30',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onCancel();
        }
      }}
    >
      <div
        className={`bg-navy-900 border ${styles.cardBorder} rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200`}
      >
        {!isLoading && (
          <button
            onClick={onCancel}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${styles.iconBg}`}
          >
            {icon || styles.defaultIcon}
          </div>
          <div className="pr-6">
            <h3 className="text-xl font-black text-white tracking-tight">{title}</h3>
            <div className="text-slate-300 text-sm mt-1.5 leading-relaxed font-normal">
              {typeof description === 'string' ? (
                <p className="whitespace-pre-line">{description}</p>
              ) : (
                description
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer ${styles.buttonBg}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
