const fs = require('fs');

function restyleLogin() {
  const file = 'src/app/login/page.tsx';
  let content = fs.readFileSync(file, 'utf8');

  const oldBlock = `<div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F0F2F6]">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/20 mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Sign in to access your intelligence dashboard.
          </p>
        </div>

        {message && (
          <div className={\`p-4 rounded-xl border text-sm font-medium \${message.type === 'error' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}\`}>
            {message.text}
          </div>
        )}

        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-sm space-y-6">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          
          <button
            onClick={() => handleOAuthLogin('github')}
            className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-400 font-medium">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                <Link href="/login" className="text-xs font-bold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-600/20"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        <p className="text-center text-sm font-medium text-slate-600">
          Don't have an account?{" "}
          <Link href={\`/signup?redirectTo=\${redirectTo}\`} className="font-bold text-indigo-600 hover:text-indigo-500">
            Sign Up
          </Link>
        </p>
      </div>
    </div>`;

  const newBlock = `<div className="min-h-[100vh] flex flex-col items-center justify-center p-[20px] bg-paper font-sans">
      <div className="w-full max-w-[400px] bg-card border border-line rounded-[20px] p-[40px_36px] shadow-[0_4px_24px_rgba(18,22,28,0.06)]">
        <div className="font-serif font-bold text-[22px] text-center mb-1 text-ink">
          Nichorr<span className="text-citation">.</span>
        </div>
        <div className="text-center text-[12.5px] text-muted-2 mb-7">
          Evidence-first research for tech YouTubers
        </div>

        <div className="flex bg-paper rounded-[10px] p-1 mb-[26px]">
          <Link href={\`/login?redirectTo=\${redirectTo}\`} className="flex-1 text-center py-[9px] text-[13px] font-semibold rounded-[8px] bg-card text-ink shadow-[0_1px_3px_rgba(18,22,28,0.08)]">
            Sign In
          </Link>
          <Link href={\`/signup?redirectTo=\${redirectTo}\`} className="flex-1 text-center py-[9px] text-[13px] font-semibold rounded-[8px] text-muted hover:text-ink">
            Sign Up
          </Link>
        </div>

        {message && (
          <div className={\`p-4 rounded-xl border text-[13px] font-medium mb-5 \${message.type === 'error' ? 'bg-conflict-bg border-conflict text-conflict' : 'bg-verified-bg border-verified text-verified'}\`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="mb-4">
            <label className="block text-[12.5px] font-semibold text-ink mb-[7px]">Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full font-sans text-[14px] p-[12px_14px] border border-line rounded-[10px] bg-paper text-ink focus:outline-none focus:border-citation focus:ring-[3px] focus:ring-citation-bg transition-shadow"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[12.5px] font-semibold text-ink mb-[7px]">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full font-sans text-[14px] p-[12px_14px] border border-line rounded-[10px] bg-paper text-ink focus:outline-none focus:border-citation focus:ring-[3px] focus:ring-citation-bg transition-shadow"
            />
          </div>

          <div className="text-right -mt-2 mb-4">
            <Link href="/login" className="text-[12px] text-citation hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-white font-semibold text-[14.5px] p-[13px] rounded-[10px] border-none cursor-pointer mt-1.5 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="relative mt-6 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-line" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-card text-muted-2 font-medium">Or</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="flex-1 flex items-center justify-center bg-card border border-line hover:bg-paper text-ink py-2.5 rounded-[10px] text-[13px] font-bold transition-all"
          >
            Google
          </button>
          <button
            onClick={() => handleOAuthLogin('github')}
            className="flex-1 flex items-center justify-center bg-ink hover:bg-ink/90 text-white py-2.5 rounded-[10px] text-[13px] font-bold transition-all"
          >
            GitHub
          </button>
        </div>

        <div className="flex items-center gap-2 justify-center mt-[26px] font-mono text-[10.5px] text-muted-2 tracking-[0.4px]">
          <span className="w-[5px] h-[5px] rounded-full bg-verified"></span>
          TRACED CLAIMS ONLY · ZERO FABRICATED CITATIONS
        </div>
      </div>
    </div>`;

  content = content.replace(oldBlock, newBlock);
  fs.writeFileSync(file, content, 'utf8');
function restyleSignup() {
  const file = 'src/app/signup/page.tsx';
  let content = fs.readFileSync(file, 'utf8');

  const oldBlock = `<div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F0F2F6]">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/20 mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an Account
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Join Nichorr to start building your intelligence engine.
          </p>
        </div>

        {message && (
          <div className={\`p-4 rounded-xl border text-sm font-medium \${message.type === 'error' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}\`}>
            {message.text}
          </div>
        )}

        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-sm space-y-6">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-400 font-medium">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-400"
                />
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className={\`h-full \${getPasswordStrength().color} transition-all duration-300\`} style={{ width: getPasswordStrength().width }} />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <label htmlFor="terms" className="text-xs text-slate-500 font-medium leading-relaxed">
                I agree to the <Link href="#" className="text-indigo-600 hover:underline">Terms of Service</Link> and <Link href="#" className="text-indigo-600 hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-600/20 mt-2"
            >
              {loading ? "Creating account..." : "Sign Up"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        <p className="text-center text-sm font-medium text-slate-600">
          Already have an account?{" "}
          <Link href={\`/login?redirectTo=\${redirectTo}\`} className="font-bold text-indigo-600 hover:text-indigo-500">
            Sign In
          </Link>
        </p>
      </div>
    </div>`;

  const newBlock = `<div className="min-h-[100vh] flex flex-col items-center justify-center p-[20px] bg-paper font-sans">
      <div className="w-full max-w-[400px] bg-card border border-line rounded-[20px] p-[40px_36px] shadow-[0_4px_24px_rgba(18,22,28,0.06)]">
        <div className="font-serif font-bold text-[22px] text-center mb-1 text-ink">
          Nichorr<span className="text-citation">.</span>
        </div>
        <div className="text-center text-[12.5px] text-muted-2 mb-7">
          Evidence-first research for tech YouTubers
        </div>

        <div className="flex bg-paper rounded-[10px] p-1 mb-[26px]">
          <Link href={\`/login?redirectTo=\${redirectTo}\`} className="flex-1 text-center py-[9px] text-[13px] font-semibold rounded-[8px] text-muted hover:text-ink">
            Sign In
          </Link>
          <Link href={\`/signup?redirectTo=\${redirectTo}\`} className="flex-1 text-center py-[9px] text-[13px] font-semibold rounded-[8px] bg-card text-ink shadow-[0_1px_3px_rgba(18,22,28,0.08)]">
            Sign Up
          </Link>
        </div>

        {message && (
          <div className={\`p-4 rounded-xl border text-[13px] font-medium mb-5 \${message.type === 'error' ? 'bg-conflict-bg border-conflict text-conflict' : 'bg-verified-bg border-verified text-verified'}\`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div className="mb-4">
            <label className="block text-[12.5px] font-semibold text-ink mb-[7px]">Full Name</label>
            <input
              type="text"
              required
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full font-sans text-[14px] p-[12px_14px] border border-line rounded-[10px] bg-paper text-ink focus:outline-none focus:border-citation focus:ring-[3px] focus:ring-citation-bg transition-shadow"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[12.5px] font-semibold text-ink mb-[7px]">Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full font-sans text-[14px] p-[12px_14px] border border-line rounded-[10px] bg-paper text-ink focus:outline-none focus:border-citation focus:ring-[3px] focus:ring-citation-bg transition-shadow"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[12.5px] font-semibold text-ink mb-[7px]">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full font-sans text-[14px] p-[12px_14px] border border-line rounded-[10px] bg-paper text-ink focus:outline-none focus:border-citation focus:ring-[3px] focus:ring-citation-bg transition-shadow"
            />
            <div className="h-1.5 w-full bg-line-soft rounded-full mt-2 overflow-hidden">
              <div className={\`h-full \${getPasswordStrength().color} transition-all duration-300\`} style={{ width: getPasswordStrength().width }} />
            </div>
          </div>

          <div className="flex items-start gap-2 pt-2 mb-4">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-citation bg-paper rounded border-line focus:ring-citation-bg"
            />
            <label htmlFor="terms" className="text-xs text-muted font-medium leading-relaxed">
              I agree to the <Link href="#" className="text-citation hover:underline">Terms of Service</Link> and <Link href="#" className="text-citation hover:underline">Privacy Policy</Link>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-white font-semibold text-[14.5px] p-[13px] rounded-[10px] border-none cursor-pointer mt-1.5 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="relative mt-6 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-line" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-card text-muted-2 font-medium">Or</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="flex-1 flex items-center justify-center bg-card border border-line hover:bg-paper text-ink py-2.5 rounded-[10px] text-[13px] font-bold transition-all"
          >
            Google
          </button>
          <button
            onClick={() => handleOAuthLogin('github')}
            className="flex-1 flex items-center justify-center bg-ink hover:bg-ink/90 text-white py-2.5 rounded-[10px] text-[13px] font-bold transition-all"
          >
            GitHub
          </button>
        </div>

        <div className="flex items-center gap-2 justify-center mt-[26px] font-mono text-[10.5px] text-muted-2 tracking-[0.4px]">
          <span className="w-[5px] h-[5px] rounded-full bg-verified"></span>
          TRACED CLAIMS ONLY · ZERO FABRICATED CITATIONS
        </div>
      </div>
    </div>`;

  content = content.replace(oldBlock, newBlock);
  fs.writeFileSync(file, content, 'utf8');
}

restyleSignup();
console.log('Done signup');
