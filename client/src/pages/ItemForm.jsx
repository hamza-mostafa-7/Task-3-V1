import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const defaults = { title: '', description: '', category: 'other', status: 'lost', location: '' }

export default function ItemForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      setForm(defaults)
      return
    }

    async function loadItem() {
      setError('')
      try {
        const res = await api.get(`/items/${id}`)
        const item = res.data.item ?? res.data
        setForm({
          title: item.title ?? '',
          status: item.status ?? 'lost',
          category: item.category ?? 'other',
          location: item.location ?? '',
          description: item.description ?? ''
        })
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load item')
      }
    }

    loadItem()
  }, [id])

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    const itemData = {
      title: form.title,
      status: form.status,
      category: form.category,
      location: form.location,
      description: form.description
    }

    try {
      if (id) {
        await api.patch(`/items/${id}`, itemData)
      } else {
        await api.post('/items', itemData)
      }
      nav('/items')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save item')
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">{id ? 'Edit' : 'Report'} Item</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            className="input w-full"
            value={form.title}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
          <select
            id="status"
            name="status"
            className="input w-full"
            value={form.status}
            onChange={onChange}
            required
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
            <option value="claimed">Claimed</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
          <select
            id="category"
            name="category"
            className="input w-full"
            value={form.category}
            onChange={onChange}
            required
          >
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="documents">Documents</option>
            <option value="accessories">Accessories</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">Location (optional)</label>
          <input
            id="location"
            name="location"
            type="text"
            className="input w-full"
            value={form.location}
            onChange={onChange}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description (optional)</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="input w-full"
            value={form.description}
            onChange={onChange}
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="btn" type="submit">Save</button>
      </form>
    </div>
  )
}
