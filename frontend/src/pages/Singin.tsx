import { useNavigate } from "react-router-dom";
import { submitsignin } from "../api/trade";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";
import {
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaRocket,
  FaStar,
  FaShieldAlt,
} from "react-icons/fa";
import { useInView } from "react-intersection-observer";

export default function Signin() {
  const [error, setError] = useState("");
  const [submitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const float1 = useSpring({
    from: { transform: "translateY(0px) rotate(0deg)" },
    to: async (next) => {
      while (true) {
        await next({ transform: "translateY(-20px) rotate(5deg)" });
        await next({ transform: "translateY(0px) rotate(-5deg)" });
      }
    },
    config: { duration: 3000 },
  });

  const float2 = useSpring({
    from: { transform: "translateY(0px) rotate(0deg)" },
    to: async (next) => {
      while (true) {
        await next({ transform: "translateY(-15px) rotate(-3deg)" });
        await next({ transform: "translateY(5px) rotate(3deg)" });
      }
    },
    config: { duration: 4000 },
  });

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
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
      setIsLoading(false);
      setIsSubmitted(false);
      return;
    }

    const data = await submitsignin(email as string, pass as string);

    if (data.token) {
      navigate("/trading");
      setIsSubmitted(false);
      setIsLoading(false);
    } else {
      setIsSubmitted(false);
      setIsLoading(false);
      setError(data.message);
    }
  };

  const handleclick = async () => {
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });

    navigate("/signup");
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <animated.div
          style={float1}
          className="absolute top-20 left-10 w-32 h-32 border border-blue-400/30 rounded-3xl backdrop-blur-sm"
        />
        <animated.div
          style={float2}
          className="absolute top-40 right-20 w-24 h-24 border border-cyan-400/30 rounded-full backdrop-blur-sm"
        />
        <animated.div
          style={float1}
          className="absolute bottom-32 left-1/4 w-20 h-20 border border-indigo-400/30 rounded-lg backdrop-blur-sm transform rotate-45"
        />

        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 w-full min-h-screen flex justify-center items-center p-4"
      >
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50, rotateX: 15 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-md"
        >
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-transparent to-cyan-400/10 rounded-3xl"></div>

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
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-500 flex items-center justify-center relative overflow-hidden">
                    <FaSignInAlt className="text-white text-3xl z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full animate-shimmer"></div>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute -top-2 -right-2"
                  >
                    <FaStar className="text-cyan-400 text-sm" />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute -bottom-2 -left-2"
                  >
                    <FaRocket className="text-blue-400 text-sm" />
                  </motion.div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className=" text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-2"
                >
                  Welcome Back
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-gray-300 text-lg"
                >
                  Sign in to continue
                </motion.p>
              </div>

              {/* Form */}
              <form onSubmit={handlesubmit} className="space-y-6">
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
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-blue-400 transition-colors">
                      <FaEnvelope />
                    </div>
                    <input
                      placeholder="you@example.com"
                      type="email"
                      name="mail"
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 rounded-xl py-4 pl-12 pr-4 outline-none transition-all duration-300 text-white placeholder:text-gray-400 hover:bg-white/10"
                      autoComplete="email"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-cyan-400/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
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
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-cyan-400 transition-colors">
                      <FaLock />
                    </div>
                    <input
                      placeholder="Enter your password"
                      type="password"
                      name="pass"
                      className="w-full bg-white/5 backdrop-blur-sm border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 rounded-xl py-4 pl-12 pr-4 outline-none transition-all duration-300 text-white placeholder:text-gray-400 hover:bg-white/10"
                      autoComplete="current-password"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-indigo-400/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 backdrop-blur-sm border border-red-400/20 text-red-300 px-4 py-3 rounded-xl text-sm"
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
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                  type="submit"
                  disabled={submitted || isLoading}
                  className="w-full py-4 px-6 rounded-xl font-semibold text-white relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center">
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Signing In...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <FaSignInAlt className="mr-2" />
                        Sign In
                      </div>
                    )}
                  </span>
                </motion.button>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="text-center pt-4"
                >
                  <p className="text-gray-400 text-sm">
                    Don't have an account?{" "}
                    <a
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 hover:underline"
                      onClick={handleclick}
                      href="/signup"
                    >
                      Sign Up
                    </a>
                  </p>
                </motion.div>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
