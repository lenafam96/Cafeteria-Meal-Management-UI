import React, { useState } from 'react';
import { 
  ChefHat, 
  LogIn
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Components ---

const LoginScreen = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      navigate('/');
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="bg-sky-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ChefHat size={40} className="text-sky-700" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-2">
            Cafeteria Meal<br/>Management
          </h1>
          <p className="text-slate-500 font-medium text-lg">Internal System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Employee ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(false);
                }}
                className={`w-full p-4 rounded-xl border-2 bg-slate-50 text-lg outline-none transition-all ${
                  error && !username 
                    ? 'border-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-slate-200 focus:border-sky-500 focus:bg-white'
                }`}
                placeholder="e.g. 8402"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className={`w-full p-4 rounded-xl border-2 bg-slate-50 text-lg outline-none transition-all ${
                  error && !password 
                    ? 'border-red-500 focus:border-red-500 bg-red-50' 
                    : 'border-slate-200 focus:border-sky-500 focus:bg-white'
                }`}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-xl py-4 rounded-xl shadow-md active:shadow-none active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span>Login</span>
              <LogIn size={24} strokeWidth={2.5} />
            </button>
          </form>
        </div>

        {/* Footer Helper */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm font-medium">
            For internal use only.<br/>
            Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
