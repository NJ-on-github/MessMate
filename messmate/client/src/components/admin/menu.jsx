import React, { useEffect, useState } from 'react';
import "../common/table.css";
import "../common/common.css";
import "./styles/Menu.css";
import ConfirmDialog from "../common/ConfirmDialog";

const Menu = () => {
  const [breakfastItems, setBreakfastItems] = useState([]);
  const [lunchItems, setLunchItems] = useState([]);
  const [dinnerItems, setDinnerItems] = useState([]);
  const [todaysMenu, setTodaysMenu] = useState({ breakfast: [], lunch: [], dinner: [] });
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState({ breakfast: '', lunch: '', dinner: '' });
  const [menuAlreadySet, setMenuAlreadySet] = useState(false);
  const [savedMenu, setSavedMenu] = useState({ breakfast: [], lunch: [], dinner: [] });

  const [dialog, setDialog] = useState({
    isOpen: false,
    message: '',
    onConfirm: () => {}
  });

  useEffect(() => {
    fetchAllItems();
    fetchTodaysMenu();
  }, []);

  const fetchAllItems = async () => {
    try {
      const [breakfastRes, lunchRes, dinnerRes] = await Promise.all([
        fetch('http://localhost:3000/admin/Menu/breakfast-items'),
        fetch('http://localhost:3000/admin/Menu/lunch-items'),
        fetch('http://localhost:3000/admin/Menu/dinner-items'),
      ]);

      setBreakfastItems(await breakfastRes.json());
      setLunchItems(await lunchRes.json());
      setDinnerItems(await dinnerRes.json());
    } catch (err) {
      console.error('Failed to load Menu items', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodaysMenu = async () => {
    try {
      const res = await fetch('http://localhost:3000/admin/menu/todays');
      if (res.status === 404) {
        setMenuAlreadySet(false);
        setSavedMenu({ breakfast: [], lunch: [], dinner: [] });
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch today\'s menu');
      const data = await res.json();
      setMenuAlreadySet(true);
      setSavedMenu(data);
    } catch (err) {
      setMenuAlreadySet(false);
      setSavedMenu({ breakfast: [], lunch: [], dinner: [] });
    }
  };

  const openConfirmDialog = (message, onConfirmAction) => {
    setDialog({
      isOpen: true,
      message,
      onConfirm: () => {
        onConfirmAction();
        setDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleSaveMenu = () => {
    openConfirmDialog("Are you sure you want to save today's menu?", saveMenuConfirmed);
  };

  const saveMenuConfirmed = async () => {
    try {
      const res = await fetch('http://localhost:3000/admin/menu/save-todays-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todaysMenu),
      });

      if (!res.ok) throw new Error('Failed to save Menu');

      alert("Today's Menu saved successfully!");
    } catch (err) {
      alert(err.message);
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
      fetchAllItems();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveItem = async (category, itemId) => {
    if (!window.confirm(`Are you sure you want to remove this item?`)) return;

    try {
      const res = await fetch(`http://localhost:3000/admin/Menu/remove-item`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, category }),
      });

      if (!res.ok) throw new Error('Failed to remove item');

      alert('Item removed successfully!');
      fetchAllItems();

      setTodaysMenu(prev => ({
        ...prev,
        [category]: prev[category].filter(item => item.id !== itemId)
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading Menu items...</p>;

  return (
    <div className="menu-page">
      <h2 className="table-heading">Menu Management</h2>
      <p className="page-desc">Set everyday's menu</p>
      <div className="menu-layout">
        <div className="todays-menu">
          <h2 className="section-heading">Today's Menu</h2>

          {menuAlreadySet ? (
            // Render saved menu (read-only)
            ["breakfast", "lunch", "dinner"].map((meal) => (
              <div key={meal} className="meal-category">
                <h3>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h3>
                <ul className="menu-list">
                  {savedMenu[meal]?.map((item, idx) => (
                    <li key={idx} className="menu-list-item">
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            // Render editable menu
            <>
              {["breakfast", "lunch", "dinner"].map((meal) => (
                <div key={meal} className="meal-category">
                  <h3>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h3>
                  <ul className="menu-list">
                    {todaysMenu[meal].map((item, idx) => (
                      <li key={idx} className="menu-list-item">
                        {item.name}
                        <button
                          onClick={() => removeFromTodaysMenu(meal, idx)}
                          className="btn-warning"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <button onClick={handleSaveMenu} className="btn-success">
                Save Today's Menu
              </button>
            </>
          )}
        </div>

        <div className="available-items">
          <h2 className="section-heading">Available Items</h2>

          {[
            { label: "Breakfast", data: breakfastItems },
            { label: "Lunch", data: lunchItems },
            { label: "Dinner", data: dinnerItems },
          ].map(({ label, data }) => (
            <div key={label} className="item-category">
              <h3>{label} Items</h3>
              <div className="item-list">
                {data.map(item => (
                  <div key={item.id} className="item-row">
                    <span>{item.name}</span>
                    <div className="item-actions">
                      <button
                        onClick={() => addToTodaysMenu(label.toLowerCase(), item)}
                        className="btn-success"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => handleRemoveItem(label.toLowerCase(), item.id)}
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
                  placeholder={`New ${label.toLowerCase()} item`}
                  value={newItemName[label.toLowerCase()]}
                  onChange={(e) =>
                    setNewItemName(prev => ({
                      ...prev,
                      [label.toLowerCase()]: e.target.value
                    }))
                  }
                />
                <button
                  onClick={() => handleAddNewItem(label.toLowerCase())}
                  className="btn-success"
                >
                  Add Item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={dialog.isOpen}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onCancel={() => setDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default Menu;
