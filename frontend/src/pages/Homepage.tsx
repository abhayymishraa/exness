import { motion } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";
import {
  FaRocket,
  FaStar,
  FaShieldAlt,
  FaUserPlus,
  FaSignInAlt,
  FaBolt,
  FaGem,
  FaInfinity,
} from "react-icons/fa";

export default function Landing() {
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
        await next({ transform: "translateY(-25px) rotate(-3deg)" });
        await next({ transform: "translateY(5px) rotate(3deg)" });
      }
    },
    config: { duration: 5000 },
  });

  const float3 = useSpring({
    from: { transform: "translateY(0px) rotate(0deg)" },
    to: async (next) => {
      while (true) {
        await next({ transform: "translateY(-15px) rotate(2deg)" });
        await next({ transform: "translateY(10px) rotate(-2deg)" });
      }
    },
    config: { duration: 3500 },
  });

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,197,253,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(147,197,253,0.15)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse"></div>

        {/* Large Floating Geometric Shapes */}
        <animated.div
          style={float1}
          className="absolute top-20 left-10 w-40 h-40 border-2 border-blue-400/20 rounded-3xl backdrop-blur-sm bg-white/5"
        />
        <animated.div
          style={float2}
          className="absolute top-32 right-16 w-32 h-32 border-2 border-purple-400/20 rounded-full backdrop-blur-sm bg-white/5"
        />
        <animated.div
          style={float3}
          className="absolute bottom-40 left-1/4 w-28 h-28 border-2 border-cyan-400/20 rounded-2xl backdrop-blur-sm bg-white/5 transform rotate-45"
        />
        <animated.div
          style={float1}
          className="absolute top-1/2 right-1/4 w-24 h-24 border-2 border-pink-400/20 rounded-full backdrop-blur-sm bg-white/5"
        />

        {/* Large Gradient Orbs */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/25 to-purple-500/25 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/25 to-pink-500/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="p-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <FaGem className="text-white text-xl" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                EXNESSS
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/signin"
                className="px-6 py-2 text-gray-300 hover:text-white transition-colors duration-300 font-medium"
              >
                Sign In
              </a>
              <a
                href="/signup"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 font-medium"
              >
                Get Started
              </a>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex justify-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.5,
                    duration: 1,
                    type: "spring",
                    bounce: 0.5,
                  }}
                  className="relative"
                >
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden shadow-2xl shadow-purple-500/50">
                    <FaRocket className="text-white text-4xl z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full animate-shimmer"></div>
                  </div>
                  {/* Floating icons around main icon */}
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute -top-3 -right-3"
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
                    className="absolute -bottom-3 -left-3"
                  >
                    <FaBolt className="text-cyan-400 text-lg" />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 25,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute top-1/2 -right-6"
                  >
                    <FaInfinity className="text-purple-400 text-sm" />
                  </motion.div>
                </motion.div>
              </div>

              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Welcome to the
                </span>
                <br />
                <span className="text-white">Future of Trading</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Experience next-generation trading with cutting-edge technology,
                advanced analytics, and seamless user experience designed for
                modern traders.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
            >
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-2xl text-lg font-semibold relative overflow-hidden shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative flex items-center">
                  <FaUserPlus className="mr-3" />
                  Start Trading Now
                </span>
              </motion.a>

              <motion.a
                href="/signin"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center"
              >
                <FaSignInAlt className="mr-3" />
                Sign In
              </motion.a>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {[
                {
                  icon: FaShieldAlt,
                  title: "Secure Trading",
                  description:
                    "Bank-level security with advanced encryption and multi-factor authentication",
                },
                {
                  icon: FaBolt,
                  title: "Lightning Fast",
                  description:
                    "Execute trades in milliseconds with our optimized trading infrastructure",
                },
                {
                  icon: FaGem,
                  title: "Premium Features",
                  description:
                    "Advanced analytics, AI insights, and professional trading tools",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="text-2xl text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
