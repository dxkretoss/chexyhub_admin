/**
 * Initial Orders for CHEXY HUB Admin
 */
export const INITIAL_ORDERS = [
  {
    id: 'CHX-98241',
    createdAt: '2026-11-17T14:32:00Z',
    customer: {
      name: 'Aarav Mehta',
      email: 'aarav.mehta@example.com',
      phone: '+91 98200 12345',
      address: 'Flat 402, Sea Green Heights, Worli, Mumbai, MH 400018'
    },
    items: [
      {
        id: 'men-01',
        name: 'Royal Highland Tartan Oxford Shirt',
        price: 2499,
        quantity: 1,
        size: 'L',
        color: 'Navy & Crimson',
        thumbnail: 'https://images.unsplash.com/photo-1623162905251-e98a25a45a67?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'women-01',
        name: 'Parisian Oversized Check Boyfriend Shirt',
        price: 2399,
        quantity: 1,
        size: 'M',
        color: 'Terracotta & Ivory',
        thumbnail: 'https://images.unsplash.com/photo-1610886886310-be2828d6afd5?auto=format&fit=crop&w=300&q=80'
      }
    ],
    status: 'In Transit',
    subtotal: 4898,
    discount: 500,
    shippingFee: 0,
    total: 4398,
    paymentMethod: 'Prepaid (Razorpay UPI)',
    courier: 'BlueDart Air Express',
    trackingNumber: 'BLU-IND-984210',
    notes: 'Please call recipient prior to delivery.'
  },
  {
    id: 'CHX-98242',
    createdAt: '2026-11-18T09:15:00Z',
    customer: {
      name: 'Ananya Sharma',
      email: 'ananya.sharma@example.com',
      phone: '+91 98111 88442',
      address: 'Villa 14, Magnolia Gardens, Whitefield, Bengaluru, KA 560066'
    },
    items: [
      {
        id: 'women-02',
        name: 'Provençal Pastel Gingham Cropped Blouse',
        price: 1999,
        quantity: 2,
        size: 'S',
        color: 'Lavender & Cream',
        thumbnail: 'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=300&q=80'
      }
    ],
    status: 'Processing',
    subtotal: 3998,
    discount: 0,
    shippingFee: 0,
    total: 3998,
    paymentMethod: 'Prepaid (HDFC NetBanking)',
    courier: 'Delhivery Surface',
    trackingNumber: 'DEL-992144',
    notes: 'Gift wrap requested.'
  },
  {
    id: 'CHX-98243',
    createdAt: '2026-11-18T11:45:00Z',
    customer: {
      name: 'Kabir Singhania',
      email: 'kabir.s@example.com',
      phone: '+91 99887 66554',
      address: 'Penthouse 8, The Camellias, Golf Course Road, Gurugram, HR 122002'
    },
    items: [
      {
        id: 'family-01',
        name: 'Matching Royal Tartan Trio Set',
        price: 5499,
        quantity: 1,
        size: 'Custom Sizing',
        color: 'Royal Scottish Clan',
        thumbnail: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=300&q=80'
      }
    ],
    status: 'Pending',
    subtotal: 5499,
    discount: 549,
    shippingFee: 0,
    total: 4950,
    paymentMethod: 'Cash on Delivery (COD)',
    courier: 'Not Assigned',
    trackingNumber: '',
    notes: 'Verify phone number before dispatch.'
  },
  {
    id: 'CHX-98239',
    createdAt: '2026-11-15T18:20:00Z',
    customer: {
      name: 'Devika Patel',
      email: 'devika.patel@example.com',
      phone: '+91 97245 11223',
      address: 'B-12, Alkapuri Avenue, Vadodara, GJ 390007'
    },
    items: [
      {
        id: 'kids-01',
        name: 'Junior Tartan Explorer Snap Shirt',
        price: 1499,
        quantity: 1,
        size: '6-7Y',
        color: 'Forest Green',
        thumbnail: 'https://images.unsplash.com/photo-1627278107893-b89d828d4ff3?auto=format&fit=crop&w=300&q=80'
      }
    ],
    status: 'Delivered',
    subtotal: 1499,
    discount: 0,
    shippingFee: 150,
    total: 1649,
    paymentMethod: 'Prepaid (Google Pay)',
    courier: 'BlueDart Air Express',
    trackingNumber: 'BLU-IND-972101',
    notes: 'Delivered on 17 Nov, signed by security.'
  },
  {
    id: 'CHX-98235',
    createdAt: '2026-11-14T10:05:00Z',
    customer: {
      name: 'Rohan Deshmukh',
      email: 'rohan.d@example.com',
      phone: '+91 98670 54321',
      address: 'Rowhouse 3, Koregaon Park, Pune, MH 411001'
    },
    items: [
      {
        id: 'men-02',
        name: 'Heavyweight Lumberjack Buffalo Check',
        price: 2899,
        quantity: 1,
        size: 'XL',
        color: 'Crimson & Black',
        thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80'
      }
    ],
    status: 'Cancelled',
    subtotal: 2899,
    discount: 289,
    shippingFee: 0,
    total: 2610,
    paymentMethod: 'Prepaid (Refund Issued)',
    courier: 'N/A',
    trackingNumber: '',
    notes: 'Cancelled upon customer request before packing.'
  }
];
