export default function PersonalDashboard() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-black">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-bl from-purple-600/15 via-blue-600/8 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-tr from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl"></div>

        <div className="absolute top-0 right-0 w-full h-full">
          <div className="absolute top-1/4 right-1/4 w-1 h-96 bg-gradient-to-b from-purple-500 via-blue-500 to-transparent rotate-45 blur-sm"></div>
          <div className="absolute top-1/3 right-1/3 w-0.5 h-80 bg-gradient-to-b from-purple-400 via-blue-400 to-transparent rotate-45 blur-sm"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="text-white font-bold text-xl">Exness</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Home
          </a>
          <a
            href="/trading"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Trading
          </a>
          <a
            href="/signin"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Login
          </a>
        </div>

        <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors">
          DEMO
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center mb-6">
              <span className="text-gray-400 text-sm">
                Trading platform reimagined
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white">Trading</span>
              <br />
              <span className="text-white">Dashboard</span>
            </h1>

            <p className="text-gray-300 text-lg mb-8 max-w-lg">
              Experience next-generation trading with our comprehensive Exness
              platform. Real-time market data, advanced analytics, and intuitive
              portfolio management in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => (window.location.href = "/trading")}
                className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Trading →
              </button>
              <button className="border border-purple-500 text-purple-500 px-8 py-3 rounded-lg font-semibold hover:bg-purple-500 hover:text-white transition-colors">
                ▶ View Demo
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-white font-semibold">Trusted Platform</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 bg-green-500 rounded-sm"
                  ></div>
                ))}
              </div>
              <span className="text-gray-400">Secure trading</span>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">FX</span>
                  </div>
                  <span className="text-white font-semibold">
                    Trading Overview
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">$12,450</div>
                  <div className="text-green-400 text-sm">+2.4% today</div>
                </div>
              </div>

              {/* Trading Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">ETH/USD</span>
                  </div>
                  <div className="text-white font-semibold">1.0875</div>
                  <div className="text-green-400 text-xs">+0.12%</div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">BTC/USD</span>
                  </div>
                  <div className="text-white font-semibold">1.2654</div>
                  <div className="text-red-400 text-xs">-0.08%</div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">SOL/USD</span>
                  </div>
                  <div className="text-white font-semibold">$2,045</div>
                  <div className="text-green-400 text-xs">+0.34%</div>
                </div>
              </div>

              <button
                onClick={() => (window.location.href = "/trading")}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Open Trade
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-purple-500 mb-2">500+</div>
            <div className="text-gray-400">Trading Instruments</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-500 mb-2">24/7</div>
            <div className="text-gray-400">Market Access</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-500 mb-2">0.1s</div>
            <div className="text-gray-400">Execution Speed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-500 mb-2">$1M+</div>
            <div className="text-gray-400">Daily Volume</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-500 mb-2">99.9%</div>
            <div className="text-gray-400">Uptime</div>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-gray-400">Powered by professional tools</p>
        </div>

        <div className="flex justify-center items-center space-x-12 opacity-50">
          <div className="text-gray-500 font-bold text-xl">MT4</div>
          <div className="text-gray-500 font-bold text-xl">MT5</div>
          <div className="text-gray-500 font-bold text-xl">TradingView</div>
          <div className="text-gray-500 font-bold text-xl">WebTerminal</div>
          <div className="text-gray-500 font-bold text-xl">Mobile App</div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Exness Platform Handles
            <br />
            Millions of Trades Daily
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Real-time Market Data */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Real-time Market Data
            </h3>
            <p className="text-gray-300 mb-6">
              Stay ahead with lightning-fast market updates, live charts, and
              instant price feeds from global financial markets.
            </p>

            <div className="bg-black/50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                  <span className="text-white text-sm">EUR/USD Live Chart</span>
                </div>
                <span className="text-green-400 text-sm">1.0875 +0.12%</span>
              </div>

              <div className="h-32 bg-gradient-to-t from-blue-500/20 to-transparent rounded border-b border-blue-500/30 mb-4 relative">
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-r from-blue-500/10 via-blue-400/20 to-blue-500/10"></div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-gray-400">Spread</div>
                  <div className="text-white">0.6 pips</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Volume</div>
                  <div className="text-white">1.2M</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">High</div>
                  <div className="text-white">1.0892</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Low</div>
                  <div className="text-white">1.0843</div>
                </div>
              </div>
            </div>
          </div>
          {/* Performance Analytics */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Performance Analytics
            </h3>
            <p className="text-gray-300 mb-6">
              Track your trading performance with comprehensive analytics and
              detailed reporting tools.
            </p>

            <div className="bg-black/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                  <span className="text-white text-sm">
                    Monthly Performance
                  </span>
                </div>
                <div className="text-green-400 text-sm">
                  Jan Feb Mar Apr May
                </div>
              </div>

              <div className="h-40 relative bg-gradient-to-t from-purple-500/10 to-transparent">
                <div className="absolute inset-0 flex items-end justify-around">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className={`w-2 ${
                          Math.random() > 0.3 ? "bg-purple-500" : "bg-gray-600"
                        }`}
                        style={{ height: `${Math.random() * 80 + 20}px` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Dec</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Trading Instruments */}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <span className="text-gray-400 text-sm">Trading Platform</span>
            <div className="ml-4 w-8 h-4 bg-gray-600 rounded-full flex items-center px-1">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Built with Professional Trading Technology
          </h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6">
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-4 py-2">
            <div className="w-6 h-4 bg-blue-500 rounded-sm"></div>
            <span className="text-white text-sm">MetaTrader 4</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-4 py-2">
            <div className="w-6 h-4 bg-cyan-500 rounded-sm"></div>
            <span className="text-white text-sm">MetaTrader 5</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-4 py-2">
            <div className="w-6 h-4 bg-yellow-500 rounded-sm"></div>
            <span className="text-white text-sm">TradingView</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-4 py-2">
            <div className="w-6 h-4 bg-green-500 rounded-sm"></div>
            <span className="text-white text-sm">WebTerminal</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-4 py-2">
            <div className="w-6 h-4 bg-red-500 rounded-sm"></div>
            <span className="text-white text-sm">Mobile Apps</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-4 py-2">
            <div className="w-6 h-4 bg-purple-500 rounded-sm"></div>
            <span className="text-white text-sm">API Trading</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-4 py-2">
            <div className="w-6 h-4 bg-orange-500 rounded-sm"></div>
            <span className="text-white text-sm">Copy Trading</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-4 py-2">
            <div className="w-6 h-4 bg-gray-700 rounded-sm"></div>
            <span className="text-white text-sm">VPS Hosting</span>
          </div>
        </div>
      </div>

      {/* Why This Project Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose Exness?
          </h2>
          <p className="text-gray-400 max-w-2xl">
            Our Exness platform represents the next generation of online trading
            with cutting-edge technology and user-focused design.
          </p>
        </div>

        <div className="space-y-12">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">01</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Ultra-Fast Execution
              </h3>
              <p className="text-gray-400 max-w-2xl">
                Experience lightning-fast trade execution with our advanced
                technology infrastructure. Orders are processed in milliseconds
                with minimal slippage.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">02</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Comprehensive Market Access
              </h3>
              <p className="text-gray-400 max-w-2xl">
                Trade across multiple asset classes including forex,
                commodities, indices, and cryptocurrencies. Over 500 instruments
                available 24/7.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">03</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Advanced Analytics
              </h3>
              <p className="text-gray-400 max-w-2xl">
                Make informed decisions with our comprehensive analytics suite,
                real-time charts, and professional-grade trading tools powered
                by TradingView.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">04</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Security & Reliability
              </h3>
              <p className="text-gray-400 max-w-2xl">
                Your funds and data are protected with bank-grade security
                measures, regulated operations, and 99.9% uptime guarantee for
                uninterrupted trading.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
