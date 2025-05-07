export interface Sale {
  id: string
  userId: string
  customerId: string
  items: Array<{
    itemId: string
    quantity: number
    price: number
  }>
  total: number
  date: Date
  status: 'pending' | 'completed' | 'cancelled'
  notes?: string
}
