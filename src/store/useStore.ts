import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  errorMessage: string | null;
  login: (email: string, pass: string) => void;
}

const useStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  errorMessage: null,

  login: (email, pass) => {

    if (email === 'enesozcan@tiklagelsin.com' && pass === 'Enes1234') {
      
      set({ isAuthenticated: true, errorMessage: null });
    } else {

      set({ isAuthenticated: false, errorMessage: 'e-mail veya şifreniz yanlış lütfen tekrar deneyiniz.' });
    }
  },
}));

export default useStore;