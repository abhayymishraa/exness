export default function Navbar() {
  return (
    <nav className="bg-[#0c1418] border-b border-[#263136] py-3 px-4 sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-[#158BF9] mr-4 lg:mr-8">EXNESSS</h1>
          <div className="hidden md:flex space-x-4 lg:space-x-6">
          </div>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
        </div>
      </div>
    </nav>
  );
}
