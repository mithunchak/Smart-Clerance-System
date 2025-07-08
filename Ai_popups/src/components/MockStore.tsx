import { useState } from 'react'
import { ShoppingCart, Eye, Zap, ArrowLeft } from 'lucide-react'
import { usePopup } from '../contexts/PopupContext'
import { useCart } from '../contexts/CartContext'

const CATEGORIES = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Gadgets, devices, and tech accessories',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    itemCount: 15
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Fashion and apparel for all occasions',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    itemCount: 15
  },
  {
    id: 'home',
    name: 'Home & Garden',
    description: 'Furniture, decor, and home essentials',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    itemCount: 15
  },
  {
    id: 'fitness',
    name: 'Fitness',
    description: 'Exercise equipment and sports gear',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    itemCount: 15
  },
  {
    id: 'office',
    name: 'Office',
    description: 'Work supplies and office equipment',
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
    itemCount: 15
  }
]

const CATEGORY_PRODUCTS: Record<string, any[]> = {
  electronics: [
    {
      id: 'e1',
      name: 'Bluetooth Wireless Headphones',
      price: 45.99,
      originalPrice: 89.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      description: 'Premium wireless headphones with noise cancellation',
      isClearance: true
    },
    {
      id: 'e2',
      name: 'Wireless Phone Charger',
      price: 37.99,
      originalPrice: 39.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
      description: 'Fast wireless charging pad for smartphones',
      isClearance: false
    },
    {
      id: 'e3',
      name: 'Bluetooth Speaker',
      price: 56.99,
      originalPrice: 59.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
      description: 'Portable Bluetooth speaker with 12-hour battery',
      isClearance: false
    },
    {
      id: 'e4',
      name: 'Smartphone Case',
      price: 23.99,
      originalPrice: 24.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400',
      description: 'Protective phone case with screen protector',
      isClearance: false
    },
    {
      id: 'e5',
      name: 'USB-C Hub',
      price: 47.99,
      originalPrice: 49.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1591290619675-2c5b7c7e8c7d?w=400',
      description: 'Multi-port USB-C hub with HDMI and ethernet',
      isClearance: false
    },
    {
      id: 'e6',
      name: 'Wireless Earbuds',
      price: 76.99,
      originalPrice: 79.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
      description: 'True wireless earbuds with charging case',
      isClearance: false
    },
    {
      id: 'e7',
      name: 'Smart Watch',
      price: 99.99,
      originalPrice: 199.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      description: 'Fitness tracking smartwatch with heart rate monitor',
      isClearance: true
    },
    {
      id: 'e8',
      name: 'Portable Power Bank',
      price: 33.99,
      originalPrice: 34.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1609592094137-3c3df4e4b451?w=400',
      description: '10000mAh portable power bank with fast charging',
      isClearance: false
    },
    {
      id: 'e9',
      name: 'Gaming Mouse',
      price: 67.99,
      originalPrice: 69.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?w=400',
      description: 'RGB gaming mouse with programmable buttons',
      isClearance: false
    },
    {
      id: 'e10',
      name: 'Webcam HD',
      price: 43.99,
      originalPrice: 44.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
      description: '1080p HD webcam with auto-focus',
      isClearance: false
    },
    {
      id: 'e11',
      name: 'Tablet Stand',
      price: 28.99,
      originalPrice: 29.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
      description: 'Adjustable tablet stand for desk use',
      isClearance: false
    },
    {
      id: 'e12',
      name: 'Car Phone Mount',
      price: 19.49,
      originalPrice: 19.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400',
      description: 'Magnetic car phone mount for dashboard',
      isClearance: false
    },
    {
      id: 'e13',
      name: 'Wireless Keyboard',
      price: 53.99,
      originalPrice: 54.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
      description: 'Compact wireless keyboard with numeric keypad',
      isClearance: false
    },
    {
      id: 'e14',
      name: 'Phone Ring Holder',
      price: 12.49,
      originalPrice: 12.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400',
      description: '360-degree rotating phone ring holder',
      isClearance: false
    },
    {
      id: 'e15',
      name: 'LED Strip Lights',
      price: 38.99,
      originalPrice: 39.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      description: 'RGB LED strip lights with remote control',
      isClearance: false
    }
  ],
  clothing: [
    {
      id: 'c1',
      name: 'Organic Cotton T-Shirt',
      price: 19.99,
      originalPrice: 29.99,
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      description: 'Soft organic cotton t-shirt in classic fit',
      isClearance: true
    },
    {
      id: 'c2',
      name: 'Denim Jacket',
      price: 57.99,
      originalPrice: 59.99,
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400',
      description: 'Classic denim jacket with vintage wash',
      isClearance: false
    },
    {
      id: 'c3',
      name: 'Summer Dress',
      price: 44.99,
      originalPrice: 49.99,
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
      description: 'Floral summer dress with adjustable straps',
      isClearance: false
    },
    {
      id: 'c4',
      name: 'Casual Sneakers',
      price: 77.99,
      originalPrice: 79.99,
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
      description: 'Comfortable casual sneakers for everyday wear',
      isClearance: false
    },
    {
      id: 'c5',
      name: 'Winter Scarf',
      price: 23.99,
      originalPrice: 24.99,
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400',
      description: 'Warm knitted scarf in multiple colors',
      isClearance: false
    },
    {
      id: 'c6',
      name: 'Baseball Cap',
      price: 19.49,
      originalPrice: 19.99,
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
      description: 'Adjustable baseball cap with embroidered logo',
      isClearance: false
    },
    {
      id: 'c7',
      name: 'Hoodie Sweatshirt',
      price: 43.99,
      originalPrice: 44.99,
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
      description: 'Cozy hoodie sweatshirt with front pocket',
      isClearance: false
    },
    {
      id: 'c8',
      name: 'Business Shirt',
      price: 33.99,
      originalPrice: 34.99,
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
      description: 'Professional button-down shirt for work',
      isClearance: false
    },
    {
      id: 'c9',
      name: 'Yoga Leggings',
      price: 38.99,
      originalPrice: 39.99,
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1506629905877-4d28e2acd4f3?w=400',
      description: 'High-waisted yoga leggings with side pockets',
      isClearance: false
    },
    {
      id: 'c10',
      name: 'Leather Belt',
      price: 28.99,
      originalPrice: 29.99,
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      description: 'Genuine leather belt with metal buckle',
      isClearance: false
    },
    {
      id: 'c11',
      name: 'Polo Shirt',
      price: 32.49,
      originalPrice: 32.99,
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
      description: 'Classic polo shirt in multiple colors',
      isClearance: false
    },
    {
      id: 'c12',
      name: 'Athletic Shorts',
      price: 26.49,
      originalPrice: 26.99,
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1506629905877-4d28e2acd4f3?w=400',
      description: 'Moisture-wicking athletic shorts with drawstring',
      isClearance: false
    },
    {
      id: 'c13',
      name: 'Flannel Shirt',
      price: 36.49,
      originalPrice: 36.99,
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
      description: 'Comfortable flannel shirt in plaid pattern',
      isClearance: false
    },
    {
      id: 'c14',
      name: 'Knit Beanie',
      price: 16.49,
      originalPrice: 16.99,
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400',
      description: 'Warm knit beanie in solid colors',
      isClearance: false
    },
    {
      id: 'c15',
      name: 'Cargo Pants',
      price: 42.49,
      originalPrice: 42.99,
      category: 'clothing',
      image: 'https://images.unsplash.com/photo-1506629905877-4d28e2acd4f3?w=400',
      description: 'Durable cargo pants with multiple pockets',
      isClearance: false
    }
  ],
  home: [
    {
      id: 'h1',
      name: 'Ceramic Coffee Mug Set',
      price: 12.99,
      originalPrice: 24.99,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400',
      description: 'Handcrafted ceramic mugs, set of 4',
      isClearance: true
    },
    {
      id: 'h2',
      name: 'Decorative Plant Pot',
      price: 18.49,
      originalPrice: 18.99,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400',
      description: 'Ceramic plant pot with drainage holes',
      isClearance: false
    },
    {
      id: 'h3',
      name: 'Throw Pillow Set',
      price: 31.99,
      originalPrice: 34.99,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      description: 'Decorative throw pillows, set of 2',
      isClearance: false
    },
    {
      id: 'h4',
      name: 'Picture Frame Set',
      price: 28.99,
      originalPrice: 29.99,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400',
      description: 'Wooden picture frames, set of 3 different sizes',
      isClearance: false
    },
    {
      id: 'h5',
      name: 'Candle Set',
      price: 22.49,
      originalPrice: 22.99,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1602874801006-36d8ac8bfb2e?w=400',
      description: 'Scented candles in glass jars, set of 3',
      isClearance: false
    },
    {
      id: 'h6',
      name: 'Kitchen Knife Set',
      price: 77.99,
      originalPrice: 79.99,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1594736797933-d0408cbf7a6c?w=400',
      description: 'Professional kitchen knife set with wooden block',
      isClearance: false
    },
    {
      id: 'h7',
      name: 'Bathroom Towel Set',
      price: 48.99,
      originalPrice: 49.99,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
      description: 'Soft cotton towel set with bath and hand towels',
      isClearance: false
    },
    {
      id: 'h8',
      name: 'Wall Clock',
      price: 32.49,
      originalPrice: 32.99,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400',
      description: 'Modern wall clock with silent movement',
      isClearance: false
    },
    {
      id: 'h9',
      name: 'Storage Baskets',
      price: 38.99,
      originalPrice: 39.99,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      description: 'Woven storage baskets, set of 2',
      isClearance: false
    },
    {
      id: 'h10',
      name: 'Table Lamp',
      price: 43.99,
      originalPrice: 44.99,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      description: 'Modern table lamp with fabric shade',
      isClearance: false
    },
    {
      id: 'h11',
      name: 'Cutting Board Set',
      price: 26.49,
      originalPrice: 26.99,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1594736797933-d0408cbf7a6c?w=400',
      description: 'Bamboo cutting boards, set of 3 sizes',
      isClearance: false
    },
    {
      id: 'h12',
      name: 'Shower Curtain',
      price: 19.49,
      originalPrice: 19.99,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
      description: 'Waterproof shower curtain with hooks',
      isClearance: false
    },
    {
      id: 'h13',
      name: 'Bookshelf',
      price: 87.99,
      originalPrice: 89.99,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      description: '5-tier wooden bookshelf for home office',
      isClearance: false
    },
    {
      id: 'h14',
      name: 'Area Rug',
      price: 68.99,
      originalPrice: 69.99,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      description: 'Modern geometric area rug for living room',
      isClearance: false
    },
    {
      id: 'h15',
      name: 'Spice Rack',
      price: 31.49,
      originalPrice: 31.99,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1594736797933-d0408cbf7a6c?w=400',
      description: 'Rotating spice rack with 16 jars',
      isClearance: false
    }
  ],
  fitness: [
    {
      id: 'f1',
      name: 'Yoga Mat Premium',
      price: 24.99,
      originalPrice: 49.99,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400',
      description: 'Non-slip premium yoga mat with carrying strap',
      isClearance: true
    },
    {
      id: 'f2',
      name: 'Resistance Bands Set',
      price: 25.49,
      originalPrice: 25.99,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'Complete resistance bands set for home workouts',
      isClearance: false
    },
    {
      id: 'f3',
      name: 'Dumbbells Set',
      price: 78.99,
      originalPrice: 79.99,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'Adjustable dumbbells set, 5-25 lbs each',
      isClearance: false
    },
    {
      id: 'f4',
      name: 'Foam Roller',
      price: 34.49,
      originalPrice: 34.99,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'High-density foam roller for muscle recovery',
      isClearance: false
    },
    {
      id: 'f5',
      name: 'Water Bottle',
      price: 19.49,
      originalPrice: 19.99,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'Insulated stainless steel water bottle',
      isClearance: false
    },
    {
      id: 'f6',
      name: 'Jump Rope',
      price: 16.49,
      originalPrice: 16.99,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'Adjustable jump rope with comfortable handles',
      isClearance: false
    },
    {
      id: 'f7',
      name: 'Kettlebell',
      price: 44.49,
      originalPrice: 44.99,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'Cast iron kettlebell, 20 lbs',
      isClearance: false
    },
    {
      id: 'f8',
      name: 'Exercise Ball',
      price: 29.49,
      originalPrice: 29.99,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'Anti-burst exercise ball with pump',
      isClearance: false
    },
    {
      id: 'f9',
      name: 'Fitness Tracker',
      price: 44.99,
      originalPrice: 89.99,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'Waterproof fitness tracker with heart rate monitor',
      isClearance: true
    },
    {
      id: 'f10',
      name: 'Yoga Blocks',
      price: 22.49,
      originalPrice: 22.99,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400',
      description: 'High-density foam yoga blocks, set of 2',
      isClearance: false
    },
    {
      id: 'f11',
      name: 'Gym Bag',
      price: 38.99,
      originalPrice: 39.99,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'Durable gym bag with multiple compartments',
      isClearance: false
    },
    {
      id: 'f12',
      name: 'Resistance Loop Bands',
      price: 18.49,
      originalPrice: 18.99,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'Mini resistance loop bands, set of 5',
      isClearance: false
    },
    {
      id: 'f13',
      name: 'Workout Gloves',
      price: 24.49,
      originalPrice: 24.99,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'Padded workout gloves with wrist support',
      isClearance: false
    },
    {
      id: 'f14',
      name: 'Balance Board',
      price: 32.49,
      originalPrice: 32.99,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'Wooden balance board for core training',
      isClearance: false
    },
    {
      id: 'f15',
      name: 'Massage Ball',
      price: 14.49,
      originalPrice: 14.99,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'Textured massage ball for trigger point therapy',
      isClearance: false
    }
  ],
  office: [
    {
      id: 'o1',
      name: 'LED Desk Lamp',
      price: 17.99,
      originalPrice: 34.99,
      category: 'office',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      description: 'Adjustable LED desk lamp with USB charging port',
      isClearance: true
    },
    {
      id: 'o2',
      name: 'Wireless Mouse',
      price: 22.49,
      originalPrice: 22.99,
      category: 'office',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
      description: 'Ergonomic wireless mouse with long battery life',
      isClearance: false
    },
    {
      id: 'o3',
      name: 'Desk Organizer',
      price: 26.49,
      originalPrice: 26.99,
      category: 'office',
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
      description: 'Bamboo desk organizer with multiple compartments',
      isClearance: false
    },
    {
      id: 'o4',
      name: 'Office Chair Cushion',
      price: 38.99,
      originalPrice: 39.99,
      category: 'office',
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
      description: 'Memory foam office chair cushion for comfort',
      isClearance: false
    },
    {
      id: 'o5',
      name: 'Notebook Set',
      price: 18.49,
      originalPrice: 18.99,
      category: 'office',
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
      description: 'Lined notebooks with hardcover, set of 3',
      isClearance: false
    },
    {
      id: 'o6',
      name: 'Stapler',
      price: 15.49,
      originalPrice: 15.99,
      category: 'office',
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
      description: 'Heavy-duty stapler with staple remover',
      isClearance: false
    },
    {
      id: 'o7',
      name: 'Monitor Stand',
      price: 24.99,
      originalPrice: 49.99,
      category: 'office',
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
      description: 'Adjustable monitor stand with storage drawer',
      isClearance: true
    },
    {
      id: 'o8',
      name: 'Pen Set',
      price: 24.49,
      originalPrice: 24.99,
      category: 'office',
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
      description: 'Professional pen set with case',
      isClearance: false
    },
    {
      id: 'o9',
      name: 'File Folders',
      price: 12.49,
      originalPrice: 12.99,
      category: 'office',
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
      description: 'Manila file folders, pack of 25',
      isClearance: false
    },
    {
      id: 'o10',
      name: 'Desk Calendar',
      price: 19.49,
      originalPrice: 19.99,
      category: 'office',
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
      description: '2024 desk calendar with monthly pages',
      isClearance: false
    },
    {
      id: 'o11',
      name: 'Paper Shredder',
      price: 78.99,
      originalPrice: 79.99,
      category: 'office',
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
      description: 'Cross-cut paper shredder for home office',
      isClearance: false
    },
    {
      id: 'o12',
      name: 'Whiteboard',
      price: 32.49,
      originalPrice: 32.99,
      category: 'office',
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
      description: 'Magnetic whiteboard with markers and eraser',
      isClearance: false
    },
    {
      id: 'o13',
      name: 'Desk Pad',
      price: 22.49,
      originalPrice: 22.99,
      category: 'office',
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
      description: 'Large desk pad with non-slip base',
      isClearance: false
    },
    {
      id: 'o14',
      name: 'Label Maker',
      price: 44.49,
      originalPrice: 44.99,
      category: 'office',
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
      description: 'Portable label maker with various tape colors',
      isClearance: false
    },
    {
      id: 'o15',
      name: 'Bookends',
      price: 16.49,
      originalPrice: 16.99,
      category: 'office',
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
      description: 'Metal bookends with non-slip base, set of 2',
      isClearance: false
    }
  ]
}

