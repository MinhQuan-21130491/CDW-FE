import React, { useEffect, useState } from 'react';
import { stories } from '../data/DummyStories';
import ProgressBar from '../components/ProgressBar';
import ReactPlayer from 'react-player';

export default function StatusViewer() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [durations, setDurations] = useState([]);
    const defaultDuration = 2000; // 2000ms cho ảnh

    // Xử lý duration: nếu là video thì lấy duration, nếu là ảnh thì dùng default
    const handleDuration = (duration) => {
        const isVideo = !!stories[currentIndex].video;
        const durationMs = isVideo ? duration * 1000 : defaultDuration;
        
        setDurations(prev => {
            const newDurations = [...prev];
            newDurations[currentIndex] = durationMs;
            return newDurations;
        });
    };

    const handleNextStory = () => {
        const nextIndex = currentIndex < stories.length - 1 ? currentIndex + 1 : 0;
        setCurrentIndex(nextIndex);
        setActiveIndex(nextIndex);
    };

    useEffect(() => {
        // Lấy duration hiện tại của story (video hoặc ảnh)
        const currentStoryDuration = durations[currentIndex] || defaultDuration;
        
        const timeInterval = setInterval(() => {
            handleNextStory();
        }, currentStoryDuration);

        return () => clearInterval(timeInterval);
    }, [currentIndex, durations]); // Theo dõi durations để cập nhật interval

    return (
        <div>
            <div className='flex justify-center items-center bg-[#0b141a] h-[85vh]'>
                <div className="relative h-[80vh] w-[45vh] flex justify-center items-center bg-black overflow-hidden">
                    {stories[currentIndex].video ? (
                        <ReactPlayer
                            url={stories[currentIndex].video}
                            onDuration={handleDuration}
                            controls={true}
                            volume={0.8}
                            width="100%"
                            height="auto"
                            playing={true}
                            muted={false}
                        />
                    ) : (
                        <img
                            className="h-full w-full object-contain"
                            src={stories[currentIndex].image}
                            alt=""
                            onLoad={() => handleDuration(null)} // Ảnh load xong thì set default duration
                        />  
                    )}
                    
                    <div className="absolute top-0 flex w-full">
                        {stories.map((item, index) => (
                            <ProgressBar
                                key={index}
                                index={index}
                                activeIndex={activeIndex}
                                duration={durations[index] || defaultDuration}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}