import React, { useEffect, useState } from 'react';
import './styles/ProgressBar.css';

export default function ProgressBar({ activeIndex, duration, index }) {
    const isActive = index === activeIndex;
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let timeInterval;

        if (isActive) {
            setProgress(0); // Reset progress khi active
            timeInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev < 100) {
                        return prev + 1;
                    } else {
                        clearInterval(timeInterval); // Dừng interval khi progress đạt 100
                        return prev;
                    }
                });
            }, duration / 100);
        }

        return () => {
            // Dọn dẹp interval khi component unmount hoặc khi activeIndex thay đổi
            clearInterval(timeInterval);
        };
    }, [isActive, duration]);

    return (
        <div className={`progress-bar-container ${isActive ? 'active' : ''}`}>
            <div
                className={`${isActive ? 'progress-bar' : ''}`}
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
}
