import React from 'react'

interface MiniProductProps {
    productImage: string;
    productName: string;
    quantity: number;
    productPrice: number
}

function ProductComponent({ productImage, productName, quantity, productPrice }: MiniProductProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '10px', marginBottom: '10px' }}>
        <div><img style={{ width: '75px', height: '75px'}} src={`${import.meta.env.VITE_BACKEND_API}${productImage}`}/></div>
        <div style={{ marginLeft: '20px' }}>
            <div style={{
                      width: '250px',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      WebkitLineClamp: 3,
                      textOverflow: 'ellipsis',
            }}>{ productName }</div>
            <div>{ quantity } x {productPrice}</div>
        </div>
    </div>
  )
}

export default ProductComponent