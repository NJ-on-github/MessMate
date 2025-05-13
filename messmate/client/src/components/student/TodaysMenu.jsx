import React, { useEffect, useState } from 'react';
import './styles/TodaysMenu.css';

const TodaysMenu = () => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('http://localhost:3000/student/todays-menu');
        const data = await res.json();
        setMenu(data);
      } catch (err) {
        setError('Failed to fetch menu.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const renderMeal = (title, items) => (
    <div className="meal-section">
      <h3 className="meal-title">{title}</h3>
      {items && items.length > 0 ? (
        <ul className="menu-items">
          {items.map((item, idx) => (
            <li key={idx} className="menu-item">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="empty-menu">Not set by admin</p>
      )}
    </div>
  );

  if (loading) return <p className="loading-text">Loading today's menu...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="menu-container">
      <h2 className="menu-heading">Menu for {today}</h2>
      {renderMeal('Breakfast', menu?.breakfast)}
      {renderMeal('Lunch', menu?.lunch)}
      {renderMeal('Dinner', menu?.dinner)}
    </div>
  );
};

export default TodaysMenu;
