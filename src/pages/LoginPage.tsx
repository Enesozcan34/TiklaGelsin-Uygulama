import { useState, type SubmitEvent } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import hero from '../assets/hero.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, errorMessage, isAuthenticated } = useStore();

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    login(email, password);
  };

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  return (
    <div className="bg-white w-full rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-10">
      <div className="flex flex-col justify-center gap-6 max-w-md mx-auto w-full">
        <Link to="/" className="text-2xl sm:text-3xl font-extrabold text-[#E30A17] tracking-tight">
          tıkla gelsin
        </Link>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tıkla Gelsin'e Hoş Geldin</h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Devam etmek için e-posta adresin ve şifrenle giriş yap.
          </p>
        </div>

        {isAuthenticated ? (
          <div className="border border-green-500 text-green-600 rounded-2xl px-4 py-3 text-sm font-semibold">
            Giriş başarılı! Hoş geldin.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta Adresi"
              className="border border-gray-300 rounded-full px-6 py-4 outline-none focus:border-[#E30A17] transition-colors"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              className="border border-gray-300 rounded-full px-6 py-4 outline-none focus:border-[#E30A17] transition-colors"
            />

            {errorMessage && (
              <p className="text-[#E30A17] text-sm font-semibold px-2">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className={`rounded-full py-4 font-bold transition-colors ${
                canSubmit
                  ? 'bg-[#E30A17] text-white hover:bg-[#c80914]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Giriş Yap
            </button>
          </form>
        )}

      </div>
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-gray-500 to-gray-800 min-h-[280px] lg:min-h-0">
        <img src={hero} alt="Tıkla Gelsin" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default LoginPage;
