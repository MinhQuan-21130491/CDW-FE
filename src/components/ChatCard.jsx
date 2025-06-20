import { useEffect, useState } from 'react'
import { FaCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { avatar_default } from '../assets'
import { useTranslation } from 'react-i18next';

export default function ChatCard({user, isHide, messageLast, time, group, isMe, isOnline, typeMessageLast}) {
  const [content, setContent] = useState();
  const{t} = useTranslation();
  useEffect(() => {
      if(typeMessageLast) {
        console.log(typeMessageLast)
        if(typeMessageLast === "text") {
          if(isMe) {
            setContent(t('you') +": " + messageLast);
          }else {
            setContent(messageLast);
          }
        }else {
          if(isMe) {
            setContent(t('you') +": Đã gửi hình ảnh");
          }else {
            setContent("Đã gửi hình ảnh");
          }
        }
      }
  }, [messageLast, typeMessageLast, t])
  return (
    <div className='px-3 pb-2 cursor-pointerw-full cursor-pointer'>
        {/* Line separator */}
        <div className='border-t border-gray-300 mb-2 w-full'></div>
        <div className='flex justify-between items-center w-full relative'>
            <div  className='flex space-x-3 items-center w-[100%]'>
                  <div className="relative w-16 h-12">
                    <img
                      src={user?.profile_picture || group?.chat_image || avatar_default}
                      className="w-12 h-12 rounded-full object-cover"
                    />
              {isOnline && (
                <FaCircle className={`absolute bottom-0 left-9 text-green-400 text-xs bg-white rounded-full`} />
              )}                  </div>
                <div className='w-full hidden md:block'>
                     <p className='text-md'>{user?.full_name || group?.chat_name || 'chip'}</p>
                     {!isHide && (
                        <div className='w-[100%] flex justify-between'>
                            <p className='max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis text-xs text-gray-400'>
                              {content}
                            </p>
                            <div className='w-[30%] flex space-x-1 items-center'>
                              <p className='text-xs text-gray-400'>{time && formatTime(time, t) || ''}</p>
                              {/* <FaCircle className='text-xs text-blue-600' /> */}
                            </div>
                         </div>
                     )}
                </div>  
            </div>
          
            <div>
            </div>
        </div>
    </div>
  )
}
function formatTime(dateString, t) {
    const date = new Date(dateString);
    const dateNow = new Date();
    const diffInMs = dateNow - date;
    const diffInHour = diffInMs/(1000*3600)
    let result = ''
    if(diffInHour< 1) {
      result = (diffInHour * 60).toFixed(0) +" "+ t('minute');
    }else if(diffInHour > 1 && diffInHour < 24) {
      result = diffInHour.toFixed(0) +" "+ t('hour');
    }else{
      result = (diffInHour/24).toFixed(0) +" "+ t('day');
    }
    return result;
  }
  

  
