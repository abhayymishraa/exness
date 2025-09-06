import {
  FaRocket,
  FaShieldAlt,
  FaUserPlus,
  FaSignInAlt,
  FaBolt,
  FaGem,
  FaChartLine,
} from "react-icons/fa";

export default function Landing() {
  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-[#0c1418]">
      <div className="fixed inset-0 bg-[#0c1418]">
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
        <div
          className="absolute top-1/2 right-1/4 w-20 h-20 border border-pink-400/10 rounded-lg backdrop-blur-sm bg-white/5 animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>

        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-[#158BF9]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col">
        <nav className="p-6 animate-fadeIn">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#158BF9] flex items-center justify-center">
                <FaGem className="text-white text-xl" />
              </div>
              <h1 className="text-2xl font-bold text-[#158BF9]">EXNESSS</h1>
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
                className="px-6 py-3 bg-[#158BF9] text-white rounded-xl hover:bg-blue-600 transform transition-all duration-300 font-medium"
              >
                Get Started
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#158BF9] flex items-center justify-center mr-4">
                  <FaRocket className="text-white text-2xl" />
                </div>
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center animate-bounce">
                  <span className="text-white text-xs font-bold">🚀</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="text-[#158BF9]">Welcome to the</span>
                <br />
                <span className="text-white">Future of Trading</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                Experience next-generation trading with cutting-edge technology,
                advanced analytics, and seamless user experience designed for
                modern traders.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
                <a
                  href="/signup"
                  className="group px-8 py-4 bg-[#158BF9] text-white rounded-2xl text-lg font-semibold hover:bg-blue-600 transform transition-all duration-300 flex items-center"
                >
                  <FaUserPlus className="mr-3" />
                  Start Trading Now
                </a>

                <a
                  href="/signin"
                  className="px-8 py-4 bg-[#141D22]/80 backdrop-blur-sm border border-[#263136] text-white rounded-2xl text-lg font-semibold hover:bg-[#141D22] transition-all duration-300 flex items-center"
                >
                  <FaSignInAlt className="mr-3" />
                  Sign In
                </a>
              </div>
            </div>

            <div className="relative h-[600px] lg:h-[700px] overflow-hidden">
              <div className="absolute inset-0 bg-[#158BF9]/5 rounded-3xl backdrop-blur-sm border border-white/5"></div>

              <div className="h-full w-full relative p-8 flex flex-col justify-center items-center">
                <div className="relative mb-8">
                  <div className="w-32 h-32 rounded-full bg-[#158BF9] flex items-center justify-center relative animate-pulse">
                    <FaChartLine className="text-white text-4xl" />

                    <div
                      className="absolute inset-0 animate-spin"
                      style={{ animationDuration: "20s" }}
                    >
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">$</span>
                      </div>
                    </div>
                    <div
                      className="absolute inset-0 animate-spin"
                      style={{
                        animationDuration: "15s",
                        animationDirection: "reverse",
                      }}
                    >
                      <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">₿</span>
                      </div>
                    </div>
                    <div
                      className="absolute inset-0 animate-spin"
                      style={{ animationDuration: "25s" }}
                    >
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">€</span>
                      </div>
                    </div>
                    <div
                      className="absolute inset-0 animate-spin"
                      style={{
                        animationDuration: "18s",
                        animationDirection: "reverse",
                      }}
                    >
                      <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">£</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-[#141D22]/60 backdrop-blur-sm border border-[#263136] rounded-xl p-4 text-center">
                    <div className="text-green-400 text-xl font-bold mb-1">
                      +24.5%
                    </div>
                    <div className="text-gray-400 text-sm">
                      Portfolio Growth
                    </div>
                  </div>
                  <div className="bg-[#141D22]/60 backdrop-blur-sm border border-[#263136] rounded-xl p-4 text-center">
                    <div className="text-blue-400 text-xl font-bold mb-1">
                      $127K
                    </div>
                    <div className="text-gray-400 text-sm">Total Volume</div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <div className="w-16 h-16 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/20 hover:scale-110 transition-transform duration-300">
                    <FaShieldAlt className="text-green-400 text-xl" />
                  </div>
                  <div className="w-16 h-16 rounded-xl bg-[#158BF9]/20 flex items-center justify-center border border-blue-500/20 hover:scale-110 transition-transform duration-300">
                    <FaBolt className="text-[#158BF9] text-xl" />
                  </div>
                  <div className="w-16 h-16 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/20 hover:scale-110 transition-transform duration-300">
                    <FaGem className="text-purple-400 text-xl" />
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Advanced Trading Platform
                  </h3>
                  <p className="text-gray-400">
                    Real-time data • AI-powered insights • Secure transactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Why Choose <span className="text-[#158BF9]">EXNESSS</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover the powerful features that make our platform the
                preferred choice for traders worldwide
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: FaShieldAlt,
                  title: "Secure Trading",
                  description:
                    "Bank-level security with advanced encryption and multi-factor authentication to protect your assets",
                  color: "bg-green-500",
                },
                {
                  icon: FaBolt,
                  title: "Lightning Fast",
                  description:
                    "Execute trades in milliseconds with our optimized trading infrastructure and real-time data feeds",
                  color: "bg-[#158BF9]",
                },
                {
                  icon: FaGem,
                  title: "Premium Features",
                  description:
                    "Advanced analytics, AI insights, and professional trading tools to maximize your trading potential",
                  color: "bg-purple-500",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-[#141D22]/80 backdrop-blur-xl border border-[#263136] rounded-2xl p-6 hover:bg-[#141D22] transition-all duration-300 group hover:scale-105 transform"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
