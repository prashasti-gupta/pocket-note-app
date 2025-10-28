import React, { useEffect, useMemo, useState } from 'react'
import { loadData, saveData } from './storage.js'
import { NotesPane } from './components/NotesPane.jsx'
import { Sidebar } from './components/Sidebar.jsx'

const STORAGE_KEY = 'pocketnote:data:v1'

export default function App() {
  const [data, setData] = useState(() =>
    loadData(STORAGE_KEY, { groups: [], notes: [] })
  )
  const [selectedGroupId, setSelectedGroupId] = useState(() => {
    const first = data.groups[0]?.id
    return first ?? null
  })

  useEffect(() => {
    saveData(STORAGE_KEY, data)
  }, [data])

  const groups = data.groups
  const notes = useMemo(() => {
    if (!selectedGroupId) return []
    return data.notes.filter((n) => n.groupId === selectedGroupId).sort((a, b) => b.createdAt - a.createdAt)
  }, [data.notes, selectedGroupId])
  const activeGroup = useMemo(() => groups.find(g => g.id === selectedGroupId) || null, [groups, selectedGroupId])

  function addGroup(name, color) {
    const id = crypto.randomUUID()
    const group = { id, name: name.trim(), color }
    setData((d) => ({ ...d, groups: [...d.groups, group] }))
    setSelectedGroupId(id)
  }

  function deleteGroup(groupId) {
    setData((d) => ({
      ...d,
      groups: d.groups.filter((g) => g.id !== groupId),
      notes: d.notes.filter((n) => n.groupId !== groupId),
    }))
    setSelectedGroupId((cur) => (cur === groupId ? null : cur))
  }

  function addNote(text) {
    if (!selectedGroupId) return
    const now = Date.now()
    const note = { id: crypto.randomUUID(), groupId: selectedGroupId, text, createdAt: now, lastUpdated: now }
    setData((d) => ({ ...d, notes: [note, ...d.notes] }))
  }

  function deleteNote(noteId) {
    setData((d) => ({ ...d, notes: d.notes.filter((n) => n.id !== noteId) }))
  }

  return (
    <div className="app-root">
      <Sidebar
        groups={groups}
        selectedGroupId={selectedGroupId}
        onSelect={setSelectedGroupId}
        onAddGroup={addGroup}
        onDeleteGroup={deleteGroup}
      />
      <NotesPane
        notes={notes}
        hasGroup={!!selectedGroupId}
        activeGroup={activeGroup}
        onAddNote={addNote}
        onDeleteNote={deleteNote}
      />
    </div>
  )
}


