import { useNavigate } from "react-router";
import { submitsignup } from "../api/trade";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";
import {
  FaEnvelope,
  FaLock,
  FaUserPlus,
  FaRocket,
  FaStar,
  FaShieldAlt,
} from "react-icons/fa";

export default function Signup() {
  const [error, setError] = useState("");
  const [submitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const float1 = useSpring({
    from: { transform: "translateY(0px) rotate(0deg)" },
    to: async (next) => {
      while (true) {
        await next({ transform: "translateY(-20px) rotate(5deg)" });
        await next({ transform: "translateY(0px) rotate(-5deg)" });
      }
    },
    config: { duration: 4000 },
  });

  const float2 = useSpring({
    from: { transform: "translateY(0px) rotate(0deg)" },
    to: async (next) => {
      while (true) {
        await next({ transform: "translateY(-15px) rotate(-3deg)" });
        await next({ transform: "translateY(5px) rotate(3deg)" });
      }
    },
    config: { duration: 5000 },
  });

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
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const email = formdata.get("mail");
    const pass = formdata.get("pass");
    if (!email || !pass) {
      setIsSubmitted(false);
      return;
    }
    const data = await submitsignup(email as string, pass as string);

    if (data.userId) {
      localStorage.setItem("userID", data.userId);
      navigate("/signin");
      setIsSubmitted(false);
    } else {
      setIsSubmitted(false);
      setError(data.message);
    }
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,197,253,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(147,197,253,0.15)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse"></div>

        <animated.div
          style={float1}
          className="absolute top-20 left-10 w-32 h-32 border-2 border-blue-400/20 rounded-3xl backdrop-blur-sm bg-white/5"
        />
        <animated.div
          style={float2}
          className="absolute top-40 right-20 w-28 h-28 border-2 border-purple-400/20 rounded-full backdrop-blur-sm bg-white/5"
        />
        <animated.div
          style={float1}
          className="absolute bottom-32 left-1/4 w-24 h-24 border-2 border-cyan-400/20 rounded-2xl backdrop-blur-sm bg-white/5 transform rotate-45"
        />

        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-gradient-to-r from-blue-500/25 to-purple-500/25 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-gradient-to-r from-purple-500/25 to-pink-500/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen flex justify-center items-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-md"
        >
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-transparent to-purple-400/10 rounded-3xl"></div>

            <div className="relative p-8 md:p-10">
              <div className="flex flex-col items-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.8,
                    type: "spring",
                    bounce: 0.5,
                  }}
                  className="relative mb-6"
                >
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden shadow-2xl shadow-purple-500/50">
                    <FaUserPlus className="text-white text-3xl z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full animate-shimmer"></div>
                  </div>
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute -top-2 -right-2"
                  >
                    <FaStar className="text-yellow-400 text-lg" />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: -360, scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute -bottom-2 -left-2"
                  >
                    <FaRocket className="text-cyan-400 text-lg" />
                  </motion.div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
                >
                  Create Account
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-gray-300 text-lg"
                >
                  Join EXNESSS today
                </motion.p>
              </div>

              <form onSubmit={handlesubmit}>
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="relative group"
                  >
                    <label className="text-sm text-gray-300 mb-2 block font-medium">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-blue-400 transition-colors">
                        <FaEnvelope />
                      </span>
                      <input
                        placeholder="you@example.com"
                        type="email"
                        name="mail"
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 rounded-xl py-4 pl-12 pr-4 outline-none transition-all duration-300 text-white placeholder:text-gray-400 hover:bg-white/15"
                        autoComplete="email"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-purple-400/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    {error !== "" && (
                      <p className="text-red-400 text-xs mt-2">{error}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="relative group"
                  >
                    <label className="text-sm text-gray-300 mb-2 block font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-purple-400 transition-colors">
                        <FaLock />
                      </span>
                      <input
                        placeholder="Min 6 letters and Max 20 letters"
                        type="password"
                        name="pass"
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 rounded-xl py-4 pl-12 pr-4 outline-none transition-all duration-300 text-white placeholder:text-gray-400 hover:bg-white/15"
                        autoComplete="new-password"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-pink-400/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </motion.div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-500/10 backdrop-blur-sm border border-red-400/30 text-red-300 px-4 py-3 rounded-xl text-sm"
                    >
                      <div className="flex items-center">
                        <FaShieldAlt className="mr-2" />
                        {error}
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                    type="submit"
                    disabled={submitted}
                    className="w-full py-4 px-6 rounded-xl font-semibold text-white relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></span>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    <span className="relative flex items-center justify-center">
                      {submitted ? "Creating Account..." : "Sign Up"}
                    </span>
                  </motion.button>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="text-center pt-4"
                  >
                    <p className="text-gray-400 text-sm">
                      Already have an account?{" "}
                      <a
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 hover:underline"
                        href="/signin"
                      >
                        Sign In
                      </a>
                    </p>
                  </motion.div>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
