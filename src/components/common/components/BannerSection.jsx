import { useKeenSlider } from "keen-slider/react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import "keen-slider/keen-slider.min.css"
import Loading from "./Loading"

const BannerSection = ({ products, loading }) => {
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 1,
      },
    },
    [
      (slider) => {
        let timeout
        let mouseOver = false

        const clearNextTimeout = () => {
          clearTimeout(timeout)
        }

        const nextTimeout = () => {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 4000)
        }

        const handleMouseOver = () => {
          mouseOver = true
          clearNextTimeout()
        }

        const handleMouseOut = () => {
          mouseOver = false
          nextTimeout()
        }

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", handleMouseOver)
          slider.container.addEventListener("mouseout", handleMouseOut)
          nextTimeout()
        })

        slider.on("dragStarted", clearNextTimeout)
        slider.on("animationEnded", nextTimeout)
        slider.on("updated", nextTimeout)

        // cleanup listeners
        slider.on("destroyed", () => {
          slider.container.removeEventListener("mouseover", handleMouseOver)
          slider.container.removeEventListener("mouseout", handleMouseOut)
        })
      },
    ]
  )

  // const handleImgError = useCallback((e) => {
  //   e.target.src = "/placeholder.jpg" // fallback path
  // }, [])
   if (loading) {
    return (
      <div className="w-full aspect-[16/9] max-h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!products || products.length === 0) return null;

  return (
    <div
      ref={sliderRef}
      key={products.length}
      className="keen-slider w-full aspect-[16/9] max-h-[400px] bg-gray-200 rounded-xl overflow-hidden"
    >
      {products.map((product) => (
        <Link
          to={`/event/${product.id}`}
          key={product.id}
          className="keen-slider__slide relative cursor-pointer"
        >
          {!product.photo ? (
            <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white text-xl font-bold">
              {product.name || "No Image"}
            </div>
          ) : (
            <img
              src={product.photo}
              alt={product.name || "Product"}
              onError={(e) => {
                e.target.onerror = null // cegah infinite loop
                e.target.style.display = "none"
                e.target.parentNode.innerHTML = `<div class='w-full h-full bg-gray-400 flex items-center justify-center text-white text-xl font-bold'>${product.name || "No Image"}</div>`
              }}
              className="w-full h-full object-cover"
            />
          )}

          {/* <div className="absolute bottom-6 left-6 bg-black/50 text-white p-4 rounded-xl"> */}
            {/* <h2 className="text-xl md:text-2xl font-bold">
              {product.name || "Tanpa Nama"}
            </h2> */}
          {/* </div> */}
        </Link>
      ))}
    </div>
  )
}

BannerSection.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      photo: PropTypes.string,
      name: PropTypes.string,
    })
  ).isRequired,
}

export default BannerSection
