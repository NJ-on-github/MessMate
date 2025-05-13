import React, { useEffect, useState } from 'react';
import "../common/table.css";
import "../common/common.css";
import "./styles/Menu.css";


const Menu = () => {
  const [breakfastItems, setBreakfastItems] = useState([]);
  const [lunchItems, setLunchItems] = useState([]);
  const [dinnerItems, setDinnerItems] = useState([]);
  const [todaysMenu, setTodaysMenu] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState({
    breakfast: '',
    lunch: '',
    dinner: ''
  });

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    try {
      const [breakfastRes, lunchRes, dinnerRes] = await Promise.all([
        fetch('http://localhost:3000/admin/Menu/breakfast-items'),
        fetch('http://localhost:3000/admin/Menu/lunch-items'),
        fetch('http://localhost:3000/admin/Menu/dinner-items'),
      ]);

      const breakfastData = await breakfastRes.json();
      const lunchData = await lunchRes.json();
      const dinnerData = await dinnerRes.json();

      setBreakfastItems(breakfastData);
      setLunchItems(lunchData);
      setDinnerItems(dinnerData);

    } catch (err) {
      console.error('Failed to load Menu items', err);
    } finally {
      setLoading(false);
    }
  };

  const addToTodaysMenu = (category, item) => {
    setTodaysMenu(prev => ({
      ...prev,
      [category]: [...prev[category], item]
    }));
  };

  const removeFromTodaysMenu = (category, index) => {
    setTodaysMenu(prev => ({
      ...prev,
      [category]: prev[category].filter((_, idx) => idx !== index)
    }));
  };

  const handleSaveMenu = async () => {
    try {
      const res = await fetch('http://localhost:3000/admin/Menu/save-todays-Menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todaysMenu),
      });

      if (!res.ok) throw new Error('Failed to save Menu');

      alert('Today\'s Menu saved successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddNewItem = async (category) => {
    try {
      if (!newItemName[category]) return alert('Please enter an item name.');

      const res = await fetch(`http://localhost:3000/admin/Menu/add-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newItemName[category], category }),
      });

      if (!res.ok) throw new Error('Failed to add new item');

      alert('Item added successfully!');
      setNewItemName(prev => ({ ...prev, [category]: '' }));
      fetchAllItems(); // Refresh items
    } catch (err) {
      alert(err.message);
    }
  };

  // New function to handle removing an item from the database
  const handleRemoveItem = async (category, itemId) => {
    try {
      // Confirm before deletion
      if (!confirm(`Are you sure you want to remove this item?`)) {
        return;
      }

      const res = await fetch(`http://localhost:3000/admin/Menu/remove-item`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, category }),
      });

      if (!res.ok) throw new Error('Failed to remove item');

      alert('Item removed successfully!');
      fetchAllItems(); // Refresh items

      // Also remove from today's menu if present
      if (category === 'breakfast') {
        setTodaysMenu(prev => ({
          ...prev,
          breakfast: prev.breakfast.filter(item => item.id !== itemId)
        }));
      } else if (category === 'lunch') {
        setTodaysMenu(prev => ({
          ...prev,
          lunch: prev.lunch.filter(item => item.id !== itemId)
        }));
      } else if (category === 'dinner') {
        setTodaysMenu(prev => ({
          ...prev,
          dinner: prev.dinner.filter(item => item.id !== itemId)
        }));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading Menu items...</p>;

  return (
    <div className="menu-page">
      <h2 className="table-heading">Menu Management</h2>

      <div className="menu-layout">
        {/* Left Side - Today's Menu */}
        <div className="todays-menu">
          <h2 className="section-heading">Today's Menu</h2>

          <div className="meal-category">
            <h3>Breakfast</h3>
            <ul className="menu-list">
              {todaysMenu.breakfast.map((item, idx) => (
                <li key={idx} className="menu-list-item">
                  {item.name}
                  <button
                    onClick={() => removeFromTodaysMenu('breakfast', idx)}
                    className="btn-warning"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="meal-category">
            <h3>Lunch</h3>
            <ul className="menu-list">
              {todaysMenu.lunch.map((item, idx) => (
                <li key={idx} className="menu-list-item">
                  {item.name}
                  <button
                    onClick={() => removeFromTodaysMenu('lunch', idx)}
                    className="btn-warning"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="meal-category">
            <h3>Dinner</h3>
            <ul className="menu-list">
              {todaysMenu.dinner.map((item, idx) => (
                <li key={idx} className="menu-list-item">
                  {item.name}
                  <button
                    onClick={() => removeFromTodaysMenu('dinner', idx)}
                    className="btn-warning"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button onClick={handleSaveMenu} className="btn-success">
            Save Today's Menu
          </button>
        </div>

        {/* Right Side - Available Items */}
        <div className="available-items">
          <h2 className="section-heading">Available Items</h2>

          <div className="item-category">
            <h3>Breakfast Items</h3>
            <div className="item-list">
              {breakfastItems.map(item => (
                <div key={item.id} className="item-row">
                  <span>{item.name}</span>
                  <div className="item-actions">
                    <button
                      onClick={() => addToTodaysMenu('breakfast', item)}
                      className="btn-success"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => handleRemoveItem('breakfast', item.id)}
                      className="btn-warning"
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="new-item-form">
              <input
                type="text"
                placeholder="New breakfast item"
                value={newItemName.breakfast}
                onChange={(e) => setNewItemName(prev => ({ ...prev, breakfast: e.target.value }))}
              />
              <button
                onClick={() => handleAddNewItem('breakfast')}
                className="btn-success"
              >
                Add Item
              </button>
            </div>
          </div>

          <div className="item-category">
            <h3>Lunch Items</h3>
            <div className="item-list">
              {lunchItems.map(item => (
                <div key={item.id} className="item-row">
                  <span>{item.name}</span>
                  <div className="item-actions">
                    <button
                      onClick={() => addToTodaysMenu('lunch', item)}
                      className="btn-success"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => handleRemoveItem('lunch', item.id)}
                      className="btn-warning"
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="new-item-form">
              <input
                type="text"
                placeholder="New lunch item"
                value={newItemName.lunch}
                onChange={(e) => setNewItemName(prev => ({ ...prev, lunch: e.target.value }))}
              />
              <button
                onClick={() => handleAddNewItem('lunch')}
                className="btn-success"
              >
                Add Item
              </button>
            </div>
          </div>

          <div className="item-category">
            <h3>Dinner Items</h3>
            <div className="item-list">
              {dinnerItems.map(item => (
                <div key={item.id} className="item-row">
                  <span>{item.name}</span>
                  <div className="item-actions">
                    <button
                      onClick={() => addToTodaysMenu('dinner', item)}
                      className="btn-success"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => handleRemoveItem('dinner', item.id)}
                      className="btn-warning"
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="new-item-form">
              <input
                type="text"
                placeholder="New dinner item"
                value={newItemName.dinner}
                onChange={(e) => setNewItemName(prev => ({ ...prev, dinner: e.target.value }))}
              />
              <button
                onClick={() => handleAddNewItem('dinner')}
                className="btn-success"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;