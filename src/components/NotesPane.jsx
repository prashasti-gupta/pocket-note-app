import React, { useMemo, useState } from 'react'
const img = '/main_img.png'

export function NotesPane({ notes, hasGroup, onAddNote, onDeleteNote, activeGroup }) {
  const [text, setText] = useState('')
  const canAdd = useMemo(() => text.trim().length > 0, [text])

  function add() {
    if (!canAdd) return
    onAddNote(text.trim())
    setText('')
  }

  function getInitials(name) {
    const words = String(name || '').trim().split(/\s+/).filter(Boolean)
    if (words.length === 0) return ''
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
    return (words[0][0] + words[1][0]).toUpperCase()
  }

  return (
    <section className="notes-pane">
      <div className="notes-header">
        {activeGroup ? (
          <div className="header-container">
            <div className="header-group">
              <span className="header-avatar" style={{ background: activeGroup.color || '#e2e8f0' }}>{getInitials(activeGroup.name)}</span>
              <div className="title">{activeGroup.name}</div>
            </div>
          </div>
        ) : (
          <div className="title">No group selected</div>
        )}
      </div>

      {(!hasGroup || notes.length === 0) ? (
        <div className="empty-notes">
          <img className="hero" src={img} alt="No notes" />
          <p className="empty-text">Send and receive messages without keeping your phone online. Use Pocket Notes on upto 4 linked devices and 1 mobile phone</p>
          <div className="footer-lock">🔒 end-to-end-encrypted</div>
        </div>
      ) : (
        <ul className="notes-list">
          {notes.map((n) => (
            <li key={n.id} className="note">
              <div className="note-meta">
                <time dateTime={new Date(n.createdAt).toISOString()}>
                  {new Date(n.createdAt).toLocaleString()}
                </time>
                <button className="link" onClick={() => onDeleteNote(n.id)} title="Delete note">Delete</button>
              </div>
              <p className="note-text">{n.text}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="composer-bottom">
        <div className="input-wrap">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                add()
              }
            }}
            placeholder={hasGroup ? 'Enter you text here....' : 'Create or select a group to add notes'}
            disabled={!hasGroup}
            rows={1}
          />
          <button className={`arrow ${canAdd && hasGroup ? 'active' : ''}`} onClick={add} disabled={!hasGroup || !canAdd} aria-label="Send">
            →
          </button>
        </div>
      </div>
    </section>
  )
}



