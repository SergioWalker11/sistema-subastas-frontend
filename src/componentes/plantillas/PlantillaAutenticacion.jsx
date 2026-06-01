import { Gavel } from 'lucide-react';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-[80vh] grid md:grid-cols-5 items-center">
      <div className="hidden md:flex md:col-span-2 h-full flex-col justify-center items-center bg-gradient-to-br from-blue-700 via-blue-500 to-cyan-400 dark:from-blue-950/60 dark:via-blue-900/40 dark:to-cyan-950/30 rounded-l-2xl p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-16 h-16 rounded-lg bg-white/50 rotate-12 animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 right-16 w-12 h-12 rounded-lg bg-white/40 -rotate-6 animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-20 left-20 w-14 h-14 rounded-lg bg-white/30 rotate-12 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 right-10 w-10 h-10 rounded-full bg-white/50 animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="relative z-10 text-center">
          <div className="mb-6">
            <Gavel className="h-16 w-16 mx-auto text-white drop-shadow-lg" />
          </div>
          <h2 className="text-3xl font-bold text-white drop-shadow-md mb-3">SubastasOnline</h2>
          <p className="text-white/90 text-lg">Descubre tesoros, gana subastas</p>
        </div>
      </div>
      <div className="md:col-span-3 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
