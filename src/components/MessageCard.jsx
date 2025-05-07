import React, { useState } from 'react'
import ImageDialog from './DialogImage';

export default function MessageCard({ isReceiUserMessage, content, avatar, showAvatar, time, type, images }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const handleOpenDialog = (img) => {setOpenDialog(true) 
                                      setImageSelected(img)};
  const handleCloseDialog = () => setOpenDialog(false);
  return (
    <div
      className={`group flex w-full items-end ${isReceiUserMessage ? "self-start flex-row" : "self-end flex-row-reverse"} `}
    >
      {/* Tin nhắn */}
      <div className={`relative py-1 ${images? 'px-0':'px-2'} rounded-md max-w-[80%] w-fit break-words whitespace-pre-wrap
                       ${isReceiUserMessage ? images?"":"bg-white" :images?"":"bg-[#d9fdd3]"}`}>
        {isReceiUserMessage && showAvatar && (
          <div className="absolute -bottom-0 -left-6">
            <img
              src={avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWestySFdjEYa_HB1RMZVgx07ds7WXNUpLaQ&s"}
              className="w-[18px] h-[18px] rounded-full object-cover" 
            />
          </div>
        )}
        {type === 'text' ? (
          <p className="text-[14px]">{content}</p>
        ):(
          type === 'image' && (
            <div>
            {content && (
              <div className={!isReceiUserMessage ? 'flex justify-end' : 'flex justify-start'}>
                <p className={!isReceiUserMessage ? "text-[14px] text-right  bg-[#d9fdd3] py-1 px-2 rounded-md mb-1 w-fit break-words whitespace-pre-wrap" 
                                                  :"text-[14px] text-left bg-white py-1 px-2 mb-1 rounded-md w-fit break-words whitespace-pre-wrap"}>
                  {content}
                </p>
              </div>
            )}
            <div className= {images?.length > 1 ?'flex space-x-2 flex-wrap':''}>
              {images && images?.map((item, index) => {
                  return (
                    <>                    
                      <img src ={item?.url} 
                        className={images.length > 1 ?'rounded-md border object-cover cursor-pointer w-[80px] h-[80px]':'rounded-md border object-cover cursor-pointer md:max-w-[500px] md:max-h-[500px] max-w-[200px] max-h-[200px]'}
                        onClick={() => handleOpenDialog(item?.url)}
                      /> 
                    </>
                  )
                })}
            </div>
          </div>
          )     
        )}
      </div>

      {/* Thời gian */}
      <span className="text-[11px] text-gray-500 opacity-0 group-hover:opacity-100 transition duration-200 
        bg-white rounded-full px-2 py-[2px]  text-center">
        {time}
      </span>
      <ImageDialog  open = {openDialog} handleOnclose={handleCloseDialog} img={imageSelected} />
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

