import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { Link } from 'react-router-dom';


const BannerSection = ({ products }) => {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
    },
  }, [
    (slider) => {
      let timeout;
      let mouseOver = false;
      function clearNextTimeout() {
        clearTimeout(timeout);
      }
      function nextTimeout() {
        clearTimeout(timeout);
        if (mouseOver) return;
        timeout = setTimeout(() => {
          slider.next();
        }, 4000);
      }
      slider.on("created", () => {
        slider.container.addEventListener("mouseover", () => {
          mouseOver = true;
          clearNextTimeout();
        });
        slider.container.addEventListener("mouseout", () => {
          mouseOver = false;
          nextTimeout();
        });
        nextTimeout();
      });
      slider.on("dragStarted", clearNextTimeout);
      slider.on("animationEnded", nextTimeout);
      slider.on("updated", nextTimeout);
    },
  ]);


  return (
    <div ref={sliderRef} className="keen-slider w-full aspect-[16/9] max-h-[400px] bg-gray-200 rounded-xl">
      {products.map((product) => (
        <Link
          to={`/event/${product.id}`}
          key={product.id}
          className="keen-slider__slide relative cursor-pointer"
        >
          <img
            src={product.photo}
            alt={product.id}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-6 bg-black/50 text-white p-4 rounded-xl">
            <h2 className="text-xl md:text-2xl font-bold">
              {product.id}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default BannerSection;