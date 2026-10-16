import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Title from "../components/Title";
import { ShopContext } from "../contex/ShopContext";

function Login() {
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerUser, loginUser } = useContext(ShopContext);
  const navigate = useNavigate();
  const inputClass = "w-full border border-gray-300 px-4 py-3 outline-none transition focus:border-black";

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const form = new FormData(event.currentTarget);
    const name = form.get("name");
    const email = form.get("email");
    const password = form.get("password");
    if (isCreateAccount && password !== form.get("confirmPassword")) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isCreateAccount) await registerUser({ name, email, password });
      else await loginUser({ email, password });
      toast.success(isCreateAccount ? "Account created. You are signed in." : "Welcome back.");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Could not sign in. Make sure the local server is running.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[60vh] items-center justify-center border-t py-12">
      <section className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-500">Welcome to Forever</p>
          <div className="text-2xl">
            <Title title1={isCreateAccount ? "CREATE" : "SIGN"} title2={isCreateAccount ? "ACCOUNT" : "IN"} />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {isCreateAccount ? "Create an account to keep your shopping in one place." : "Sign in to view your account and orders."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isCreateAccount && (
            <input className={inputClass} name="name" type="text" placeholder="Full name" autoComplete="name" required />
          )}
          <input className={inputClass} name="email" type="email" placeholder="Email address" autoComplete="email" required />
          <input className={inputClass} name="password" type="password" placeholder="Password" autoComplete={isCreateAccount ? "new-password" : "current-password"} minLength={8} required />
          {isCreateAccount && (
            <input className={inputClass} name="confirmPassword" type="password" placeholder="Confirm password" autoComplete="new-password" minLength={8} required />
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-xs text-gray-500">Passwords must be at least 8 characters.</span>
            <button
              type="button"
              onClick={() => setIsCreateAccount((current) => !current)}
              className="text-gray-600 underline underline-offset-2 hover:text-black"
            >
              {isCreateAccount ? "Sign in instead" : "Create account"}
            </button>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? "PLEASE WAIT..." : isCreateAccount ? "CREATE ACCOUNT" : "SIGN IN"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-5 text-gray-500">
          Signing in lets you return to your account. You can also <Link to="/Orders" className="underline underline-offset-2">view local orders</Link> on this device.
        </p>
      </section>
    </main>
  );
}

export default Login;
