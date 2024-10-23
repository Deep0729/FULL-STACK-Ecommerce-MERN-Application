import React, { useState } from 'react'
import { FaRegEdit } from "react-icons/fa";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';


const AdminProductCard = ({
data,
fetchData
}) => {
    const [editProduct, setEditProduct] = useState(false)

  return (
    <div className='bg-white p-3 rounded'>
      <div className='w-32'>
        <div className='w-32 h-32 flex justify-center items-center'>
            <img src={data?.productImage[0]} className='mx-auto object-fill h-full'/>
        </div>
        <h1 className='text-ellipsis line-clamp-2'>{data.productName}</h1>

        <div>
            <p className='font-semibold'>
              {
                displayINRCurrency(data.offerPrice)
              }
            </p>
      
          <div className='w-fit ml-auto p-2 bg-green-100 hover:bg-green-500 rounded-full hover:text-white cursor-pointer'
              onClick={()=>setEditProduct(true)}>
            <FaRegEdit/>
          </div>
      
        </div>
      </div>

      {
        editProduct && (
          <AdminEditProduct productData={data} onClose={()=>setEditProduct(false)} fetchdata={fetchData}/>
        )
      }
    </div>
  )
}

export default AdminProductCard
