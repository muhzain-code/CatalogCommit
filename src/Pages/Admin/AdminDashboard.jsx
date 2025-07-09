import { ShoppingBag, Tag, Building2, FolderOpen, TrendingUp, Activity, Megaphone } from "lucide-react"

const AdminDashboard = () => {
  const stats = [
    {
      name: "Total Produk",
      value: "1,234",
      icon: ShoppingBag,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      change: "+12%",
      changeType: "increase",
    },
    {
      name: "Total Brand",
      value: "56",
      icon: Tag,
      color: "from-green-500 to-green-600",
      bgColor: "bg-[#f0fdf4]",
      textColor: "text-green-600",
      change: "+8%",
      changeType: "increase",
    },
    {
      name: "Total UMKM",
      value: "89",
      icon: Building2,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      change: "+15%",
      changeType: "increase",
    },
    {
      name: "Total Kategori",
      value: "23",
      icon: FolderOpen,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      change: "+5%",
      changeType: "increase",
    },
  ]

  const recentActivities = [
    { action: "Produk baru ditambahkan", item: "Kopi Arabica Premium", time: "2 menit lalu", type: "product" },
    { action: "Brand diperbarui", item: "Batik Heritage", time: "15 menit lalu", type: "brand" },
    { action: "UMKM baru terdaftar", item: "CV. Sumber Rejeki", time: "1 jam lalu", type: "umkm" },
    { action: "Kategori ditambahkan", item: "Elektronik", time: "2 jam lalu", type: "category" },
  ]

  const quickActions = [
    { name: "Tambah Produk", icon: ShoppingBag, color: "bg-blue-500", link: "/admin/products" },
    { name: "Tambah Brand", icon: Tag, color: "bg-[#22c55e]", link: "/admin/brands" },
    { name: "Tambah UMKM", icon: Building2, color: "bg-purple-500", link: "/admin/umkm" },
    { name: "Tambah Kategori", icon: FolderOpen, color: "bg-orange-500", link: "/admin/categories" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Selamat Datang, Admin!</h2>
            <p className="text-blue-100 text-lg">Kelola sistem dengan mudah dan efisien</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Activity className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="admin-stats-card admin-card-hover rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">{stat.change}</span>
                    <span className="text-sm text-gray-500 ml-1">dari bulan lalu</span>
                  </div>
                </div>
                <div className={`${stat.bgColor} rounded-xl p-4`}>
                  <Icon className={`w-8 h-8 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Aksi Cepat</h3>
            <div className="space-y-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <a
                    key={action.name}
                    href={action.link}
                    className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                  >
                    <div className={`${action.color} rounded-lg p-3 mr-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">{action.name}</span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Aktivitas Terbaru</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}: <span className="text-blue-600">{activity.item}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center mb-4">
            <ShoppingBag className="w-8 h-8 text-blue-600 mr-3" />
            <h4 className="font-semibold text-blue-900">Manajemen Produk</h4>
          </div>
          <p className="text-sm text-blue-700 leading-relaxed">
            Kelola produk UMKM dengan lengkap termasuk kategori, brand, harga, dan informasi detail lainnya.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center mb-4">
            <Building2 className="w-8 h-8 text-green-600 mr-3" />
            <h4 className="font-semibold text-green-900">Manajemen UMKM</h4>
          </div>
          <p className="text-sm text-green-700 leading-relaxed">
            Kelola data UMKM dan brand yang terdaftar dalam sistem dengan mudah dan terorganisir.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center mb-4">
            <Megaphone className="w-8 h-8 text-purple-600 mr-3" />
            <h4 className="font-semibold text-purple-900">Berita & Promo</h4>
          </div>
          <p className="text-sm text-purple-700 leading-relaxed">
            Kelola berita fisik dan promosi untuk meningkatkan engagement dan penjualan produk UMKM.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
