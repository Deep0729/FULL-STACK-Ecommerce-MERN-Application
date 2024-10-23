import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import displayINRCurrency from '../helpers/displayCurrency'
import moment from 'moment'

const AllOrder = () => {
    const [data,setData] = useState([])

    const fetchOrderDetails = async()=>{
        const response = await fetch(SummaryApi.allOrder.url,{
          method : SummaryApi.allOrder.method,
          credentials : 'include'
        })

        const responseData = await response.json()

        setData(responseData.data)
        console.log("order list",responseData)
    }

    useEffect(()=>{
        fetchOrderDetails()
    }, [])

  return (
    <div className='h-[calc(100vh-190px)] overflow-y-scroll'>
      {
        !data[0] && (
          <p>No Order available</p>
      )
  }
  <div className='p-5 w-full'>
          {
            data.map((item,index)=>{
              return(
                <div key={item.userId+index}>
                   <p className='font-bold font-sans text-lg p-1'>{moment(item.createdAt).format('llll')}</p> 
                   <div className='border rounded border-b-gray-300'>
                        <div className='flex flex-col lg:flex-row justify-between'>
                            <div className='grid gap-3'>
                              {
                                item?.productDetails.map((product,index)=>{
                                  return(
                                    <div key={product.productId+index} className='flex gap-5 bg-slate-100'>
                                        <img 
                                          src={product.image[0]}
                                          className='w-36 h-36 bg-slate-200 object-scale-down p-2'
                                        />
                                        <div>
                                          <div className='font-bold text-xl text-ellipsis line-clamp-1'>{product.name}</div>
                                          <div className='flex items-center gap-10 mt-1'>
                                            <div className='font-semibold text-xl text-green-500'>{displayINRCurrency(product.price)}</div>
                                            <p className='font-medium'>Quantity : {product.quantity}</p>
                                          </div>
                                        </div>
                                    </div>
                                  )
                                })
                              }
                            </div>
                            <div className='flex flex-col gap-4 p-2 min-w-[350px]'>
                              <div>
                                  <div className='text-lg font-bold font-serif'>Payment Details : </div>
                                  <p className='mt-1 ml-3 font-serif'>Payment method : {item.paymentDetails.payment_method_type[0]}</p>
                                  <p className='ml-3 font-serif'>Payment Status : {item.paymentDetails.payment_status}</p>
                              </div>
                              <div>
                                <div className='text-lg font-bold font-serif'>Shipping Details :</div>
                                {
                                  item.shipping_options.map((shipping,index)=>{
                                    return(
                                      <div key={shipping.shipping_rate} className=' mt-1 ml-3 font-semibold'>
                                        Shipping Amount : {displayINRCurrency(shipping.shipping_amount)}
                                      </div>
                                    )
                                  })                      
                                }
                              </div>
                            </div>
                        </div>

                      <div className='font-semibold ml-auto w-fit lg:text-2xl font-sans'>
                        Total Amount : {displayINRCurrency(item.totalAmount)}
                      </div>
                   </div>
                </div>
              )
            })
          }
      </div>
    </div>
  )
}

export default AllOrder
