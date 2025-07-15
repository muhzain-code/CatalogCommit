import React, { useState } from "react";
import logo from "../assets/logopos.png";

// Data dummy tracking
const dummyTrackingData = [
  {
    time: "14:01",
    date: "30 Mei 2019",
    status: "DIANTAR KE [DANI] | 30-05-2019 14:01 [KRAKSAAN]",
    active: true,
  },
  {
    time: "10:05",
    date: "30 Mei 2019",
    status: "BERSAMA KURIR PENGANTAR [KRAKSAAN]",
  },
  {
    time: "01:51",
    date: "29 Mei 2019",
    status: "DITERIMA DI GUDANG [KRAKSAAN, KAB. PROBOLINGGO]",
  },
  {
    time: "17:25",
    date: "28 Mei 2019",
    status: "DITERIMA DI GATEWAY ASAL [PROBOLINGGO]",
  },
  {
    time: "10:30",
    date: "28 Mei 2019",
    status: "DIPROSES DI SORTIR CENTER [PROBOLINGGO]",
  },
  {
    time: "06:08",
    date: "28 Mei 2019",
    status: "DITERIMA DI SORTIR CENTER [PROBOLINGGO]",
  },
  {
    time: "02:28",
    date: "28 Mei 2019",
    status: "KIRIMAN DITERIMA PETUGAS KANTOR POS COUNTER DI [PROBOLINGGO]",
  },
];

const orderData = {
  kodePesanan: "7878789zxadsxa",
  tanggalPengiriman: "28 Mei 2019, 02:28",
  penerima: "Dani",
  tujuan: "Kraksaan, Probolinggo, Jawa Timur",
  pengiriman: "Kantor Pos",
};

const CekResi = () => {
  const [resi, setResi] = useState("");
  const [submittedResi, setSubmittedResi] = useState("");
  const [trackingData, setTrackingData] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!resi.trim()) {
      setError("Nomor resi harus diisi.");
      setTrackingData([]);
      setSubmittedResi("");
      return;
    }
    if (resi === orderData.kodePesanan) {
      setTrackingData(dummyTrackingData);
      setSubmittedResi(resi);
      setError("");
    } else {
      setTrackingData([]);
      setSubmittedResi(resi);
      setError("Nomor resi tidak ditemukan.");
    }
  };

  const isResiValid = submittedResi && trackingData.length > 0;
  const mainWrapperClass =
    "min-h-screen bg-[#f6f6f6] flex items-center justify-center py-10 px-2" +
    (isResiValid ? " mt-28" : "");

  return (
    <div className={mainWrapperClass}>
      <div className="bg-white border rounded-2xl max-w-5xl w-full flex flex-col shadow-xl">
        {/* Kiri: Form input & detail pesanan */}
        <div className="border-b md:border-b-0 p-8 flex flex-col mt-5">
          <form onSubmit={handleSubmit} className="mb-6">
            <label className="block font-semibold text-[17px] mb-2">
              Cek Nomor Resi
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Masukkan nomor resi"
                value={resi}
                onChange={(e) => setResi(e.target.value)}
                className="border rounded-xl px-4 py-2 text-[15px] flex-1 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-700 transition text-white px-4 py-2 rounded-xl font-semibold text-[15px]"
              >
                Cek
              </button>
            </div>
            {error && (
              <div className="text-red-500 mt-2 text-sm">{error}</div>
            )}
          </form>
          {/* Detail pesanan dua kolom */}
          {isResiValid && (
            <div className="mb-4">
              <h2 className="text-[18px] font-semibold mb-4">Detail Pesanan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {/* Kolom 1 */}
                <div>
                  <div className="mb-2">
                    <div className="text-[#a2a2a2] text-[14px]">Kode Pesanan</div>
                    <div className="font-normal text-[15px] text-black">{submittedResi}</div>
                  </div>
                  <div className="mb-2">
                    <div className="text-[#a2a2a2] text-[14px]">Tanggal Pengiriman</div>
                    <div className="font-normal text-[15px] text-black">{orderData.tanggalPengiriman}</div>
                  </div>
                </div>
                {/* Kolom 2 */}
                <div>
                  <div className="mb-2">
                    <div className="text-[#a2a2a2] text-[14px]">Penerima</div>
                    <div className="font-normal text-[15px] text-black">{orderData.penerima}</div>
                  </div>
                  <div className="mb-2">
                    <div className="text-[#a2a2a2] text-[14px]">Dikirim Ke</div>
                    <div className="text-[15px] font-semibold text-black">{orderData.tujuan}</div>
                  </div>
                  <div>
                    <div className="text-[#a2a2a2] text-[14px]">Pengiriman</div>
                    <div className="flex items-center mt-1">
                      <span className="text-[15px] mr-2 font-normal">{orderData.pengiriman}</span>
                      {/* <img src={logo} alt="Logo" className="h-8" /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Kanan: Timeline tracking */}
        <div className="p-8 pt-7 pb-9 bg-[#fafbfc] rounded-r-2xl">
          <div className="flex flex-col items-center mb-4">
            <img src={logo} alt="logo" className="h-20 mb-2" style={{ objectFit: "contain" }} />
          </div>
          {/* Belum submit */}
          {!submittedResi && (
            <div className="w-full text-center text-[#888] mt-12 text-[16px]">
              Silakan masukkan nomor resi untuk melacak status pengiriman Anda.
            </div>
          )}
          {/* Submit dan ada tracking, tampilkan status & timeline */}
          {isResiValid && (
            <>
              <div className="w-full border-t-[3px] border-b-[3px] border-[#ededed] mb-0 flex flex-col">
                <div className="bg-[#c62828] text-white text-xs px-4 py-2 text-center font-semibold tracking-wide">
                  STATUS TERBARU :{" "}
                  <span className="uppercase">
                    {trackingData[0].status}
                  </span>
                </div>
              </div>
              <div className="pt-5">
                <h3 className="font-semibold text-[18px] mb-4 text-[#c62828]">
                  Lacak Pesanan Anda
                </h3>
                <div className="relative">
                  {/* Garis timeline */}
                  <div className="absolute left-[72px] top-1.5 h-[calc(100%-0.75rem)] w-[2px] bg-red-400 z-0"></div>
                  {/* Timeline */}
                  <div>
                    {trackingData.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start mb-2 min-h-[52px] relative"
                      >
                        {/* Titik bulat */}
                        <div className="flex flex-col items-center z-10 relative">
                          <div
                            className={`w-3 h-3 rounded-full border-2 shadow ${
                              idx === 0
                                ? "bg-red-500 border-red-500"
                                : "bg-white border-red-400"
                            }`}
                            style={{ marginLeft: "55px" }}
                          ></div>
                        </div>
                        {/* Jam & tanggal */}
                        <div className="w-[80px] pl-6 flex flex-col items-end pr-2">
                          <span className="font-medium text-[15px] text-[#c62828]">
                            {item.time}
                          </span>
                          <span className="text-[#888] text-xs">{item.date}</span>
                        </div>
                        {/* Status */}
                        <div className={`flex-1 text-[15px] pl-3 ${idx === 0 ? "text-red-600 font-semibold" : "text-[#444]"}`}>
                          {item.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Submit tapi resi tidak valid */}
          {submittedResi && trackingData.length === 0 && (
            <div className="text-center text-[#ff5656] font-semibold text-[15px] mt-8">
              {error ? error : "Data tracking tidak tersedia."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CekResi;
