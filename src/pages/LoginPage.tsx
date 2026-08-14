import { useEffect, useState, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import loginSide from '../assets/login-side.png';
import logoRed from '../assets/tikla-gelsin-logo-red.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, errorMessage, isAuthenticated } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    login(email, password);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  return (
    <div className="w-full flex justify-center">
    <div className="flex flex-col rounded-[20px] p-3 bg-white w-full max-w-[1200px] lg:flex-row lg:gap-8 lg:p-8">
      <div className="flex-1 flex flex-col justify-start gap-5 pt-6 lg:pt-10">
        <Link to="/">
          <img src={logoRed} alt="tıkla gelsin" className="h-10 sm:h-12 w-auto" />
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
              className="border border-gray-300 rounded-full px-6 py-4 outline-none focus:border-[#E91D34] transition-colors"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              className="border border-gray-300 rounded-full px-6 py-4 outline-none focus:border-[#E91D34] transition-colors"
            />

            {errorMessage && (
              <p className="text-[#E91D34] text-sm font-semibold px-2">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className={`rounded-full py-4 font-bold transition-colors ${
                canSubmit
                  ? 'bg-[#E91D34] text-white hover:bg-[#CA192D]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Giriş Yap
            </button>

          </form>
        )}

      </div>
      <div className="flex-1 relative rounded-3xl overflow-hidden bg-gradient-to-b from-gray-500 to-gray-800 min-h-[280px] lg:min-h-[520px]">
        <img src={loginSide} alt="Tıkla Gelsin" className="w-full h-full object-cover" />
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
