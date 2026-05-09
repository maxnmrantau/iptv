import { Search, LayoutGrid, Clock, Heart, Trash2 } from 'lucide-react'

export default function Sidebar({
  categories,
  categoryCounts,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  allChannelsCount,
  activeTab,
  onSelectTab,
  recentCount,
  favoritesCount,
  onClearRecent,
}) {
  const tabs = [
    { id: 'all', label: 'All', icon: LayoutGrid, count: allChannelsCount },
    { id: 'recent', label: 'Recent', icon: Clock, count: recentCount },
    { id: 'favorites', label: 'Favs', icon: Heart, count: favoritesCount },
  ]

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-surface2 text-text text-sm pl-9 pr-3 py-2.5 rounded-xl border border-[rgba(255,255,255,0.07)] focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-text-muted font-sans"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-3 pb-2">
        <div className="flex gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-mono transition-all ${
                  active
                    ? 'accent-bg-soft-20 accent-text font-bold'
                    : 'bg-surface2 text-text-muted hover:text-text border border-transparent'
                }`}
              >
                <Icon size={12} />
                <span>{tab.label}</span>
                <span className={`text-[9px] ${active ? 'opacity-70' : 'opacity-50'}`}>{tab.count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content based on tab */}
      {activeTab !== 'all' ? (
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
              {activeTab === 'recent' ? 'Recently Watched' : 'Favorites'}
            </p>
            {activeTab === 'recent' && recentCount > 0 && (
              <button
                onClick={onClearRecent}
                className="flex items-center gap-1 text-[10px] font-mono accent-red-text hover:opacity-80 transition-opacity"
                title="Clear recent"
              >
                <Trash2 size={10} />
                Clear
              </button>
            )}
          </div>
          {activeTab === 'recent' && recentCount === 0 && (
            <p className="text-xs text-text-muted px-2 py-4 text-center">No recent channels</p>
          )}
          {activeTab === 'favorites' && favoritesCount === 0 && (
            <p className="text-xs text-text-muted px-2 py-4 text-center">
              Press ♥ on a channel to add favorites
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Categories */}
          <div className="px-3 py-2">
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2 px-2">Categories</p>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
            {/* All */}
            <button
              onClick={() => onSelectCategory(null)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                selectedCategory === null
                  ? 'accent-bg-soft-20 accent-text border accent-border-soft'
                  : 'text-text-muted hover:bg-surface2 hover:text-text border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutGrid size={14} />
                <span className="font-sans">All Channels</span>
              </span>
              <span className="text-xs font-mono opacity-60">{allChannelsCount}</span>
            </button>

            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedCategory === cat.id
                    ? 'accent-bg-soft-20 accent-text border accent-border-soft'
                    : 'text-text-muted hover:bg-surface2 hover:text-text border border-transparent'
                }`}
              >
                <span className="font-sans truncate">{cat.name}</span>
                <span className="text-xs font-mono opacity-60">{categoryCounts[cat.id] || 0}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
