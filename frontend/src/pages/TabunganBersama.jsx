import React, { useEffect, useState } from 'react'

/* ================= UI HELPERS ================= */
const Container = ({ children }) => (
  <div className="min-h-screen bg-gray-50 p-6">{children}</div>
)

const Card = ({ children, className='' }) => (
  <div className={`bg-white rounded-2xl shadow p-5 ${className}`}>{children}</div>
)

const Button = ({ children, className='' }) => (
  <button className={`bg-green-700 text-white px-4 py-2 rounded-xl ${className}`}>{children}</button>
)

const Progress = ({ value }) => (
  <div className="w-full bg-gray-200 h-2 rounded-full">
    <div className="bg-green-700 h-full rounded-full" style={{ width: `${value}%` }} />
  </div>
)

/* ================= 1. DASHBOARD ================= */
function Dashboard({ go }) {
  return (
    <Container>
      <h1 className="text-2xl font-bold mb-6">Circle Saving</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {["Rumah Impian 2025","Liburan ke Jepang","Dana Pendidikan"].map((t,i)=> (
          <Card key={i}>
            <h3 className="font-semibold">{t}</h3>
            <p className="text-sm text-gray-500">Progress 70%</p>
            <Progress value={70} />
            <p className="text-sm mt-2">Rp 20.000.000</p>
            <Button className="mt-3" onClick={()=>go('detail')}>Detail</Button>
          </Card>
        ))}
      </div>

      <Card className="mt-6 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg">Wujudkan impianmu lebih cepat</h2>
          <p className="text-sm text-gray-500">Bersama teman & keluarga</p>
          <Button className="mt-3" onClick={()=>go('create')}>+ Buat Circle Baru</Button>
        </div>
        <div className="text-5xl">🐷</div>
      </Card>
    </Container>
  )
}

/* ================= 2. CREATE ================= */
function Create({ go }) {
  return (
    <Container>
      <h1 className="text-xl font-bold mb-4">Buat Circle Baru</h1>
      <Card>
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Nama Circle" className="border p-2 rounded" />
          <input placeholder="Target Dana" className="border p-2 rounded" />
          <input type="date" className="border p-2 rounded" />
          <input placeholder="Passkey" className="border p-2 rounded" />
        </div>
        <textarea placeholder="Deskripsi" className="border p-2 rounded w-full mt-4" />
        <Button className="mt-4" onClick={()=>go('dashboard')}>Buat Circle</Button>
      </Card>
    </Container>
  )
}

/* ================= 3. DETAIL ================= */
function Detail({ go }) {
  return (
    <Container>
      <h1 className="text-xl font-bold mb-4">Detail Tabungan</h1>

      <Card>
        <h2 className="text-lg font-bold">Rp 85.000.000</h2>
        <Progress value={70} />
        <p className="text-sm text-gray-500 mt-2">70% tercapai</p>
      </Card>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {["Andi","Siska","Budi","Lina"].map((n,i)=> (
          <Card key={i}>
            <p className="font-medium">{n}</p>
            <p className="text-sm text-gray-500">Rp 10.000.000</p>
          </Card>
        ))}
      </div>

      <div className="flex gap-3 mt-4">
        <Button onClick={()=>go('setor')}>Setor Dana</Button>
        <button onClick={()=>go('history')} className="border px-4 py-2 rounded-xl">Riwayat</button>
      </div>
    </Container>
  )
}

/* ================= 4. SETOR ================= */
function Setor({ go }) {
  return (
    <Container>
      <h1 className="text-xl font-bold mb-4">Setor Dana</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <p className="text-sm text-gray-500">Progress</p>
          <Progress value={65} />
        </Card>

        <Card>
          <input placeholder="Nominal" className="border p-2 rounded w-full" />
          <input type="date" className="border p-2 rounded w-full mt-2" />
          <textarea placeholder="Catatan" className="border p-2 rounded w-full mt-2" />
          <Button className="mt-3" onClick={()=>go('detail')}>Konfirmasi</Button>
        </Card>
      </div>
    </Container>
  )
}

/* ================= 5. HISTORY ================= */
function History({ go }) {
  return (
    <Container>
      <h1 className="text-xl font-bold mb-4">Riwayat Transaksi</h1>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th>Tanggal</th>
              <th>Nama</th>
              <th>Tipe</th>
              <th>Nominal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>15 Okt</td>
              <td>Aditya</td>
              <td>Setor</td>
              <td>Rp 2.500.000</td>
              <td>Berhasil</td>
            </tr>
          </tbody>
        </table>
      </Card>

      <Button className="mt-4" onClick={()=>go('detail')}>Kembali</Button>
    </Container>
  )
}

/* ================= MAIN EXPORT ================= */
export default function TabunganBersama() {
  const [page, setPage] = useState('dashboard')

  const go = (p) => setPage(p)

  if (page === 'create') return <Create go={go} />
  if (page === 'detail') return <Detail go={go} />
  if (page === 'setor') return <Setor go={go} />
  if (page === 'history') return <History go={go} />

  return <Dashboard go={go} />
}
