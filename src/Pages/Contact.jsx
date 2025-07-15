import ActiveLastBreadcrumb from "../components/common/components/Link";
import i18n from "../components/common/components/LangConfig";

const Contact = () => {
  return (
    <div className="flex flex-col mx-4 xl:ml-36 mt-48 gap-20">
      <ActiveLastBreadcrumb
        path={`${i18n.t("home")}/${i18n.t("footer.Contact")}`}
      />
      <div className="flex flex-col lg:flex-row gap-12 mx-auto w-full max-w-7xl">
        {/* Kolom 1: Telepon */}
        <div className="shadow w-full flex-1 flex flex-col gap-10 py-16 px-12 rounded-2xl bg-white min-h-[340px]">
          <div className="flex flex-row gap-6 items-center mb-4">
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="56" height="56" rx="28" fill="#DB4444" />
              <path
                d="M25.276 20L20.24 14.47C19.693 13.885 18.646 13.89 18.1 14.442L14.428 18.052C13.262 19.221 12.876 21.063 13.64 22.522C18.3506 32.94 25.1867 39.6291 33.329 43.659C34.786 44.422 36.626 44.038 37.792 42.87L41.522 39.136C42.072 38.587 42.073 37.538 41.526 36.991L36.036 31.397C35.462 30.879 34.57 30.944 34 31.516L32.085 33.433C31.9856 33.5338 31.8506 33.5992 31.7101 33.6154C31.5695 33.6317 31.4261 33.5973 31.305 33.519C28.19 31.662 25.543 29.012 23.687 25.899C23.6097 25.7794 23.5753 25.6359 23.5916 25.4953C23.6079 25.3548 23.6733 25.2198 23.774 25.12L25.686 23.208C26.258 22.635 26.323 21.743 25.746 21.168V21.168Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xl font-semibold">
              HUBUNGI KAMI
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-lg">Kami tersedia dalam 24/7</p>
            <p className="text-lg">7 hari dalam seminggu.</p>
            <p className="text-lg font-bold">
              +62 8016 111 12222
            </p>
          </div>
        </div>
        {/* Kolom 2: Email */}
        <div className="shadow w-full flex-1 flex flex-col gap-10 py-16 px-12 rounded-2xl bg-white min-h-[340px]">
          <div className="flex flex-row gap-6 items-center mb-4">
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="56" height="56" rx="28" fill="#DB4444" />
              <path
                d="M14 18L28 28L42 18M14 38H42V18H14V38Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xl font-semibold">
              TULIS PESAN ANDA KEPADA KAMI
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-lg">Silahkan tulis pesan anda kepada email kami di bawah ini:</p>
            <p className="text-lg font-bold">
              email : poter@example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;
