import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { categoryService } from "../../Services/categoryService"
// import { ITEMS } from "../common/functions/items"
// import apple from "./apple.png"
// import i18n from "../common/components/LangConfig";
import BannerSection from "../common/components/BannerSection";

const Row1 = () => {
  // const dealItem = ITEMS.find(
  //   (item) => item.title === i18n.t("itemsArray.17.title")
  // );

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [showAll, setShowAll] = useState(false);
  const visibleCategories = showAll ? categories : categories.slice(0, 10);

  // const dealItem = ITEMS.find((item) => item.title === "Apple Watch") // fallback title
  const events = {
    data: [
      { id: 6, photo: "https://images.unsplash.com/photo-1578426126743-3f553c0baea1?w=600&q=80" },
      { id: 2, photo: " https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?w=600&q=80" },
      { id: 5, photo: " https://seputarumkm.com/wp-content/uploads/2023/07/664xauto-tips-memenangkan-kompetisi-di-flash-sale-1602158-c810e9193ba3192e83bac36a4a2ad163.jpg " },
      { id: 1, photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjduLGjBBcfbB041z-SU907Pb4duWrkCURBQ&s" },
      { id: 3, photo: " https://listrikkita.com/files/article/H62B7-saatnya-agusus-merdeka-gratis-ongkir-ke-seluruh-nusantara.jpg " },
      { id: 4, photo: "https://asset-2.tstatic.net/wartakota/foto/bank/images/Ilustrasi-Diskon-Akhir-Tahun.jpg " }
    ]
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cachedRaw = sessionStorage.getItem("cachedCategories")
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw)
          const expired = !cached.expiresAt || cached.expiresAt < Date.now()

          if (!expired) {
            setCategories(cached.data)
            setLoading(false)
            return
          } else {
            sessionStorage.removeItem("cachedCategories")
          }
        }

        const response = await categoryService.getCategories()
        const kategoriData = response.data.map(({ id, name }) => ({ id, name }))
        sessionStorage.setItem(
          "cachedCategories",
          JSON.stringify({
            data: kategoriData,
            expiresAt: Date.now() + 1000 * 60 * 10, // 10 menit
          })
        )
        setCategories(kategoriData)
      } catch (error) {
        console.error("Gagal fetch kategori:", error.message)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])
  console.log("event", events.data);



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
                    <Link to={`/category/${cat.id}`}>{cat.name}</Link>
                  </li>
                ))}
                {categories.length > 10 && (
                  <li
                    className="px-4 py-2 text-blue-600 cursor-pointer"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? "Tampilkan Lebih Sedikit" : "Lihat Semua Kategori"}
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
          <BannerSection products={events.data} />
      </div>
    </div>
  )
}

export default Row1
