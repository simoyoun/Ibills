import React, { useState, useEffect } from 'react'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../auth/firebase'

interface Sale {
  id?: string
  date: string
  items: {
    id: string
    name: string
    quantity: number
    price: number
  }[]
  total: number
  customer: string
}

export function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [newSale, setNewSale] = useState<Omit<Sale, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    items: [],
    total: 0,
    customer: ''
  })

  useEffect(() => {
    const fetchSales = async () => {
      const querySnapshot = await getDocs(collection(db, 'sales'))
      const salesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Sale[]
      setSales(salesData)
    }
    fetchSales()
  }, [])

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const docRef = await addDoc(collection(db, 'sales'), newSale)
      setSales([...sales, { ...newSale, id: docRef.id }])
      setNewSale({
        date: new Date().toISOString().split('T')[0],
        items: [],
        total: 0,
        customer: ''
      })
    } catch (error) {
      console.error('Error adding sale: ', error)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sales Tracking</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Record New Sale</h2>
          <form onSubmit={handleAddSale}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={newSale.date}
                onChange={(e) => setNewSale({...newSale, date: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Customer</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={newSale.customer}
                onChange={(e) => setNewSale({...newSale, customer: e.target.value})}
                required
              />
            </div>
            {/* TODO: Add item selection functionality */}
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Record Sale
            </button>
          </form>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Sales</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Items</th>
                  <th className="text-left p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-b">
                    <td className="p-2">{sale.date}</td>
                    <td className="p-2">{sale.customer}</td>
                    <td className="p-2">{sale.items.length}</td>
                    <td className="p-2">${sale.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
