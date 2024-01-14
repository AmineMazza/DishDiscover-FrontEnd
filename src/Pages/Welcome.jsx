import React from 'react'
import im from '../assets/im.png'
import { useNavigate } from 'react-router-dom'

const Welcome = () => {
  const navigate = useNavigate()
  return (
    <div className='flex flex-1 min-h-screen items-center justify-center m-5' >
        <div className='flex rounded-xl h-[90vh] flex-1 items-center justify-center bg-[#d1d0d0]' >
        <img src={im} />
        </div>
        <div className='flex flex-col flex-1 items-center justify-center bg-white' >
            <h2 className='font-semibold text-5xl' >Dish Discover</h2>
            <p className='text-xl my-6 font-light' >Dashboard for restaurants</p>
            <button className="overflow-hidden relative w-32 p-2 h-12 bg-black text-white border-none rounded-full cursor-pointer relative z-10 group"
            onClick={() => navigate('/login')}
            >
  Start
  <span className="absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left" />
  <span className="absolute w-36 h-32 -top-8 -left-2 bg-indigo-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left" />
  <span className="absolute w-36 h-32 -top-8 -left-2 bg-indigo-600 rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left" />
  <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-6 z-10">
    Explore!
  </span>
</button>

        </div>
    </div>
  )
}

export default Welcome