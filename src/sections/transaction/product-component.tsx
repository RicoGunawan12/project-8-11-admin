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
        <div><img width={75} height={75} src={`${import.meta.env.VITE_BACKEND_API}${productImage}`}/></div>
        <div style={{ marginLeft: '20px' }}>
            <div>{ productName }</div>
            <div>{ quantity } x {productPrice}</div>
        </div>
    </div>
  )
}

export default ProductComponent