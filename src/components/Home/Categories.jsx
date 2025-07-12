// Categories.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useKeenSlider } from "keen-slider/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "keen-slider/keen-slider.min.css";
import RedTitle from "../common/components/RedTitle";

// Dummy data UMKM, lo bisa ganti nanti dengan API
const umkmList = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  nama_umkm: `UMKM ${i + 1}`,
  foto_umkm: `/img/umkm/${i + 1}.jpg`, // pastikan path ini bener
}));

const UMKMList = () => {
  const maxRowItem = 6;
  const row1 = [];
  const row2 = [];

  let i = 0;
  while (i < umkmList.length && row1.length < maxRowItem) {
    row1.push(umkmList[i]);
    i++;
  }
  while (i < umkmList.length && row2.length < maxRowItem) {
    row2.push(umkmList[i]);
    i++;
  }
  let toggle = true;
  while (i < umkmList.length) {
    if (toggle) row1.push(umkmList[i]);
    else row2.push(umkmList[i]);
    toggle = !toggle;
    i++;
  }

  const maxLength = Math.max(row1.length, row2.length);
  const columns = [];
  for (let j = 0; j < maxLength; j++) {
    columns.push([row1[j], row2[j]]);
  }

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    slides: {
      perView: 4,
      spacing: 12,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 5, spacing: 12 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 6, spacing: 16 },
      },
    },
  });

  const step = 5; // Ubah sesuai berapa slide yang mau dilompati
  const maxIdx = instanceRef.current?.track.details.maxIdx ?? 0;

  const canPrev = currentSlide > 0;
  const canNext = loaded && instanceRef.current && currentSlide < maxIdx;

  return (
    <div className="relative">
      {/* Tombol Panah */}
      {loaded && instanceRef.current && (
        <>
          <button
            onClick={() =>
              instanceRef.current?.moveToIdx(
                Math.max(currentSlide - step, 0)
              )
            }
            disabled={!canPrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full transition-all duration-200 ${!canPrev ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() =>
              instanceRef.current?.moveToIdx(
                Math.min(currentSlide + step, maxIdx)
              )
            }
            disabled={!canNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full transition-all duration-200 ${!canNext ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Kontainer Slider */}
      <div ref={sliderRef} className="keen-slider pb-1 mt-4">
        {columns.map((pair, idx) => (
          <div
            key={idx}
            className="keen-slider__slide"
            style={{ minWidth: "120px" }}
          >
            <div className="flex flex-col gap-4">
              {pair.map(
                (umkm, i) =>
                  umkm && (
                    <Link
                      key={umkm.id}
                      to={`/umkm/${umkm.id}`}
                      className="flex flex-col items-center justify-between p-3 bg-white border border-gray-200 rounded-md hover:shadow-md transition text-center h-[160px] w-[160px]"
                      title={umkm.nama_umkm}
                    >
                      <div className="w-full h-[90px] rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                        <img
                          src={umkm.foto_umkm}
                          alt={umkm.nama_umkm}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-700 mt-2 leading-tight w-full">
                        {umkm.nama_umkm}
                      </span>
                    </Link>
                  )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Categories = () => {
  return (
    <div className="px-4 py-12">
      <RedTitle title={"UMKM"} />
      <div className="flex gap-20 flex-col md:flex-row mb-8">
        <h2 className="text-xl md:text-3xl font-semibold ">
          Dari Lokal, Untuk Indonesia
        </h2>
      </div>
      <UMKMList />
    </div>
  );
};

export default Categories;
