import React, { useContext, useState } from 'react'
import Logo from './Logo'
import { IoSearch } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummeryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';

const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const [menuDisplay, setMenuDisplay] = useState(false)
  const context = useContext(Context)
  const navigate = useNavigate()
  const searchInput = useLocation()
  const URLSearch = new URLSearchParams(searchInput?.search)
  const searchQuery = URLSearch.getAll('q')
  const [search, setSearch] = useState(searchQuery)

  const handleLogout = async() => {
    const fetchData = await fetch(SummeryApi.logout_user.url,{
      method : SummeryApi.logout_user.method,
      credentials : 'include'
    })

    const data = await fetchData.json()

    if(data.success){
      toast.success(data.message)
      dispatch(setUserDetails(null))
      navigate("/")
    }
    if(data.error){
      toast.error(data.message)
    }
  }

  const handleSearch = (e)=>{
    const {value} = e.target
    setSearch(value)

    if(value){
      navigate(`/search?q=${value}`)
    }else{
      navigate("/search")
    }
  }

  return (
    <header className='h-16 shadow-md bg-white fixed w-full z-40'>
      <div className='h-full container mx-auto flex items-center px-4 justify-between'>
        <div className=''>
          <Link to={"/"}>
            <Logo/>
          </Link>
        </div>

        <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2'>
          <input type='text' placeholder='search product here...' className='w-full outline-none' onChange={handleSearch} value={search}/>
          <div className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white'>
            <IoSearch/>
          </div>
        </div>

        <div className="flex items-center gap-8">

        <div className='relative flex justify-center'>

          {
            user?._id && (
              <div className='text-2xl cursor-pointer relative flex justify-center' onClick={()=>setMenuDisplay(preve => !preve)}>
                {
                  user?.profilePic ? (
                    <img src={user?.profilePic} className='w-10 h-10 rounded-full' alt={user?.name}/>
                  ) : (
                    <FaUserAlt/>
                  )  
                } 
            </div>
            )
          }  

            {
              menuDisplay && (
                <div className='absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded-md'>
                  <nav>
                    {
                      user?.role === ROLE.ADMIN && (
                        <Link to ={"/admin-panel/all-products"} className='whitespace-nowrap hidden md:block hover:bg-slate-200 hover:rounded p-2' onClick={()=>setMenuDisplay(preve => !preve)}>Admin Panel</Link>
                      )
                    }

                    <Link to={'/order'} className='whitespace-nowrap hidden md:block hover:bg-slate-200 hover:rounded p-2' onClick={()=>setMenuDisplay(preve => !preve)}>Order</Link>
                  </nav>
                </div>
              )
            }
            
        </div>

        {
          user?._id && (
            <Link to={"/cart"} className='text-2xl relative'>
              <span><FaCartArrowDown/></span>

               <div className='bg-red-600 text-white w-5 h-5 p-1 rounded-full flex items-center justify-center absolute -top-2 left-4'>
                  <p className='text-sm'>{context?.cartProductCount}</p>
                </div>
            </Link>
          )
        }

          <div>
            {
              user?._id ? (
                <button onClick={handleLogout} className='px-3 py-2 rounded-full text-black bg-red-600 hover:bg-red-700'>Logout</button>
              ):
              (
               <Link to={"/login"} className='px-3 py-2 rounded-full text-black bg-red-600  hover:bg-red-700 text-sm flex items-center justify-center'>Login</Link>
              )
            }
          </div>

        </div>
      </div>
    </header>
  )
}

export default Header
