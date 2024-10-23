import React, { useContext, useEffect, useState } from 'react'
import Context from '../context'
import SummaryApi from '../common'
import displayINRCurrency from '../helpers/displayCurrency'
import { AiFillDelete } from "react-icons/ai";
import {loadStripe} from '@stripe/stripe-js';

const Cart = () => {
    const [data,setData] = useState([])
    const [loading, setLoading] =useState(false)
    const context = useContext(Context)
    const loadingCart = new Array(4).fill(null)

    const fetchData=async() =>{
        const response = await fetch(SummaryApi.addToCartProductView.url,{
            method : SummaryApi.addToCartProductView.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
        })

        const responseData = await response.json()

        if(responseData.success){
            setData(responseData.data)
        }
    }       

    const handleLoading = async() =>{
        await fetchData()
    }

    useEffect(()=>{
        setLoading(true)
        handleLoading()
        setLoading(false)
    },[])

    const increaseQty = async(id,qty) =>{
        const response = await fetch(SummaryApi.updateCartProduct.url,{
            method: SummaryApi.updateCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                {
                    _id : id, 
                    quantity : qty + 1
                }
            )
        })

        const responseData = await response.json()

        if(responseData.success){
            fetchData()
        }
    }

    const decraseQty = async(id,qty) =>{
        if(qty >= 2){
            const response = await fetch(SummaryApi.updateCartProduct.url,{
                method : SummaryApi.updateCartProduct.method,
                credentials : 'include', 
                headers : {
                    "content-type" : 'application/json'
                },
                body : JSON.stringify(
                    {
                        _id : id,
                        quantity : qty - 1
                    }
                )
            })

            const responseData = await response.json()

            if(responseData.success){
                fetchData()
            }
        }
    }

    const deleteCartProduct = async(id)=>{
        const response = await fetch(SummaryApi.deleteCartProduct.url,{
            method : SummaryApi.deleteCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                {   
                    _id : id,
                }
            )
        })

        const responseData = await response.json()

        if(responseData.success){
            fetchData()
            context.fetchUserAddToCart()
        }
    }

    const handlePayment = async()=>{
        const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)
        const response = await fetch(SummaryApi.payment.url,{
            method : SummaryApi.payment.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify({
                cartItems : data
            })
        })               

        const responseData = await response.json()

        if(responseData?.id){
            stripePromise.redirectToCheckout({ sessionId : responseData.id})
        }

        console.log("payment response",responseData)
    }

    const totalQty = data.reduce((previousValue,currentValue)=> previousValue + currentValue.quantity,0)
    const totalPrice = data.reduce((preve,curr)=> preve + (curr.quantity * curr?.productId?.offerPrice) ,0)

  return (
    <div className='container mx-auto'>

      <div className='text-center text-lg my-3'>
        {
            data.length === 0 && !loading && (
              <p className='py-5 bg-white'>No Data</p>  
            )
        }
      </div>

      <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>

        {/***view product */}
        <div className='w-full max-w-3xl'>
            {
                loading ? (
                    loadingCart?.map((el,index) => {
                        return(
                            <div key={el+"The Cart is Loading"+index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'>
                            </div>
                        )
                    })
                ):(
                    data.map((product,index)=>{
                        return(
                            <div key={product?._id+"The Cart is Loading"} className='w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]'>
                                <div className='w-32 h-32 bg-slate-200'>
                                    <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply'/>
                                </div>

                                <div className='px-4 py-2 relative'>
                                    {/**delete product */}
                                    <div className='absolute right-0 text-black rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={()=>deleteCartProduct(product?._id)}>
                                        <AiFillDelete/>
                                    </div>

                                    <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>{product?.productId?.productName}</h2>
                                    <p className='capitalize text-slate-500'>{product?.productId.category}</p>
                                    <div className='flex items-center justify-between'>
                                        <p className='text-red-600 font-medium text-lg'>{displayINRCurrency(product?.productId.offerPrice)}</p>
                                        <p className='text-slate-600 font-semibold text-lg'>{displayINRCurrency(product?.productId.offerPrice * product?.quantity)}</p>
                                    </div>

                                    <div className='flex items-center gap-3 mt-1'>
                                        <button className='border border-slate-500 text-black hover:bg-slate-500 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={()=>decraseQty(product?._id,product?.quantity)}>-</button>
                                        <span>{product?.quantity}</span>
                                        <button className='border border-slate-500 text-black hover:bg-slate-500 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={()=>increaseQty(product?._id,product?.quantity)}>+</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )
            }
        </div>

        {/***summary  */}
        {
            data[0] && (
                <div className='mt-5 lg:mt-0 w-full max-w-sm'>
            {
                loading ? (
                    <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse'>

                    </div>
                ) : (
                    <div className='h-36 bg-white'>
                        <h2 className='text-white bg-red-600 px-4 py-1'>Summary</h2>
                        <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-black'>
                            <p>Quantity : </p>
                            <p>{totalQty}</p>
                        </div>

                        <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-black'>
                            <p>Total Price : </p>
                            <p>{displayINRCurrency(totalPrice)}</p>
                        </div>

                        <button className='bg-orange-600 p-2 text-white w-full mt-2 hover:bg-orange-700' onClick={handlePayment}>Payment</button>

                    </div>
                )
            }
            </div>
            )
        }
        
      </div>
    </div>
  )
}

export default Cart