import { ShimmerBase } from "../shimmer/Shimmer";

const NavbarShimmer = () => {
  return (
    <div className="w-full h-16 bg-gray-900 flex items-center px-6 gap-4">
      <ShimmerBase className="w-10 h-10 rounded-full" />
      <ShimmerBase className="w-24 h-4" />
    </div>
  );
};

export default NavbarShimmer;
