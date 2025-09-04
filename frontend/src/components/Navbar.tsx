export default function Navbar() {
  return (
    <nav className="bg-[#0c1418] border-b border-[#263136] py-3 px-4 sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-[#158BF9] mr-4 lg:mr-8">EXNESSS</h1>
          <div className="hidden md:flex space-x-4 lg:space-x-6">
            <a href="/" className="text-white hover:text-[#158BF9] transition">Home</a>
            <a href="/trading" className="text-[#158BF9] font-medium">Trading</a>
            <a href="/markets" className="text-white/80 hover:text-[#158BF9] transition">Markets</a>
            <a href="/wallet" className="text-white/80 hover:text-[#158BF9] transition">Wallet</a>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          <button className="text-white/80 hover:text-white p-1.5 rounded-full bg-[#1c2a31] hover:bg-[#263136] transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="bg-[#1c2a31] text-white px-2 py-1.5 rounded-md border border-[#263136] flex items-center">
            <span className="text-xs text-green-400 mr-1">•</span>
            <span className="text-xs md:text-sm whitespace-nowrap">1,250.00 USD</span>
          </div>
          <button className="bg-[#158BF9] hover:bg-[#1070d8] text-white px-2 md:px-4 py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap">
            Deposit
          </button>
        </div>
      </div>
    </nav>
  );
}
