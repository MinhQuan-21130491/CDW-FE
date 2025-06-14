import { FaCircle } from 'react-icons/fa';
import { avatar_default } from '../assets'

export default function UserCard({user, isOnline}) {
  const handleNavigate = () => {
    // navigate(`/status/{userId}`)
  }
  return (
    <div onClick={handleNavigate} className='flex items-center pt-3 cursor-pointer w-[100%]'>
        <div className='md:w-[20%] w-[100%]'>
            <div className="relative w-16 h-12">
              <img
                  src = {user?.profile_picture || avatar_default}
                  className='w-12 h-12 rounded-full object-cover'
              />
              {isOnline && (
                <FaCircle className={`absolute bottom-0 left-9 text-green-400 text-xs bg-white rounded-full`} />
              )}
            </div>
        </div>
        <div className=' w-[80%] hidden md:block text-ellipsis overflow-hidden whitespace-nowrap'>
            <p>{user?.full_name || "Chip"}</p>
        </div>
    </div>
  )
}
