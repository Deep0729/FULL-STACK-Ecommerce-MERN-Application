import React, { useState } from 'react'
import { IoMdCloseCircleOutline } from "react-icons/io";
import productCategory from '../helpers/productCategory';
import { IoIosCloudUpload } from "react-icons/io";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdOutlineDeleteForever } from "react-icons/md";
import SummeryApi from '../common';
import {toast} from 'react-toastify'


const UploadProduct = ({
  onClose,
  fetchData
}) => {
  const [data,setData]= useState({
    productName : "",
    brandName : "",
    category : "",
    productImage : [],
    description : "",
    price : "",
    offerPrice : ""
  })

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false)
  const [fullScreenImage, setFullScreenImage] = useState("")

  const handleOnChange = (e) => {
    const {name, value} = e.target

    setData((preve) => {
      return{
        ...preve ,
        [name] : value
      }
    })
  }

  const handleUploadProduct = async(e) => {
    const file = e.target.files[0]
    const uploadImageCloudinary = await uploadImage(file)

    setData((preve)=> {
      return{
        ...preve,
        productImage : [...preve.productImage, uploadImageCloudinary.url]
      }
    })
  }

const handleDeleteProductImage = async(index) => {
  console.log("image index",index)
  
  const newProductImage = [...data.productImage]
  newProductImage.splice(index, 1)

  setData((preve)=>{
    return{
      ...preve,
      productImage : [...newProductImage]
    }
  })
}

const handleSubmit = async(e) =>{
  e.preventDefault()

  const response = await fetch(SummeryApi.uploadProduct.url,{
    method : SummeryApi.uploadProduct.method,
    credentials : 'include',
    headers : {
      "content-type" : "application/json"
    },
    body : JSON.stringify(data)
  })

  const responseData = await response.json()

  if(responseData.success){
    toast.success(responseData?.message)
    onClose()
    fetchData()
  }

  if(responseData.error){
    toast.error(responseData?.message)
  }
}

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 bottom-0 right-0 left-0 flex justify-center items-center'>
        <div className='bg-white p-3 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>

            <div className='flex justify-between items-center pb-3'>
                <h2 className='font-bold text-lg'>Upload Product</h2>
                <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                  <IoMdCloseCircleOutline/>
                </div>
            </div>

            <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-10' onSubmit={handleSubmit}>
              <lable htmlFor='producrName'>Product Name: </lable>
              <input
                type='text'
                id='productName'
                placeholder='Enter product name'
                name='productName'
                value={data.productName}
                onChange={handleOnChange}
                className='p-2 bg-slate-200 border rounded'
                required
              />

              <lable htmlFor='brandName' className='mt-2'>Brand Name: </lable>
              <input
                type='text'
                id='brandName'
                placeholder='Enter brand name'
                name='brandName'
                value={data.brandName}
                onChange={handleOnChange}
                className='p-2 bg-slate-200 border rounded'
                required
              />

              <lable htmlFor='category' className='mt-2'>Category: </lable>
              <select required value={data.category} name='category' onChange={handleOnChange} className='p-2 bg-slate-200 border rounded'>
                <option value={""}>Select Category</option>
                {
                  productCategory.map((el,index) => {
                    return(
                      <option value={el.value} key={el.value+index}>{el.label}</option>
                    )
                  })
                }
              </select>

              <label htmlFor='productImage' className='mt-2'>Product Image: </label>
              <label htmlFor='uploadImageInput'>
              <div className='p-2 bg-slate-200 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
                        <div className='text-slate-600 flex justify-center items-center flex-col gap-1'>
                          <span className='text-3xl'><IoIosCloudUpload/></span>
                          <p className='text-sm'>Upload Product Image</p>
                          <input type='file' id='uploadImageInput'  className='hidden' onChange={handleUploadProduct}/>
                        </div>
              </div>
              </label> 
                <div>
                  {
                    data?.productImage[0] ? (
                      <div className='flex items-center gap-2'>
                        {
                           data.productImage.map((el,index)=>{
                            return (
                              <div className='relative group'>
                                <img src={el} alt={el} 
                                width={80} height={80} 
                                className='bg-slate-200 border cursor-pointer'
                                onClick={()=> {
                                  setOpenFullScreenImage(true)
                                  setFullScreenImage(el)
                                }}/>

                                <div className='absolute bottom-0 right-0 p-1 text-black bg-red-600 rounded-full hidden group-hover:block cursor-pointer' 
                                onClick={()=> handleDeleteProductImage(index)}>
                                  <MdOutlineDeleteForever/>
                                </div>
                            </div>  
                            )
                        })
                      }
                      </div>  
                    ) : (
                      <p className='text-red-600 text-xs'>Please upload product image</p>
                    )
                  }
                </div>

                <lable htmlFor='description' className='mt-2'>Description: </lable>
                <textarea
                  className='h-28 bg-slate-200 border resize-none p-1 rounded'
                  placeholder='Enter product description'
                  rows={3}
                  onChange={handleOnChange}
                  name='description'
                  value={data.description}
                >
                </textarea>

                <lable htmlFor='price' className='mt-2'>Price: </lable>
                <input
                  className='p-2 bg-slate-200 border rounded'
                  type='number'
                  id='price'
                  placeholder='Enter price'
                  value={data.price}
                  name='price'
                  onChange={handleOnChange}
                  required
                />

                <lable htmlFor='offerPrice' className='mt-2'>Offer Price:</lable>
                <input
                  className='p-2 bg-slate-200 border rounded'
                  type='number'
                  id='offerPrice'
                  placeholder='Enter offer price'
                  value={data.offerPrice}
                  name='offerPrice'
                  onChange={handleOnChange}
                  required
                />

                <button className='px-2 py-2 bg-red-600 text-white mb-8 hover:bg-red-700 rounded'>Upload Product</button>
            </form>
        </div>
     
      {/***display image full */}

      {
        openFullScreenImage && (
          <DisplayImage onClose={()=>setOpenFullScreenImage(false)} imgUrl={fullScreenImage}/>
        )
      }
    </div>
  )
}

export default UploadProduct
