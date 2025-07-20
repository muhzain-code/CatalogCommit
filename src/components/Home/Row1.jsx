import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { categoryService } from "../../Services/categoryService"
import { eventService } from "../../Services/eventService";
import BannerSection from "../common/components/BannerSection";

const Row1 = () => {
  const [categories, setCategories] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const visibleCategories = categories.slice(0, 10);
  const navigate = useNavigate()


  useEffect(() => {
    const fetchData = async () => {
      try {
        let kategoriData = []
        const cachedRaw = sessionStorage.getItem("cachedCategories")
        const expired = !cachedRaw || (JSON.parse(cachedRaw).expiresAt < Date.now())

        if (!expired) {
          const cached = JSON.parse(cachedRaw)
          kategoriData = cached.data
        } else {
          const response = await categoryService.getCategories()
          kategoriData = response.data.map(({ id, name }) => ({ id, name }))
          sessionStorage.setItem(
            "cachedCategories",
            JSON.stringify({
              data: kategoriData,
              expiresAt: Date.now() + 1000 * 60 * 10, // 10 menit
            })
          )
        }

        const eventRes = await eventService.getEvents()
        const eventData = eventRes.data

        setCategories(kategoriData)
        setEvents(eventData)
      } catch (error) {
        console.error("Gagal fetch:", error.response?.data || error.message)
        setCategories([])
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  console.log("event", events);



  return (
    <div className="flex flex-row">
      {/* Left Sidebar */}
      <div className="text-gray-700 w-64 flex-shrink-0 hidden xl:block">
        <nav className="py-6">
          <ul>
            {loading ? (
              <li className="px-4 py-2 text-sm text-gray-400">Loading...</li>
            ) : categories.length === 0 ? (
              <li className="px-4 py-2 text-sm text-gray-400">Tidak ada kategori</li>
            ) : (
              <>
                {visibleCategories.map((cat) => (
                  <li
                    key={cat.id}
                    className="px-4 py-2 cursor-pointer hover:underline hover:underline-offset-8 ease-in-out duration-300 transform hover:translate-x-4"
                  >
                    <Link to="/category" state={{ categoryId: cat.id }}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
                {categories.length > 10 && (
                  <li
                    className="px-4 py-2 text-blue-600 cursor-pointer"
                    onClick={() => navigate("/category")}
                  >
                    Lihat Semua Kategori
                  </li>
                )}
              </>
            )}
          </ul>
        </nav>
      </div>

      {/* Vertical Line */}
      <div className="border-l border-gray-300 hidden xl:block"></div>

      {/* Main Content */}
      <div className="flex xl:my-10 xl:ml-10 xl:gap-16 items-center jusify-between flex-col-reverse md:flex-row  md:h-96 bg-black text-white w-full">
        <BannerSection products={events} />
      </div>
    </div>
  )
}

export default Row1
