// Categories.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useKeenSlider } from "keen-slider/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "keen-slider/keen-slider.min.css";
import RedTitle from "../common/components/RedTitle";
import { allUmkm } from "../../Services/umkmService";

const UMKMList = () => {
  const [umkmList, setUmkmList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUMKMs = async () => {
      try {
        setLoading(true);
        // Mengambil semua data UMKM dari API
        const data = await allUmkm();
        setUmkmList(data);
        console.log("UMKM List:", data);
      } catch (err) {
        setError("Gagal memuat data UMKM");
        console.error("Error fetching UMKM data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUMKMs();
  }, []);

  const maxRowItem = 7;
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
      perView: 5,
      spacing: 12,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 6, spacing: 16 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 7, spacing: 20 },
      },
    },
  });

  const step = 5;
  const maxIdx = instanceRef.current?.track.details.maxIdx ?? 0;

  const canPrev = currentSlide > 0;
  const canNext = loaded && instanceRef.current && currentSlide < maxIdx;

  if (loading) {
    return (
      <div className="relative">
        <div ref={sliderRef} className="keen-slider pb-1 mt-4">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="keen-slider__slide" style={{ minWidth: "140px" }}>
              <div className="flex flex-col gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="w-[140px] h-[140px] bg-gray-200 rounded-xl"></div>
                    <div className="mt-3 h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <p>{error}</p>
      </div>
    )
  }
  console.log("photos umkm", umkmList.map(umkm => umkm.photo_profile_url));

  return (
    <div className="relative group">
      {/* Navigation Arrows */}
      {loaded && instanceRef.current && (
        <>
          <button
            onClick={() => instanceRef.current?.moveToIdx(Math.max(currentSlide - step, 0))}
            disabled={!canPrev}
            className={`absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-200 p-2.5 rounded-full transition-all duration-200 hover:shadow-xl hover:scale-105 ${!canPrev ? "opacity-30 cursor-not-allowed" : "opacity-0 group-hover:opacity-100"
              }`}
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>

          <button
            onClick={() => instanceRef.current?.moveToIdx(Math.min(currentSlide + step, maxIdx))}
            disabled={!canNext}
            className={`absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-200 p-2.5 rounded-full transition-all duration-200 hover:shadow-xl hover:scale-105 ${!canNext ? "opacity-30 cursor-not-allowed" : "opacity-0 group-hover:opacity-100"
              }`}
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </>
      )}

      {/* Slider Container */}
      <div ref={sliderRef} className="keen-slider pb-1 mt-4">
        {columns.map((pair, idx) => (
          <div key={idx} className="keen-slider__slide" style={{ minWidth: "140px" }}>
            <div className="flex flex-col gap-4">
              {pair.map(
                (umkm, i) =>
                  umkm && (
                    <a key={umkm.id} href={`/umkm/${umkm.id}`} className="group/card block" title={umkm.name}>
                      <div className="flex flex-col items-center p-3 bg-white border border-gray-100 rounded-xl hover:shadow-lg hover:border-red-200 transition-all duration-300 w-[140px] h-[160px] hover:-translate-y-1">
                        {/* Image Container */}
                        <div className="w-full h-[90px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative">
                          <img
                            loading="lazy"
                            src={umkm.photo_profile_url}
                            alt={umkm.name}
                            className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=90&width=140"
                            }}
                          />
                          {/* Subtle overlay on hover */}
                          <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Name */}
                        <span className="text-xs text-gray-700 mt-3 leading-tight text-center w-full group-hover/card:text-red-600 transition-colors duration-200 font-medium line-clamp-2">
                          {umkm.name}
                        </span>
                      </div>
                    </a>
                  ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// const RedTitle = ({ title }) => (
//   <div className="flex items-center space-x-3 mb-2">
//     <div className="w-1 h-6 bg-red-600 rounded-full"></div>
//     <span className="text-red-600 font-bold text-sm tracking-wide uppercase">{title}</span>
//   </div>
// )

const Categories = () => {
  return (
    <div className="px-4 py-8">
      <RedTitle title="UMKM" />
      <div className="flex gap-20 flex-col md:flex-row mb-6">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900">
          Dari Lokal, <span className="text-red-600">Untuk Indonesia</span>
        </h2>
      </div>
      <UMKMList />
    </div>
  )
}
export default Categories;