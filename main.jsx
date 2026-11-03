import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Youtube, Instagram, MessageCircle, Twitter, Heart, ExternalLink, Play, Menu, X, ArrowUpRight, Radio, Video, RefreshCw, Clock3 } from 'lucide-react';
import './style.css';

const links = {
  youtube: 'https://www.youtube.com/@eaidoky',
  discord: 'https://discord.gg/2VtmHhZN4',
  instagram: 'https://www.instagram.com/eaidoky',
  twitter: 'https://x.com/eaidoky',
  tiktok: 'https://www.tiktok.com/@eaidoky',
  pix: 'https://pixgg.com/eaidoky',
  store: 'https://streamlabs.com/gabsteco/cloudbot'
};

const fallbackItems = [
  { id: 'bKbNjEP0azM', type: 'live', title: 'Live do EAIDOKY', url: 'https://www.youtube.com/live/bKbNjEP0azM', thumbnail: 'https://i.ytimg.com/vi/bKbNjEP0azM/hqdefault.jpg' },
  { id: 'eTWRTfGiqHA', type: 'short', title: 'Short do EAIDOKY', url: 'https://www.youtube.com/shorts/eTWRTfGiqHA', thumbnail: 'https://i.ytimg.com/vi/eTWRTfGiqHA/hqdefault.jpg' }
];

function VideoCard({ item, type }) {
  return <a className="video-card" href={item.url} target="_blank" rel="noopener noreferrer">
    <div className="video-thumb">
      <img src={item.thumbnail || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} alt={`Miniatura: ${item.title}`} loading="lazy" onError={(event) => { event.currentTarget.src = `https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`; }} />
      <span className="video-tag">{type === 'live' ? <><i/> LIVE</> : 'SHORT'}</span>
      <span className="video-play"><Play fill="currentColor"/></span>
    </div>
    <div className="video-info"><h3>{item.title}</h3><span>ASSISTIR NO YOUTUBE <ArrowUpRight size={13}/></span></div>
  </a>;
}

function EmptyFeed({ type }) {
  return <div className="empty-feed"><span className="play-circle">{type === 'live' ? <Radio/> : <Video/>}</span><h3>NOVOS {type === 'live' ? 'VÍDEOS' : 'SHORTS'} EM BREVE</h3><p>Quando houver conteúdo disponível, ele aparecerá aqui.</p><a href={type === 'live' ? `${links.youtube}/streams` : `${links.youtube}/shorts`} target="_blank" rel="noopener noreferrer">ACESSAR NO YOUTUBE <ArrowUpRight size={13}/></a></div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [feed, setFeed] = useState(fallbackItems);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [feedSource, setFeedSource] = useState('fallback');
  const [loading, setLoading] = useState(true);

  const refreshFeed = async () => {
    try {
      const response = await fetch('/api/youtube-feed', { cache: 'no-store' });
      if (!response.ok) throw new Error('Falha ao consultar o feed');
      const data = await response.json();
      if (Array.isArray(data.items)) setFeed(data.items);
      setFeedSource(data.source || 'youtube-rss');
