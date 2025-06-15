import { Navigate } from 'react-router-dom';
import React from 'react';

export const AdminProtectedRoute = ({ children }) => {
  const adminId = localStorage.getItem('adminId');
  if (!adminId) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const StudentProtectedRoute = ({ children }) => {
  const studentId = localStorage.getItem('studentId');
  if (!studentId) {
    return <Navigate to="/" replace />;
  }
  return children;
};