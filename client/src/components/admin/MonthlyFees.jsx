import { useState, useEffect } from 'react';
import React from 'react';
import ConfirmDialog from "../common/ConfirmDialog";
import "../common/table.css";
import "../common/common.css";

export default function FeeStructureManagement() {
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFee, setNewFee] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [dialog, setDialog] = useState({
    isOpen: false,
    message: '',
    onConfirm: () => {}
  });

  const currentYear = new Date().getFullYear();
  const months = [
    { value: `${currentYear}-01-01`, label: 'January' },
    { value: `${currentYear}-02-01`, label: 'February' },
    { value: `${currentYear}-03-01`, label: 'March' },
    { value: `${currentYear}-04-01`, label: 'April' },
    { value: `${currentYear}-05-01`, label: 'May' },
    { value: `${currentYear}-06-01`, label: 'June' },
    { value: `${currentYear}-07-01`, label: 'July' },
    { value: `${currentYear}-08-01`, label: 'August' },
    { value: `${currentYear}-09-01`, label: 'September' },
    { value: `${currentYear}-10-01`, label: 'October' },
    { value: `${currentYear}-11-01`, label: 'November' },
    { value: `${currentYear}-12-01`, label: 'December' }
  ];

  useEffect(() => {
    fetchFeeStructures();
  }, []);

  const fetchFeeStructures = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/admin/fees');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setFeeStructures(data);
    } catch (err) {
      setError('Failed to fetch fee structures : ' + err);
    } finally {
      setLoading(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedMonth || !newFee || isNaN(parseFloat(newFee))) {
      setError('Please select a month and enter a valid fee amount');
      return;
    }

    openConfirmDialog(
      `Are you sure you want to set ₹${newFee} for ${new Date(selectedMonth).toLocaleString('default', { month: 'long' })}?`,
      () => submitFee()
    );
  };

  const submitFee = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/admin/insert-fee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthly_fee: parseFloat(newFee),
          effective_from: selectedMonth
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add fee structure');
      }

      setNewFee('');
      setSelectedMonth('');
      setSuccessMessage('Fee structure added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchFeeStructures();
    } catch (err) {
      setError(err.message || 'Failed to add fee structure');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableMonths = () => {
    const setMonths = feeStructures.map(fee => {
      const date = new Date(fee.effective_from);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    });

    return months.filter(month => !setMonths.includes(month.value));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div>
      <h1 className='table-heading'>Monthly Fee Structure Management</h1>
      <p className="page-desc">Set the monthly fees</p>

      <div>
        <h2>Add New Fee Structure</h2>

        {error && (
          <div className="error-msg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="success-msg">
            {successMessage}
          </div>
        )}

        <div>
          <div className='Search-group'>
            <label>Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">Select Month</option>
              {getAvailableMonths().map(month => (
                <option key={month.value} value={month.value}>
                  {month.label} {currentYear}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label>Fee Amount (₹)</label>
            <input
              type="number"
              value={newFee}
              onChange={(e) => setNewFee(e.target.value)}
              placeholder="Enter amount"
              step="50"
              min="0"
            />
          </div>

          <div className="btn-fees">
            <button
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Set Fee'}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2>Existing Fee Structures</h2>

        {loading && <p>Loading fee structures...</p>}

        {!loading && feeStructures.length === 0 && (
          <p >No fee structures have been set yet.</p>
        )}

        {!loading && feeStructures.length > 0 && (
          <div>
            <div className="table-container">
              <table>
                <thead >
                  <tr>
                    <th>ID</th>
                    <th>Effective From</th>
                    <th>Monthly Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {feeStructures
                    .sort((a, b) => new Date(a.effective_from) - new Date(b.effective_from))
                    .map(fee => (
                      <tr key={fee.fee_id}>
                        <td>{fee.fee_id}</td>
                        <td>{formatDate(fee.effective_from)}</td>
                        <td>{formatCurrency(fee.monthly_fee)}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={dialog.isOpen}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onCancel={() => setDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
