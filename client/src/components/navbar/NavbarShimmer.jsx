const NavbarShimmer = () => {
  return (
    <div className="w-full h-16 bg-gray-900 flex items-center px-6 gap-4">
      <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
      <div className="w-24 h-4 bg-gray-700 rounded animate-pulse"></div>
    </div>
  );
};

export default NavbarShimmer;
