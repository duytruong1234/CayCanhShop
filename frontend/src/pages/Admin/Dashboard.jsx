import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    FaLeaf, FaShoppingBag, FaUsers, FaBoxes, FaMoneyBillWave, FaClipboardList
} from 'react-icons/fa'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import api from '../../services/api'
import './Dashboard.css'

// Màu sắc cho biểu đồ tròn
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminDashboard = () => {
    const [summary, setSummary] = useState({
        revenue: 0,
        total_orders: 0,
        pending_orders: 0,
        total_customers: 0
    })
    const [revenueData, setRevenueData] = useState([])
    const [statusData, setStatusData] = useState([])
    const [topProducts, setTopProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        try {
            const [resSummary, resRevenue, resStatus, resTop] = await Promise.all([
                api.get('/admin/thong-ke/tong-quan'),
                api.get('/admin/thong-ke/doanh-thu'),
                api.get('/admin/thong-ke/trang-thai-don-hang'),
                api.get('/admin/thong-ke/top-san-pham')
            ])

            setSummary(resSummary.data)
            setRevenueData(resRevenue.data)
            setStatusData(resStatus.data)
            setTopProducts(resTop.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            setLoading(false)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
    }

    if (loading) {
        return <div className="loading">Đang tải dữ liệu thống kê...</div>
    }

    return (
        <div className="dashboard-container p-6 animate-fade-in">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">📊 Dashboard Thống Kê</h1>

            {/* 1. Thẻ tóm tắt */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 flex items-center">
                    <div className="p-4 bg-green-100 rounded-full text-green-600 mr-4">
                        <FaMoneyBillWave size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Doanh thu</p>
                        <h3 className="text-2xl font-bold text-gray-800">{formatPrice(summary.revenue)}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 flex items-center">
                    <div className="p-4 bg-blue-100 rounded-full text-blue-600 mr-4">
                        <FaShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Tổng đơn hàng</p>
                        <h3 className="text-2xl font-bold text-gray-800">{summary.total_orders}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500 flex items-center">
                    <div className="p-4 bg-yellow-100 rounded-full text-yellow-600 mr-4">
                        <FaClipboardList size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Chờ xử lý</p>
                        <h3 className="text-2xl font-bold text-gray-800">{summary.pending_orders}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 flex items-center">
                    <div className="p-4 bg-purple-100 rounded-full text-purple-600 mr-4">
                        <FaUsers size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Khách hàng</p>
                        <h3 className="text-2xl font-bold text-gray-800">{summary.total_customers}</h3>
                    </div>
                </div>
            </div>

            {/* 2. Biểu đồ doanh thu */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold mb-6 text-gray-700">Biểu đồ doanh thu (7 ngày qua)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatPrice(value)} />
                                <Legend />
                                <Bar dataKey="revenue" name="Doanh thu" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Biểu đồ tròn trạng thái đơn hàng */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold mb-6 text-gray-700">Trạng thái đơn hàng</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 4. Top sản phẩm & Truy cập nhanh */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top sản phẩm */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold mb-6 text-gray-700">Top 5 Sản phẩm bán chạy</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="sold" name="Đã bán" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Truy cập nhanh */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold mb-4 text-gray-700">Truy cập nhanh</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/admin/cay-canh" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 text-green-700 font-medium flex items-center gap-2">
                            <FaLeaf /> Quản lý Cây cảnh
                        </Link>
                        <Link to="/admin/don-hang" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 text-blue-700 font-medium flex items-center gap-2">
                            <FaShoppingBag /> Quản lý Đơn hàng
                        </Link>
                        <Link to="/admin/khach-hang" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 text-purple-700 font-medium flex items-center gap-2">
                            <FaUsers /> Quản lý Khách hàng
                        </Link>
                        <Link to="/admin/ton-kho" className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 text-orange-700 font-medium flex items-center gap-2">
                            <FaBoxes /> Quản lý Tồn kho
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
