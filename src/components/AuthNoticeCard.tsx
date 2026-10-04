import { ShieldCheck } from 'lucide-react';

export default function AuthNoticeCard() {
  return (
    <div className="bg-slate-100/90 border border-slate-200/80 rounded-xl p-4 flex items-start sm:items-center gap-3.5 text-slate-700 shadow-sm">
      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700">
        <ShieldCheck className="w-4 h-4" />
      </div>
      <div className="text-sm leading-relaxed">
        <strong className="text-slate-900 font-semibold mr-1.5">
          Supabase also provides Authentication:
        </strong>
        Supabase can handle login, signup, OTP, OAuth providers, and user sessions. We are keeping this playground focused on the core backend concepts.
      </div>
    </div>
  );
}
