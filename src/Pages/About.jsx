/* eslint-disable react/prop-types */
// import StatsCardExported from "../components/About/StatsCard.jsx";
// import TeamMembers from "../components/About/TeamMembers";
import Services from "../components/common/components/Services.jsx";
import ActiveLastBreadcrumb from "../components/common/components/Link.jsx";
// import i18n from "../components/common/components/LangConfig";
const About = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-start mt-48">
        <div className="md:mx-40">
          <ActiveLastBreadcrumb
            path={`${"Beranda"}/${"Tentang"}`}
          />
        </div>

        <div className="flex justify-center md:justify-between items-center md:mt-10 mx-auto my-24 md:mb-36 ">
          <div className="flex flex-col gap-10 items-center md:items-start justify-center max-w-lg mx-8 md:mx-40">
            <h1 className="text-5xl font-bold font-inter">
              Cerita Kami
            </h1>
            <p className="text-base text-center md:text-start">
              Perjalanan bisnis kami dimulai tahun 2015, Hal ini berawal dari penunjukan oleh PT YTL Jawa Timur pada Fakultas Teknik Universitas Nurul Jadid untuk mengembangkan aplikasi patrol check sheet yang akan digunalakan oleh Pembangkit Listrik Unit 5 dan 6. Sejak tahun 2016 hingga saat ini, produk yang kami kembangkan telah digunakan secara aktif. Keberhasilan ini kemudian menarik minat perusahaan-perusahaan sejenis, yang pada tahun 2017 mendorong kami untuk membentuk badan usaha dengan nama CV. POTER.
            </p>
            <p className="text-base text-center md:text-start">
              Meskipun begitu, dalam beberapa kesempatan, kami masih tetap menggunakan nama yayasan Nurul Jadid dalam kontrak kerja sebagai bentuk pengabdian kepada masyarakat. Pada tahun 2022, sebagai respons terhadap kebijakan beberapa perusahaan multinasional yang mewajibkan badan usaha untuk berbentuk PT., kami memutuskan untuk mendirikan PT baru pada awal tahun 2023 dengan nama PT POTER TEKNIK NUSANTARA.
            </p>
            <p className="text-base text-center md:text-start">
              Dengan pengalaman yang telah kami bangun selama beberapa tahun, kami berkomitmen untuk terus memberikan solusi aplikasi yang inovatif dan berkualitas tinggi kepada pelanggan kami. Kami percaya bahwa layanan kami akan memberikan kontribusi signifikan bagi kemajuan dan kesuksesan perusahaan Anda.
            </p>
          </div>
          <svg
            className="md:flex hidden"
            width="705"
            height="609"
            viewBox="0 0 705 609"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_226_4548)">
              <path
                d="M0 3.99999C0 1.79085 1.79086 0 4 0H705V609H4.00001C1.79087 609 0 607.209 0 605V3.99999Z"
                fill="#EB7EA8"
              />
            </g>
            <defs>
              <clipPath id="clip0_226_4548">
                <path
                  d="M0 3.99999C0 1.79085 1.79086 0 4 0H705V609H4.00001C1.79087 609 0 607.209 0 605V3.99999Z"
                  fill="white"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>

      {/* <div className="flex flex-col items-center justify-center gap-8">
        <StatsCardExported />
      </div> */}

      {/* <div className="flex flex-col items-center justify-center gap-8 my-36 ">
        <TeamMembers />
      </div> */}
      <Services />
    </>
  );
};
export default About;
