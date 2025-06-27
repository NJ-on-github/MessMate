import React from "react";
import "./ConfirmDialog.css";

const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-overlay">
            <div className="confirm-box">
                <p>{message}</p>
                <div className="confirm-actions">
                    <button className="btn-confirm" onClick={onConfirm}>Yes</button>
                    <button className="btn-cancel" onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
