import React, { useMemo, useState } from 'react'

function getInitials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

const COLORS = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6']

export function Sidebar({ groups, selectedGroupId, onSelect, onAddGroup, onDeleteGroup }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [color, setColor] = useState(COLORS[0])

  const canCreate = useMemo(() => groupName.trim().length >= 2 && !groups.some(g => g.name.trim().toLowerCase() === groupName.trim().toLowerCase()), [groupName, groups])

  function createGroup() {
    if (!canCreate) return
    onAddGroup(groupName, color)
    setGroupName('')
    setColor(COLORS[0])
    setIsModalOpen(false)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header center">PocketNote</div>
      <div className="group-list">
        {groups.map((g) => (
          <button
            key={g.id}
            className={`group-item ${g.id === selectedGroupId ? 'selected' : ''}`}
            onClick={() => onSelect(g.id)}
            title={g.name}
          >
            <span className="avatar" style={{ background: g.color || '#e2e8f0' }}>{getInitials(g.name)}</span>
            <span className="name">{g.name}</span>
            <span className="spacer" />
            <span
              className="delete"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteGroup(g.id)
              }}
              aria-label="Delete group"
              title="Delete group"
            >
              ×
            </span>
          </button>
        ))}
        {groups.length === 0 && (
          <div className="empty-groups">No groups yet</div>
        )}
      </div>

      <button className="fab dark" onClick={() => setIsModalOpen(true)} aria-label="Add group">
        +
      </button>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create Group</h3>
            <input
              autoFocus
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
            />
            <div className="color-choices" aria-label="Choose color">
              {COLORS.map((c) => (
                <button key={c} type="button" className={`color-dot ${color === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setColor(c)} aria-label={`Choose color ${c}`}></button>
              ))}
            </div>
            <div className="hint">Name must be at least 2 characters and unique.</div>
            <div className="modal-actions">
              <button className="secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button disabled={!canCreate} onClick={createGroup}>Create</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}



