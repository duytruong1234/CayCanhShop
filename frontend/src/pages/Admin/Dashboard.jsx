import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    FaLeaf, FaShoppingBag, FaUsers, FaBoxes, FaMoneyBillWave, FaClipboardList
} from 'react-icons/fa'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts'
import api from '../../services/api'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

const AdminDashboard = () => {
    const [summary, setSummary] = useState({ revenue: 0, total_orders: 0, pending_orders: 0, total_customers: 0 })
    const [revenueData, setRevenueData] = useState([])
    const [statusData, setStatusData] = useState([])
    const [topProducts, setTopProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => { fetchAllData() }, [])

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
        } catch (error) { console.error('Error fetching dashboard data:', error) }
        finally { setLoading(false) }
    }

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + ' đ'

    if (loading) {
        return (
            <div className="admin-page flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
                </div>
            </div>
        )
    }

    const stats = [
        { label: 'Doanh thu', value: formatPrice(summary.revenue), icon: FaMoneyBillWave, color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Tổng đơn hàng', value: summary.total_orders, icon: FaShoppingBag, color: 'bg-blue-50 text-blue-600' },
        { label: 'Chờ xử lý', value: summary.pending_orders, icon: FaClipboardList, color: 'bg-amber-50 text-amber-600' },
        { label: 'Khách hàng', value: summary.total_customers, icon: FaUsers, color: 'bg-purple-50 text-purple-600' },
    ]

    const quickLinks = [
        { to: '/admin/cay-canh', label: 'Quản lý Cây cảnh', icon: FaLeaf, color: 'text-emerald-500' },
        { to: '/admin/don-hang', label: 'Quản lý Đơn hàng', icon: FaShoppingBag, color: 'text-blue-500' },
        { to: '/admin/khach-hang', label: 'Quản lý Khách hàng', icon: FaUsers, color: 'text-purple-500' },
        { to: '/admin/ton-kho', label: 'Quản lý Tồn kho', icon: FaBoxes, color: 'text-orange-500' },
    ]

    return (
        <div className="admin-page animate-fade-in">
            <div className="admin-page-header">
                <h1>Dashboard</h1>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((s, i) => (
                    <div key={i} className="admin-stat-card">
                        <div className={`admin-stat-icon ${s.color}`}><s.icon size={20} /></div>
                        <div>
                            <p className="label">{s.label}</p>
                            <p className="value text-lg">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="lg:col-span-2 admin-card">
                    <div className="admin-card-header">Biểu đồ doanh thu (7 ngày qua)</div>
                    <div className="admin-card-body">
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(value) => formatPrice(value)} contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                                    <Bar dataKey="revenue" name="Doanh thu" fill="#10b981" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-card">
                    <div className="admin-card-header">Trạng thái đơn hàng</div>
                    <div className="admin-card-body">
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        innerRadius={40}
                                        fill="#8884d8"
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {statusData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Products + Quick Links */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="admin-card">
                    <div className="admin-card-header">Top 5 Sản phẩm bán chạy</div>
                    <div className="admin-card-body">
                        <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                    <XAxis type="number" tick={{ fontSize: 12 }} />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                                    <Bar dataKey="sold" name="Đã bán" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="admin-card">
                    <div className="admin-card-header">Truy cập nhanh</div>
                    <div className="admin-card-body">
                        <div className="grid grid-cols-2 gap-3">
                            {quickLinks.map((link, i) => (
                                <Link key={i} to={link.to} className="admin-quick-link">
                                    <link.icon className={link.color} /> {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
