
import { useUser } from '@/context/UserContext'
import { useEffect, useState } from 'react'

const UserCard = ({ user, action, actionLabel }: { user: any, action?: () => void, actionLabel?: string }) => {
  return (
    <div className="flex items-center gap-3 p-2">
      <img src={`Avatar${parseInt(user.avatar) + 1}.png`} className="avatar" />
      <span>{user.username}</span>
      {action && (
        <button onClick={action} className="ml-auto text-sm px-3 py-1 rounded-md bg-purple-500 text-white hover:bg-purple-600">
          {actionLabel}
        </button>
      )}
    </div>
  )
}


export default function UserFriends() {
  const { user } = useUser()
  if (!user) { return null }

  const [mutual, setMutual] = useState<any[]>([])
  const [onlyFollowing, setOnlyFollowing] = useState<any[]>([])
  const [onlyFollowers, setOnlyFollowers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])


  useEffect(() => {
    fetchFollowData()
  }, [user.id])

  const fetchFollowData = async () => {
    const [followersRes, followingRes] = await Promise.all([
      fetch(`/api/users/${user.id}/followers`),
      fetch(`/api/users/${user.id}/following`)
    ])
    const followers = await followersRes.json()
    const following = await followingRes.json()

    const followerIds = new Set(followers.map((u: any) => u.id))
    const followingIds = new Set(following.map((u: any) => u.id))

    setMutual(followers.filter((u: any) => followingIds.has(u.id)))
    setOnlyFollowers(followers.filter((u: any) => !followingIds.has(u.id)))
    setOnlyFollowing(following.filter((u: any) => !followerIds.has(u.id)))
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) { return }
    const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`)
    const data = await res.json()
    const followingIds = new Set([...mutual, ...onlyFollowing].map((u: any) => u.id))
    setSearchResults(data.filter((u: any) => u.id !== user.id && !followingIds.has(u.id)))
  }

  const handleFollow = async (targetId: number) => {
    await fetch(`/api/users/follow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followerId: user.id, followingId: targetId })
    })
    setSearchResults(prev => prev.filter(u => u.id !== targetId))
    fetchFollowData()
  }

  const handleUnfollow = async (targetId: number) => {
    await fetch(`/api/users/unfollow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followerId: user.id, followingId: targetId })
    })
    fetchFollowData()
  }



  return (
    <div>
      <br />
      <h1> UserFriends </h1>

      <div className="userfriends">
        <h1>Find SigiLites to SigilFollow</h1>
        <div >
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { handleSearch() } }}
            placeholder="Search by username..."
            className="border rounded-md px-3 py-1 text-sm flex-1"
          />
          <button onClick={handleSearch} className="px-3 py-1 rounded-md bg-purple-500 text-white text-sm hover:bg-purple-600">
            Search
          </button>
        </div>

        {searchResults.length > 0 && searchResults.map(u => (
          <UserCard key={u.id} user={u} action={() => handleFollow(u.id)} actionLabel="Follow" />
        ))}
        {searchResults.length === 0 && searchQuery && (
          <p className="text-sm text-gray-400">No results found</p>
        )}
      </div>

      <div className="profilebox" />
      <h1>SigilFriends</h1>
      {mutual.length === 0 ? <p className="text-s"> No SigilFriends Yet</p>
        :
        mutual.map(u => (
          <UserCard key={u.id} user={u} action={() => handleUnfollow(u.id)} actionLabel="Unfollow!" />
        ))
      }
      <div className="profilebox">
        <h3>Followers</h3>
        {onlyFollowers.length === 0
          ? <p className="text-sm text-gray-400">No followers yet</p>
          : onlyFollowers.map(u => (
            <UserCard key={u.id} user={u} />
          ))
        }
      </div>
      <div className="profilebox">
        <h3>SigilFriends</h3>
        {mutual.length === 0
          ? <p className="text-sm text-gray-400">No SigilFriends yet!</p>
          : mutual.map(u => (
            <UserCard key={u.id} user={u} action={() => handleUnfollow(u.id)} actionLabel="Unfollow" />
          ))
        }
      </div>
      <div className="profilebox">
        <h3>SigilFriends</h3>
        {mutual.length === 0
          ? <p className="text-sm text-gray-400">No SigilFriends yet!</p>
          : mutual.map(u => (
            <UserCard key={u.id} user={u} action={() => handleUnfollow(u.id)} actionLabel="Unfollow" />
          ))
        }
      </div>
      <br />
      <br />
      <br />

    </div>
  )
};