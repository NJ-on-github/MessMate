import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Dashboard.css";

const Dashboard = () => {
    const [pendingApprovals, setPendingApprovals] = useState("Fetching");
    const [totalPayments, setTotalPayments] = useState({ received: "Fetching", pending: "Fetching" });
    const [totalStudents, setTotalStudents] = useState("Fetching");
    const [todaysMenu, setTodaysMenu] = useState(null);
    const [menuSet, setMenuSet] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const date = new Date();
            const currentMonth = `${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;

            try {
                setLoading(true);
                
                // Pending approvals
                const approvalsRes = await fetch("http://localhost:3000/admin/pending-approvals/count");
                const approvalsData = await approvalsRes.json();
                setPendingApprovals(approvalsData.count || 0);

                // Payments summary (pass current month)
                const paymentsRes = await fetch(`http://localhost:3000/admin/payments/summary?month=${currentMonth}`);
                const paymentsData = await paymentsRes.json();
                setTotalPayments({
                    received: paymentsData.received || 0,
                    pending: paymentsData.pending || 0,
                });

                // Total students
                const studentsRes = await fetch("http://localhost:3000/admin/students/count");
                const studentsData = await studentsRes.json();
                setTotalStudents(studentsData.count || 0);

                // Today's menu
                const menuRes = await fetch("http://localhost:3000/student/todays-menu");
                const menuData = await menuRes.json();
                if (menuData && (menuData.breakfast?.length || menuData.lunch?.length || menuData.dinner?.length)) {
                    setTodaysMenu(menuData);
                    setMenuSet(true);
                } else {
                    setMenuSet(false);
                }
            } catch (err) {
                console.error("Error loading dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleSetMenuClick = () => {
        navigate("/admin/Todays-menu");
    };

    const handleCardClick = (cardType) => {
        switch (cardType) {
            case 'approvals':
                navigate("/admin/registrations/pending-approvals");
                break;
            case 'payments':
                navigate("/admin/payments/payments-by-month");
                break;
            case 'students':
                navigate("/admin/students/all-students");
                break;
            case 'menu':
                navigate("/admin/Todays-menu");
                break;
            default:
                break;
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Admin Dashboard</h1>
                <p className="dashboard-subtitle">Overview of your mess management system</p>
            </div>

            <div className="dashboard-grid">
                <div 
                    className="dashboard-card stats-card clickable-card"
                    onClick={() => handleCardClick('approvals')}
                >
                    <div className="card-content">
                        <h3 className="card-title">Pending Approvals</h3>
                        <div className="card-value">
                            <span className="value-number">{loading ? "..." : pendingApprovals}</span>
                        </div>
                        <p className="card-description">Registrations awaiting approval</p>
                    </div>
                </div>

                <div 
                    className="dashboard-card stats-card clickable-card"
                    onClick={() => handleCardClick('payments')}
                >
                    <div className="card-content">
                        <h3 className="card-title">Monthly Payments</h3>
                        <div className="card-value payments-value">
                            <div className="payment-item received">
                                <span className="payment-label">Received</span>
                                <span className="payment-amount">₹{loading ? "..." : totalPayments.received}</span>
                            </div>
                            <div className="payment-item pending">
                                <span className="payment-label">Pending</span>
                                <span className="payment-amount">₹{loading ? "..." : totalPayments.pending}</span>
                            </div>
                        </div>
                        <p className="card-description">Current month's payment status</p>
                    </div>
                </div>

                <div 
                    className="dashboard-card stats-card clickable-card"
                    onClick={() => handleCardClick('students')}
                >
                    <div className="card-content">
                        <h3 className="card-title">Total Students</h3>
                        <div className="card-value">
                            <span className="value-number">{loading ? "..." : totalStudents}</span>
                        </div>
                        <p className="card-description">Registered students</p>
                    </div>
                </div>

                <div 
                    className="dashboard-card menu-card clickable-card"
                    onClick={() => handleCardClick('menu')}
                >
                    <div className="card-header">
                        <h3 className="card-title">Today's Menu</h3>
                    </div>
                    
                    {loading ? (
                        <div className="menu-loading">
                            <p>Loading menu...</p>
                        </div>
                    ) : menuSet && todaysMenu ? (
                        <div className="menu-content">
                            <div className="menu-section">
                                <h4 className="meal-title">Breakfast</h4>
                                <p className="meal-items">
                                    {todaysMenu.breakfast?.join(", ") || "Not set"}
                                </p>
                            </div>
                            <div className="menu-section">
                                <h4 className="meal-title">Lunch</h4>
                                <p className="meal-items">
                                    {todaysMenu.lunch?.join(", ") || "Not set"}
                                </p>
                            </div>
                            <div className="menu-section">
                                <h4 className="meal-title">Dinner</h4>
                                <p className="meal-items">
                                    {todaysMenu.dinner?.join(", ") || "Not set"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="menu-not-set">
                            <p className="menu-warning-text">Today's menu hasn't been set yet!</p>
                            <button 
                                className="set-menu-btn"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click when button is clicked
                                    handleSetMenuClick();
                                }}
                            >
                                Set Today's Menu
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;