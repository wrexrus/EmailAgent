import React from 'react'

const Logo = ({ isOpen = true }) => {
  return (
    <div>
      <div className='flex flex-wrap'>

        <img
          className='h-11 w-10 rounded-full'
          src="https://imgs.search.brave.com/n7bdT4b9TQIVM2MbQJrmtGe0na5y-L-njSVgKHqa0rc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9maWxl/LmxvZ2VudC5haS9k/ZW1vL0xvZ2VudC1k/ZW1vLTMucG5n"
          alt="logo"
        />
        <span
          className={`ml-3 mt-2 text-lg font-semibold text-white transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-90'}`}
        >
          {isOpen ? 'Email Agent' : 'EA'}
        </span>
      </div>
    </div>
  )
}

export default Logo
