"use client";

import React, { useEffect, useState } from "react";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

const ErrorToast: React.FC<{ message: string; onClose?: () => void }> = ({ message, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => {
                onClose?.();
            }, 300);
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!visible) return null;

    return (
        <div
            className={`fixed top-6 right-6 z-50 transition-all duration-300 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
        >
            <div className="flex items-center gap-3 px-5 py-3 bg-red-500 text-white rounded-lg shadow-lg shadow-red-200/40 border border-red-400">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{message}</span>
                <button
                    className="ml-2 text-white/70 hover:text-white transition"
                    onClick={() => {
                        setVisible(false);
                        setTimeout(() => onClose?.(), 300);
                    }}
                    aria-label="Close"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

const GlobalError = ({ error, reset }: ErrorProps) => {
    const [show, setShow] = useState(true);

    if (!show) return null;

    return (
        <ErrorToast
            message={error.message || "Something went wrong!"}
            onClose={() => {
                setShow(false);
                reset();
            }}
        />
    );
};

export default GlobalError;