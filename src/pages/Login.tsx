import React, { useState, useEffect } from "react";
import { useGoogleLogin, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { authUser, handleGoogleLogin, handlePasswordLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser]);

  const handleLoginWithGoogle = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (googleCode) => handleGoogleLogin(googleCode),
    onError: () => console.log("Google Auth failed"),
  });

  const handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void = async (e) => {
    e.preventDefault();
    handlePasswordLogin(email, password);
    navigate("/");
  };

  return (
    !authUser && (
      <div className="flex h-dvh w-full items-center justify-center bg-zinc-200 dark:bg-zinc-900">
        <div className="mx-4 flex flex-col items-center justify-center gap-4 rounded-xl bg-white p-8 text-center shadow-2xl md:min-w-96 dark:bg-zinc-600">
          <h3>Sales App Admin</h3>

          <div className="my-2 h-0.5 w-full bg-zinc-400"></div>

          <h5>Prijavite se pomoću Google naloga</h5>
          <div className="flex w-full justify-center">
            <div className="float-end p-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
              <div onClick={() => handleLoginWithGoogle()} style={{ display: "inline-block" }}>
                <GoogleLogin onSuccess={() => {}} onError={() => {}} text="signin_with" shape="pill" theme="outline" />
              </div>
            </div>
          </div>
          <div className="my-2 h-0.5 w-full bg-zinc-400"></div>

          <h5>Ili se prijavite pomoću lozinke</h5>
          <form className="flex w-full flex-col gap-4" onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
            <input type="email" required className="w-full p-2" placeholder="Email" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} value={email} />
            <input type="password" required className="w-full p-2" placeholder="Password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} value={password} />
            <button className="button button-sky dark:text-white">Prijavi se</button>
          </form>
          <a className="cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-400" onClick={() => console.log("Reset lozinke", email)}>
            <h6>Zaboravili ste lozinku?</h6>
          </a>
        </div>
      </div>
    )
  );
};

export default Login;
