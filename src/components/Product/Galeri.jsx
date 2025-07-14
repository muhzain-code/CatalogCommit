import { useState, useEffect } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

const GaleriProduct = ({ gallery }) => {
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
    });

    // Fallback jika tidak ada gambar
    if (gallery.length === 0) {
        return (
            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded-xl min-h-[300px]">
                <div className="text-gray-400">No images available</div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[400px]">
            {/* Skeleton loader sebelum slider siap */}
            {!loaded && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-xl" />
            )}

            {/* Slider container */}
            <div ref={sliderRef} className="keen-slider rounded-xl h-full">
                {gallery.map((file_path, index) => (
                    <div key={index} className="keen-slider__slide h-full">
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
                            <img
                                src={file_path}
                                alt={`Product view ${index + 1}`}
                                className="w-full h-full object-cover rounded-xl"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.parentElement.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-gray-200 rounded-xl">
                    <span class="text-gray-500">Image not available</span>
                  </div>
                `;
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Indikator dots (hanya jika ada >1 gambar) */}
            {gallery.length > 1 && loaded && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {[...Array(gallery.length).keys()].map((idx) => (
                        <button
                            key={idx}
                            onClick={() => instanceRef.current?.moveToIdx(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === idx ? 'bg-white scale-125' : 'bg-white/50'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default GaleriProduct;