// utils/chartTransformers.js

/**
 * Transform chart data dari format API ke format yang diharapkan MonthlyTrendChart
 * API format: [{ tanggal, tipe, total }]
 * Target format: [{ bulan, income, expense }]
 */
export function transformChartData(apiChartData, transactions = []) {
  // Jika API mengembalikan data dalam format yang sudah benar
  if (apiChartData && apiChartData.length > 0 && apiChartData[0].bulan !== undefined) {
    return apiChartData
  }
  
  // Jika API mengembalikan data flat per transaksi
  if (apiChartData && apiChartData.length > 0 && apiChartData[0].tipe !== undefined) {
    const monthlyMap = new Map()
    
    apiChartData.forEach(item => {
      const date = new Date(item.tanggal)
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
      const monthName = date.toLocaleDateString('id-ID', { month: 'short' })
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { bulan: monthName, income: 0, expense: 0 })
      }
      
      const data = monthlyMap.get(monthKey)
      const total = parseFloat(item.total)
      
      if (item.tipe === 'income') {
        data.income += total
      } else if (item.tipe === 'expense') {
        data.expense += total
      }
    })
    
    // Urutkan berdasarkan bulan
    const result = Array.from(monthlyMap.values())
    console.log('[Transform] chartData result:', result)
    return result
  }
  
  // Fallback: hitung dari transaksi
  if (transactions.length > 0) {
    return calculateChartFromTransactions(transactions)
  }
  
  return []
}

/**
 * Transform pie data dari format API ke format yang diharapkan ExpenseDonutChart
 * API format: [{ tipe, total }] atau [{ name, value }]
 * Target format: [{ name, value }]
 */
export function transformPieData(apiPieData, transactions = []) {
  // Jika API mengembalikan data dalam format yang sudah benar (ada name)
  if (apiPieData && apiPieData.length > 0 && apiPieData[0].name !== undefined) {
    return apiPieData
  }
  
  // Jika API mengembalikan data dengan format { tipe, total }
  if (apiPieData && apiPieData.length > 0 && apiPieData[0].tipe !== undefined) {
    // Filter hanya pengeluaran untuk donut chart
    const expenses = apiPieData.filter(item => item.tipe === 'expense')
    const totalExpense = expenses.reduce((sum, item) => sum + parseFloat(item.total), 0)
    
    if (totalExpense === 0) return []
    
    // Karena API hanya return income/expense total, kita perlu breakdown per kategori dari transaksi
    if (transactions.length > 0) {
      return calculatePieFromTransactions(transactions)
    }
    
    // Fallback: tampilkan sebagai "Pengeluaran Lainnya"
    return [{
      name: 'Pengeluaran',
      value: totalExpense
    }]
  }
  
  // Fallback: hitung dari transaksi
  if (transactions.length > 0) {
    return calculatePieFromTransactions(transactions)
  }
  
  return []
}

/**
 * Hitung chartData dari daftar transaksi (fallback)
 */
function calculateChartFromTransactions(transactions) {
  const monthlyMap = new Map()
  
  transactions.forEach(t => {
    const date = new Date(t.tanggal)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    const monthName = date.toLocaleDateString('id-ID', { month: 'short' })
    
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { bulan: monthName, income: 0, expense: 0 })
    }
    
    const data = monthlyMap.get(monthKey)
    const nominal = parseFloat(t.nominal) || 0
    
    if (t.tipe === 'income') {
      data.income += nominal
    } else {
      data.expense += nominal
    }
  })
  
  return Array.from(monthlyMap.values()).slice(-6)
}

/**
 * Hitung pieData dari daftar transaksi (fallback)
 */
function calculatePieFromTransactions(transactions) {
  const categoryMap = new Map()
  const categoryColors = {
    makanan: '#F59E0B',
    transport: '#10B981',
    belanja: '#8B5CF6',
    tagihan: '#3B82F6',
    hiburan: '#EF4444',
    pemasukan: '#22C55E',
    lainnya: '#9CA3AF'
  }
  
  // Filter hanya pengeluaran
  transactions.forEach(t => {
    if (t.tipe === 'expense') {
      const cat = t.kategori || 'lainnya'
      const nominal = parseFloat(t.nominal) || 0
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + nominal)
    }
  })
  
  // Konversi ke array dan urutkan dari terbesar ke terkecil
  const result = Array.from(categoryMap.entries())
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }))
    .sort((a, b) => b.value - a.value)
  
  console.log('[Transform] pieData from transactions:', result)
  return result
}

// Export color mapping untuk konsistensi
export const CATEGORY_COLORS = {
  makanan: '#F59E0B',
  transport: '#10B981',
  belanja: '#8B5CF6',
  tagihan: '#3B82F6',
  hiburan: '#EF4444',
  pemasukan: '#22C55E',
  lainnya: '#9CA3AF'
}