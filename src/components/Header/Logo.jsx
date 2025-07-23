import { Link } from "@mui/material";
import icon from "../../assets/icon.png";

const Logo = () => {
  return (
    <div className=" items-center  justify-center gap-4 hidden min-[1300px]:flex">
      <Link href="/">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r bg-amber-50 flex items-center justify-center overflow-hidden">
          <img
            src={icon}
            alt="Pt Potera Nusantara"
            className="w-10 h-10 object-contain"
          />
        </div>
      </Link>
      <h1 className="font-inter font-bold text-2xl ">PUSAT UMKM</h1>
    </div>
  );
};
export default Logo;
  