import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; //npm install react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; //npm install chart.js

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Revenue = ({ currentUsername, isLoggedIn }) => {
    const [revenueData, setRevenueData] = useState([]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);

    const getRevenue = async (month, year) => {
        try {
            const response = await fetch('http://localhost:3300/revenue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sellerID: currentUsername,
                    month: month,
                    year: year,
                }),
            });
      
            if (response.ok) {
                const data = await response.json();
                return data.revenue;
            } else {
                const errorData = await response.json();
                console.log(errorData.message);
                return 0;
            }
        } catch (error) {
            console.log(error);
            alert('Error');
            return 0;
        }
    };

    const getAllMonthlyRevenue = async (year) => {
        setLoading(true);
        try {
            const monthlyRevenue = await Promise.all(
                Array.from({ length: 12 }, (_, month) => getRevenue(month + 1, year))
            );
            setRevenueData(monthlyRevenue);
        } catch (error) {
            console.error('Error fetching monthly revenue:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            getAllMonthlyRevenue(currentYear);
        }
    }, [currentYear, isLoggedIn]);

    if (loading) {
        return <div>Loading data...</div>;
    }

    if (!isLoggedIn) {
        return <div>Please log in to view the revenue data.</div>;
    }

    const totalRevenue = revenueData.reduce((acc, curr) => acc + parseInt(curr), 0);

    const chartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
            {
                label: `Revenue for ${currentYear}`,
                data: revenueData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const goToPreviousYear = () => {
        setCurrentYear(currentYear - 1);
    };
    
    const goToNextYear = () => {
        setCurrentYear(currentYear + 1);
    };

    return (
        <div className="revenue-page">
            <h2>Monthly Revenue</h2>
            <div className="chart-container">
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: `Monthly Revenue for ${currentYear}`,
                            },
                            tooltip: {
                                callbacks: {
                                    label: (tooltipItem) => `$${tooltipItem.raw.toLocaleString()}`,
                                },
                            },
                        },
                    }}
                />
            </div>
            <div className="buttons">
                <button onClick={goToPreviousYear}>Previous Year</button>
                <span>{currentYear}</span>
                <button onClick={goToNextYear}>Next Year</button>
            </div>
            <h3>Total Revenue for {currentYear}: ${totalRevenue.toLocaleString()}</h3>
        </div>
  );
};

export default Revenue;