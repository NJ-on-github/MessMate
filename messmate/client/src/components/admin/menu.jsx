import React, { useEffect, useState } from 'react';
import "../common/table.css";
import "../common/common.css";

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

  if (loading) return <p>Loading Menu items...</p>;

  return (
    <div style={{ display: 'flex', height: '90vh', padding: '2rem' }}>
      
      {/* Left Side - Today's Menu */}
      <div style={{ flex: 1, marginRight: '2rem' }}>
        <h2>Today's Menu</h2>

        <div>
          <h3>Breakfast</h3>
          <ul>
            {todaysMenu.breakfast.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                {item.name}
                <button onClick={() => removeFromTodaysMenu('breakfast', idx)} style={smallButtonStyle}>Remove</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Lunch</h3>
          <ul>
            {todaysMenu.lunch.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                {item.name}
                <button onClick={() => removeFromTodaysMenu('lunch', idx)} style={smallButtonStyle}>Remove</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Dinner</h3>
          <ul>
            {todaysMenu.dinner.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                {item.name}
                <button onClick={() => removeFromTodaysMenu('dinner', idx)} style={smallButtonStyle}>Remove</button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button onClick={handleSaveMenu} style={buttonStyle}>Save Today's Menu</button>
        </div>
      </div>

      {/* Right Side - Available Items */}
      <div style={{ flex: 1, overflowY: 'scroll', border: '1px solid #ccc', padding: '1rem' }}>
        <h2>Available Items</h2>

        {/* Breakfast Items */}
        <h3>Breakfast Items</h3>
        {breakfastItems.map(item => (
          <div key={item.id} style={itemStyle}>
            <span>{item.name}</span>
            <button onClick={() => addToTodaysMenu('breakfast', item)} style={addButtonStyle}>Add</button>
          </div>
        ))}
        <div style={{ marginTop: '1rem' }}>
          <input 
            type="text" 
            placeholder="New breakfast item"
            value={newItemName.breakfast}
            onChange={(e) => setNewItemName(prev => ({ ...prev, breakfast: e.target.value }))}
          />
          <button onClick={() => handleAddNewItem('breakfast')}>Add Item</button>
        </div>

        <hr />

        {/* Lunch Items */}
        <h3>Lunch Items</h3>
        {lunchItems.map(item => (
          <div key={item.id} style={itemStyle}>
            <span>{item.name}</span>
            <button onClick={() => addToTodaysMenu('lunch', item)} style={addButtonStyle}>Add</button>
          </div>
        ))}
        <div style={{ marginTop: '1rem' }}>
          <input 
            type="text" 
            placeholder="New lunch item"
            value={newItemName.lunch}
            onChange={(e) => setNewItemName(prev => ({ ...prev, lunch: e.target.value }))}
          />
          <button onClick={() => handleAddNewItem('lunch')}>Add Item</button>
        </div>

        <hr />

        {/* Dinner Items */}
        <h3>Dinner Items</h3>
        {dinnerItems.map(item => (
          <div key={item.id} style={itemStyle}>
            <span>{item.name}</span>
            <button onClick={() => addToTodaysMenu('dinner', item)} style={addButtonStyle}>Add</button>
          </div>
        ))}
        <div style={{ marginTop: '1rem' }}>
          <input 
            type="text" 
            placeholder="New dinner item"
            value={newItemName.dinner}
            onChange={(e) => setNewItemName(prev => ({ ...prev, dinner: e.target.value }))}
          />
          <button onClick={() => handleAddNewItem('dinner')}>Add Item</button>
        </div>

      </div>

    </div>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  marginTop: '10px'
};

const smallButtonStyle = {
  padding: '4px 8px',
  fontSize: '12px',
  marginLeft: '10px'
};

const itemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '5px 0'
};

const addButtonStyle = {
  padding: '4px 8px',
  fontSize: '14px'
};

export default Menu;
