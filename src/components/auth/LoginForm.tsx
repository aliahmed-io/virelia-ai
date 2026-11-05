"use client";

import React, { useState, useActionState } from "react";
import { loginAction, type LoginActionResult } from "@/actions/auth";
import { ShieldCheck, User, Lock, AlertCircle, Loader2, Sparkles } from "lucide-react";

interface LoginFormProps {
  locale: string;
  redirectTo?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ locale, redirectTo }) => {
  const isAr = locale === "ar";
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");

  const [state, formAction, isPending] = useActionState<LoginActionResult | null, FormData>(
    (prevState, formData) => loginAction(locale, prevState, formData),
    null
  );

  const fillAdmin = () => {
    setNationalId("10000000000000");
    setPassword("Admin@1234");
  };

  const fillPatient = () => {
    setNationalId("29901011234567");
    setPassword("Patient@123");
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
      <div className="text-start space-y-1 mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {isAr ? "تسجيل الدخول إلى حسابك" : "Sign In to Your Account"}
        </h2>
        <p className="text-xs text-slate-500">
          {isAr
            ? "أدخل الرقم القومي وكلمة المرور للوصول إلى كارت العائلة"
            : "Enter your National ID and Password to manage your card"}
        </p>
      </div>

      {state?.error && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 border border-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}

        {/* National ID Input */}
        <div className="text-start">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {isAr ? "الرقم القومي (14 رقماً)" : "National ID (14 digits)"}
          </label>
          <div className="relative">
            <input
              id="nationalId"
              type="text"
              name="nationalId"
              required
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder="29901011234567"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 ps-11 pe-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-brand-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20 font-mono"
            />
            <User className="absolute start-4 top-3.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Password Input */}
        <div className="text-start">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {isAr ? "كلمة المرور" : "Password"}
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 ps-11 pe-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-brand-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-500/20"
            />
            <Lock className="absolute start-4 top-3.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-teal-600/25 transition-all hover:bg-brand-teal-700 active:scale-98 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{isAr ? "جاري التحقق..." : "Signing in..."}</span>
              </>
            ) : (
              <span>{isAr ? "تسجيل الدخول" : "Sign In"}</span>
            )}
          </button>
        </div>
      </form>

      {/* Quick Demo Access Pills */}
      <div className="mt-8 border-t border-slate-100 pt-6 text-start">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-3">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>{isAr ? "بيانات الدخول التجريبية (نقرة واحدة للتعبئة):" : "Demo Accounts (1-Click Fill):"}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={fillPatient}
            className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-2.5 text-start hover:bg-emerald-100/70 transition-colors"
          >
            <span className="block text-[11px] font-bold text-emerald-900">
              {isAr ? "حساب مريض + عائلة" : "Patient + Family"}
            </span>
            <span className="block text-[10px] text-emerald-700 font-mono">Patient@123</span>
          </button>

          <button
            type="button"
            onClick={fillAdmin}
            className="rounded-xl border border-brand-teal-200 bg-brand-teal-50/60 p-2.5 text-start hover:bg-brand-teal-100/70 transition-colors"
          >
            <span className="block text-[11px] font-bold text-brand-teal-900">
              {isAr ? "حساب مدير النظام" : "Admin Account"}
            </span>
            <span className="block text-[10px] text-brand-teal-700 font-mono">Admin@1234</span>
          </button>
        </div>
      </div>
    </div>
  );
};
