import React from 'react'

export default function MessageCard({ isReceiUserMessage, content, avatar, showAvatar, time }) {
  return (
    <div
      className={`group flex items-end ${isReceiUserMessage ? "self-start flex-row" : "self-end flex-row-reverse"} gap-2`}
    >
      {/* Tin nhắn */}
      <div className={`relative py-1 px-2 rounded-md max-w-[50%] break-words whitespace-pre-wrap ${isReceiUserMessage ? "bg-white" : "bg-[#d9fdd3]"}`}>
        {isReceiUserMessage && showAvatar && (
          <div className="absolute -bottom-0 -left-6">
            <img
              src={avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWestySFdjEYa_HB1RMZVgx07ds7WXNUpLaQ&s"}
              className="w-[18px] h-[18px] rounded-full object-cover" 
            />
          </div>
        )}
        <p className="text-[14px]">{content}</p>
      </div>

      {/* Thời gian */}
      <span className="text-[11px] text-gray-500 opacity-0 group-hover:opacity-100 transition duration-200 
        bg-white rounded-full px-2 py-[2px]  text-center">
        {time}
      </span>
    </div>
  );
}
function formatFullDate(dateString) {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${hours}:${minutes} ${day}-${month}-${year}`;
}

const dateStr = "2025-04-06T19:26:41";
console.log(formatFullDate(dateStr));  // Output: 19:26 06-04-2025