export function MockStore() {
  const { showPopup, updateUserProfile, userProfile, popupsDisabled, enablePopups } = usePopup()
  const { addToCart } = useCart()
  const [viewedItems, setViewedItems] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleCategoryView = (categoryId: string) => {
    setSelectedCategory(categoryId)
    
    // Update user browsing history
    const newHistory = [...userProfile.browsing_history]
    if (!newHistory.includes(categoryId)) {
      newHistory.push(categoryId)
    }
    
    updateUserProfile({
      browsing_history: newHistory
    })

    // Trigger popup after viewing category with 70% chance
    setTimeout(() => {
      if (Math.random() < 0.7) {
        console.log(`Triggering popup for category: ${categoryId}`)
        showPopup(categoryId) // Pass category to popup
      }
    }, 2000) // 2 second delay
  }

  const handleProductView = (product: any) => {
    // Track product view
    if (!viewedItems.has(product.id)) {
      setViewedItems(prev => new Set([...prev, product.id]))
    }
  }

  const handleTriggerPopup = () => {
    console.log('Manual popup trigger clicked')
    showPopup(selectedCategory || undefined)
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
  }

  return (
    <div className="mock-store no-scrollbar">
      <div className="store-header">
        <h1>Walmart Store</h1>
        {selectedCategory ? (
          <div>
            <button 
              onClick={handleBackToCategories}
              className="back-btn"
            >
              <ArrowLeft size={16} />
              Back to Categories
            </button>
            <p>Browse {CATEGORIES.find(c => c.id === selectedCategory)?.name} products and experience smart clearance pop-ups!</p>
          </div>
        ) : (
          <p>Browse our categories and experience smart clearance pop-ups!</p>
        )}
        
        <div className="store-actions">
          <button 
            onClick={handleTriggerPopup}
            className="trigger-popup-btn"
            disabled={popupsDisabled}
          >
            <Zap size={16} />
            {popupsDisabled ? 'Popups Disabled' : 'Trigger Smart Popup'}
          </button>
          
          {popupsDisabled && (
            <button 
              onClick={enablePopups}
              className="enable-popups-btn"
              title="Re-enable smart popups"
            >
              Enable Popups
            </button>
          )}
          
          <div className="user-stats">
            <span>Categories browsed: {userProfile.browsing_history.length}</span>
            <span>Items viewed: {viewedItems.size}</span>
            {popupsDisabled && (
              <span className="popup-status disabled">Popups: Disabled</span>
            )}
          </div>
        </div>
      </div>

      {selectedCategory ? (
        // Show products in selected category
        <div className="products-grid">
          {CATEGORY_PRODUCTS[selectedCategory]?.map(product => (
            <div 
              key={product.id} 
              className={`product-card ${product.isClearance ? 'clearance-item' : ''}`}
              onClick={() => handleProductView(product)}
            >
              <div className="product-image">
                <img 
                  src={product.image} 
                  alt={product.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder.jpg'
                  }}
                />
                {viewedItems.has(product.id) && (
                  <div className="viewed-badge">
                    <Eye size={14} />
                  </div>
                )}
                {product.isClearance && (
                  <div className="clearance-badge">
                    CLEARANCE
                  </div>
                )}
                <div className="discount-badge">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </div>
              </div>
              
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <div className="product-price">
                  <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                  <span className="current-price">${product.price.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                className="add-to-cart"
                onClick={(e) => {
                  e.stopPropagation()
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    discount: Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100),
                    quantity: 1,
                    image_url: product.image,
                    category: product.category
                  })
                  alert(`Added ${product.name} to cart!`)
                }}
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        // Show categories
        <div className="categories-grid">
          {CATEGORIES.map(category => (
            <div 
              key={category.id} 
              className="category-card"
              onClick={() => handleCategoryView(category.id)}
            >
              <div className="category-image">
                <img 
                  src={category.image} 
                  alt={category.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder.jpg'
                  }}
                />
                <div className="category-overlay">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span className="item-count">{category.itemCount} clearance items</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="browsing-tip">
        <p>💡 <strong>Tip:</strong> {selectedCategory ? 'Browse products to see personalized clearance pop-ups!' : 'Click on a category to see personalized clearance pop-ups based on your interests!'}</p>
      </div>
    </div>
  )
}
