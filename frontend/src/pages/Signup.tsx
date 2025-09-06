import { useNavigate } from "react-router";
import { submitsignup } from "../api/trade";
import { useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";

export default function Signup() {
  const [error, setError] = useState("");
  const [submitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedin = localStorage.getItem("userID") !== null;
    console.log("loggedin as ", loggedin);
    if (loggedin) {
      navigate("/signin");
    }

    document.documentElement.style.scrollBehavior = "smooth";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, [navigate]);

  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitted(true);
    setIsLoading(true);
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const email = formdata.get("mail");
    const pass = formdata.get("pass");
    if (!email || !pass) {
      setIsSubmitted(false);
      setIsLoading(false);
      return;
    }
    const data = await submitsignup(email as string, pass as string);

    if (data.userId) {
      localStorage.setItem("userID", data.userId);
      navigate("/signin");
      setIsSubmitted(false);
      setIsLoading(false);
    } else {
      setIsSubmitted(false);
      setIsLoading(false);
      setError(data.message);
    }
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-[#0c1418]">
      <div className="fixed inset-0 bg-gradient-to-br from-[#0c1418] via-[#14202a] to-[#0c1418]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(21,139,249,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(21,139,249,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="absolute top-20 left-10 w-32 h-32 border border-blue-400/10 rounded-full backdrop-blur-sm bg-white/5 animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-28 h-28 border border-purple-400/10 rounded-3xl backdrop-blur-sm bg-white/5 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-24 h-24 border border-cyan-400/10 rounded-2xl backdrop-blur-sm bg-white/5 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen flex justify-center items-center p-4">
        <div className="relative w-full max-w-md">
          <div className="relative bg-[#141D22]/80 backdrop-blur-xl border border-[#263136] rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#158BF9] flex items-center justify-center mx-auto mb-4">
                <FaUserPlus className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-bold text-[#158BF9] mb-2">
                Create Account
              </h1>
              <p className="text-gray-300">Join EXNESSS today</p>
            </div>

            <form onSubmit={handlesubmit} className="px-8 pb-8 space-y-6">
              <div className="relative group">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <FaEnvelope className="text-gray-400 group-focus-within:text-[#158BF9] transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  name="mail"
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 bg-[#0c1418]/50 border border-[#263136] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#158BF9]/50 focus:bg-[#141D22]/50 transition-all duration-300"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <FaLock className="text-gray-400 group-focus-within:text-[#158BF9] transition-colors duration-300" />
                </div>
                <input
                  type="password"
                  name="pass"
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 bg-[#0c1418]/50 border border-[#263136] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#158BF9]/50 focus:bg-[#141D22]/50 transition-all duration-300"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitted}
                className="w-full py-3 bg-[#158BF9] text-white rounded-xl font-semibold hover:bg-blue-600 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  <>
                    <FaUserPlus className="mr-2" />
                    Create Account
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Already have an account?{" "}
                  <a
                    href="/signin"
                    className="text-[#158BF9] hover:text-blue-300 font-medium transition-colors duration-300"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
