import { useState } from 'react'

const GroupList = ({
  groups,
  activeGroupId,
  onSelect,
  onCreateGroup,
  onJoinGroup,
  disabled,
}) => {
  const [groupName, setGroupName] = useState('')
  const [joinLink, setJoinLink] = useState('')

  const handleCreate = (event) => {
    event.preventDefault()
    if (!groupName.trim()) return
    onCreateGroup(groupName.trim())
    setGroupName('')
  }

  const handleJoin = (event) => {
    event.preventDefault()
    if (!joinLink.trim()) return
    onJoinGroup(joinLink.trim())
    setJoinLink('')
  }

  return (
    <section className="card group-list">
      <div className="section-head">
        <h2>Mga Ambagan</h2>
        <span className="muted">{groups.length} grupo</span>
      </div>

      <div className="group-items">
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            className={`group-item ${
              activeGroupId === group.id ? 'active' : ''
            }`}
            onClick={() => onSelect(group.id)}
            disabled={disabled}
          >
            <span>{group.name}</span>
            <small>Invite: {group.inviteCode}</small>
          </button>
        ))}
      </div>

      <form className="stack" onSubmit={handleCreate}>
        <label>
          Bagong grupo
          <input
            type="text"
            placeholder="Halimbawa: Barkada"
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            disabled={disabled}
          />
        </label>
        <button type="submit" className="primary" disabled={disabled}>
          Gumawa ng grupo
        </button>
      </form>

      <form className="stack" onSubmit={handleJoin}>
        <label>
          Join link / code
          <input
            type="text"
            placeholder="https://ambagan.app/join/BARKADA-2026"
            value={joinLink}
            onChange={(event) => setJoinLink(event.target.value)}
            disabled={disabled}
          />
        </label>
        <button type="submit" className="ghost" disabled={disabled}>
          Sumali sa grupo
        </button>
      </form>
    </section>
  )
}

export default GroupList
