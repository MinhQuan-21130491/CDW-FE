import React, { useEffect, useState } from 'react'
import { stories } from '../data/DummyStories'
import ProgressBar from '../components/ProgressBar';

export default function () {
    const duration = 2000;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const handleNextStory = () => {
        if(currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setActiveIndex(activeIndex + 1);
        }else {
            setCurrentIndex(0);
            setActiveIndex(0);
        }
    }
    useEffect(() => {
        const timeInterval = setInterval(() => {
            handleNextStory();
        }, duration)
        return () => clearInterval(timeInterval);
    }, [currentIndex])
  return (
    <div>
        <div className='flex justify-center items-center bg-[#0b141a] h-[85vh]'>
            <div className="relative h-[80vh] w-[45vh] flex justify-center items-center bg-black overflow-hidden">
                <img
                    className="h-full w-full object-contain"
                    src={stories[currentIndex].image}
                    alt=""
                />
                <div className="absolute top-0 flex w-full">
                    {stories.map((item, index) => (
                        <ProgressBar
                            key={index}
                            index={index}
                            activeIndex={activeIndex}
                            duration={duration}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}
