export const products = [
  {
    id: '742e3d03-2a1f-458f-bc57-0eadc8a5ebe7',
    name: 'Chocochip',
    description: 'A soft, chewy classic with generous chocolate chips in every bite.',
    price: {
      fiftyGrams: 50,
      hundredGrams: 100
    },
    src: 'Cookie images/chocochip.png'
  }, {
    id: '0f422e5c-11f6-4012-95a4-43bdeb4ef756',
    name: "Campfire's Smores",
    description: 'A campfire-inspired cookie with chocolatey sweetness and a hint of toasted marshmallow.',
    price: {
      fiftyGrams: 55,
      hundredGrams: 115 
    },
    src: 'Cookie images/smores.png'
  }, {
    id: '1a2ddad0-ab1d-417d-aad6-10d60e037db0',
    name: 'Biscoff Crunch',
    description: 'A warmly spiced, Biscoff-inspired treat with a satisfying cookie crunch.',
    price: {
      fiftyGrams: 60,
      hundredGrams: 120 
    },
    src: 'Cookie images/biscoff.png'
  }, {
    id: 'b5fe54e8-a94c-4227-93ee-28859e6e96da',
    name: 'Oreo Cheesecake',
    description: 'A cheesecake-inspired cookie pairing creamy sweetness with Oreo-style chocolate-cookie flavor.',
    price: {
      fiftyGrams: 60,
      hundredGrams: 120  
    },
    src: 'Cookie images/oreo.png'
  }, {
    id: '65fa4b19-6801-4f3c-987f-2a15671bca59',
    name: 'Nutella Stuffed',
    description: 'A soft cookie filled with a rich, chocolate-hazelnut Nutella center.',
    price: {
      fiftyGrams: 60,
      hundredGrams: 120 
    },
    src: 'Cookie images/nutella.png'
  }, {
    id: 'faa7fea2-9a38-401a-80c0-6493129209c5',
    name: 'Oatmeal',
    description: 'A hearty, chewy oatmeal cookie with a comforting, gently sweet flavor.',
    price: {
      fiftyGrams: 55,
      hundredGrams: 110 
    },
    src: 'Cookie images/oatmeal.png'
  }
]

export function checkMatchingProduct(productId) {
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  })

  return matchingProduct;
}