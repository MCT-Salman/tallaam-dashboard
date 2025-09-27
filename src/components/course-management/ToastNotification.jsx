import React from 'react';

const ToastNotification = ({ toast }) => {
    if (!toast.show) return null;

    return (
        <div className={`fixed top-5 right-5 z-50 p-4 rounded-md shadow-lg text-white ${toast.variant === 'destructive' ? 'bg-red-600' : 'bg-green-600'}`}>
            <div className="font-bold">{toast.title}</div>
            <div>{toast.description}</div>
        </div>
    );
};

export default ToastNotification;