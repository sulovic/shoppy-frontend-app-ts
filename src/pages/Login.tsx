import { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { handleCustomErrors } from "../services/errorHandler";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { authUser, handleGoogleLogin, handlePasswordLogin } = useAuth();
  const navigate = useNavigate();

  //redirect to home if user is logged
  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  const handleLoginWithGoogle = useGoogleLogin({
    flow: "auth-code",
    redirect_uri: import.meta.env.VITE_APP_BASE_URL,
    onSuccess: (googleCode) => handleGoogleLogin(googleCode),
    onError: (error) => handleCustomErrors(error),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await handlePasswordLogin(email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      handleCustomErrors(error);
    }
  };

  return (
    !authUser && (
      <div className="flex h-dvh w-full items-center justify-center bg-zinc-200 dark:bg-zinc-900">
        <div className="mx-4 flex flex-col items-center justify-center gap-4 rounded-xl bg-white p-8 text-center shadow-2xl md:min-w-96 dark:bg-zinc-600">
          <h3>Sales App Admin</h3>

          <div className="my-2 h-0.5 w-full bg-zinc-400"></div>

          <h5>Prijavite se pomoću Google naloga</h5>
          <div className="flex w-full justify-center">
            <div className="float-end p-2">
              <button onClick={handleLoginWithGoogle} className="flex items-center gap-3 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg shadow-md transition">
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.65 1.22 9.13 3.63l6.82-6.82C35.25 2.42 30.04 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.91 6.14C12.69 13 17.91 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.5 24.5c0-1.57-.15-3.08-.43-4.5H24v9h12.65c-.55 2.82-2.19 5.2-4.65 6.82l7.15 5.56C43.91 38.05 46.5 31.7 46.5 24.5z" />
                  <path fill="#FBBC05" d="M10.47 28.64c-.48-1.43-.74-2.95-.74-4.64s.26-3.21.74-4.64l-7.91-6.14C.92 16.21 0 20.02 0 24c0 3.98.92 7.79 2.56 10.78l7.91-6.14z" />
                  <path fill="#34A853" d="M24 48c6.04 0 11.25-2.02 15.15-5.48l-7.15-5.56c-2 1.29-4.57 2.04-8 2.04-6.09 0-11.31-3.49-13.53-8.54l-7.91 6.14C6.51 42.62 14.62 48 24 48z" />
                </svg>

                <span className="font-medium">Sign in with Google</span>
              </button>
            </div>
          </div>
          <div className="my-2 h-0.5 w-full bg-zinc-400"></div>

          <h5>Ili se prijavite pomoću lozinke</h5>
          <form className="flex w-full flex-col gap-4" onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
            <input type="email" required className="w-full p-2" placeholder="Email" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} value={email} />
            <input type="password" required className="w-full p-2" placeholder="Password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} value={password} />
            <button type="submit" className="button button-sky dark:text-white">
              Prijavi se
            </button>
          </form>
          <a className="cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-400" onClick={() => navigate("/forgot-password")}>
            <h6>Zaboravili ste lozinku?</h6>
          </a>
        </div>
      </div>
    )
  );
};

export default Login;
