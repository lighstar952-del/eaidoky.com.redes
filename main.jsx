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
      setUpdatedAt(data.updatedAt ? new Date(data.updatedAt) : new Date());
    } catch {
      setFeedSource('fallback');
      setUpdatedAt(new Date());
    } finally { setLoading(false); }
  };

  useEffect(() => {
    refreshFeed();
    const timer = window.setInterval(refreshFeed, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const lives = useMemo(() => feed.filter(item => item.type === 'live').slice(0, 6), [feed]);
  const shorts = useMemo(() => feed.filter(item => item.type === 'short').slice(0, 6), [feed]);
  const formattedUpdate = updatedAt ? updatedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—';

  const socials = [
    { name: 'YouTube', label: 'Acompanhe os vídeos', url: links.youtube, Icon: Youtube },
    { name: 'Discord', label: 'Entre para a comunidade', url: links.discord, Icon: MessageCircle },
    { name: 'Instagram', label: 'Siga no Instagram', url: links.instagram, Icon: Instagram },
    { name: 'X / Twitter', label: 'Acompanhe as novidades', url: links.twitter, Icon: Twitter },
    { name: 'TikTok', label: 'Veja os cortes', url: links.tiktok, Icon: Video }
  ];

  return <main>
    <header className="topbar">
      <a className="brand" href="#inicio" aria-label="EAIDOKY início"><span className="brand-mark">E</span><span>EAIDOKY<small>STREAMER OFICIAL</small></span></a>
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>{menuOpen ? <X/> : <Menu/>}</button>
      <nav className={menuOpen ? 'nav open' : 'nav'} onClick={() => setMenuOpen(false)}><a href="#inicio">INÍCIO</a><a href="#redes">REDES</a><a href="#conteudos">ÚLTIMOS CONTEÚDOS</a></nav>
      <a className="support-top" href={links.pix} target="_blank" rel="noopener noreferrer">♡ APOIE O STREAMER <ArrowUpRight size={15}/></a>
    </header>

    <section className="hero" id="inicio">
      <div className="hero-copy"><div className="eyebrow"><i/> STREAMER <span>/</span> CREATOR</div><h1>EAIDOKY<span>.</span></h1>
        <p>Bem-vindo ao universo EAIDOKY. Lives, gameplay e momentos<br className="desktop"/> com a comunidade.</p>
        <div className="actions"><a className="btn gold" href="#redes">EXPLORAR CANAIS <ArrowUpRight size={16}/></a><a className="btn outline" href={links.discord} target="_blank" rel="noopener noreferrer">ENTRAR NA COMUNIDADE <ArrowUpRight size={16}/></a></div>
        <div className="hero-meta"><span>01 — CONECTE-SE</span><span>EAIDOKY / ONLINE</span></div>
      </div>
      <div className="art-frame"><img src="/doky-original.png" alt="Arte original DOKY"/></div><div className="vertical-note">EAIDOKY • STREAMER • BRASIL</div>
    </section>

    <section className="social-section section" id="redes">
      <div className="section-kicker">01 <span>/</span> CONECTE-SE</div><div className="section-heading"><h2>MINHAS <em>REDES</em></h2><p>Faça parte da comunidade<br/>e acompanhe tudo de perto.</p></div>
      <div className="social-grid">{socials.map(({name,label,url,Icon}) => <a className="social-card" href={url} target="_blank" rel="noopener noreferrer" key={name}><span className="social-icon"><Icon/></span><span><b>{name}</b><small>{label}</small></span><ExternalLink className="external"/></a>)}</div>
      <div className="feature-grid">
        <article className="feature store"><span className="feature-number">02 / RECOMPENSAS</span><div className="feature-icon"><Radio/></div><h3>LOJA DE PONTOS</h3><p>Troque pontos. Desbloqueie momentos.</p><a className="btn outline" href={links.store} target="_blank" rel="noopener noreferrer">ABRIR LOJA STREAMLABS <ArrowUpRight size={15}/></a></article>
        <article className="feature donate"><span className="feature-number">03 / APOIO</span><div className="feature-icon"><Heart/></div><h3>APOIE O STREAMER</h3><p>Fortaleça o canal e faça parte dessa jornada.</p><a className="btn gold" href={links.pix} target="_blank" rel="noopener noreferrer">APOIAR VIA PIX GG <ArrowUpRight size={15}/></a></article>
      </div>
    </section>

    <section className="content-section section" id="conteudos">
      <div className="section-kicker">02 <span>/</span> NOVIDADES [03]</div><div className="section-heading"><h2>Últimos <em>conteúdos.</em></h2><p>Os momentos mais recentes<br/>do canal em um só lugar.</p></div>
      <div className="feed-status"><span className="live-dot"/>{loading ? 'SINCRONIZANDO CANAL' : 'FEED DO CANAL'} <span>•</span> {loading ? 'CONSULTANDO YOUTUBE' : `ÚLTIMA CONSULTA ${formattedUpdate}`} <span>•</span> ATUALIZAÇÃO A CADA 60 SEGUNDOS <button className="refresh-button" onClick={refreshFeed} aria-label="Atualizar feed" title="Atualizar agora"><RefreshCw size={14}/></button></div>
      {feedSource === 'fallback' && <p className="feed-warning">Mostrando os dois conteúdos enviados como referência. Se o YouTube bloquear a consulta automática, os links continuam disponíveis abaixo.</p>}
      <div className="feed-columns">
        <div className="feed-column"><div className="feed-title"><span>01 /</span> LIVE <Radio/></div>{lives.length ? lives.map(item => <VideoCard item={item} type="live" key={item.id}/>) : <EmptyFeed type="live"/>}<a className="feed-more" href={`${links.youtube}/streams`} target="_blank" rel="noopener noreferrer">VER TODAS AS LIVES <ArrowUpRight size={14}/></a></div>
        <div className="feed-column"><div className="feed-title"><span>02 /</span> SHORTS <Video/></div>{shorts.length ? shorts.map(item => <VideoCard item={item} type="short" key={item.id}/>) : <EmptyFeed type="short"/>}<a className="feed-more" href={`${links.youtube}/shorts`} target="_blank" rel="noopener noreferrer">VER TODOS OS SHORTS <ArrowUpRight size={14}/></a></div>
      </div>
      <p className="feed-footnote"><Clock3 size={12}/> O feed tenta sincronizar automaticamente a cada 60 segundos. O YouTube pode limitar consultas externas.</p>
    </section>

    <footer><a className="brand" href="#inicio"><span className="brand-mark">E</span><span>EAIDOKY<small>STREAMER OFICIAL</small></span></a><span>© {new Date().getFullYear()} EAIDOKY. TODOS OS DIREITOS RESERVADOS.</span><a href="#inicio" className="back-top">VOLTAR AO TOPO ↑</a></footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<App/>);
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');
:root{font-family:Inter,Arial,sans-serif;color:#f4f0f7;background:#09070d;font-synthesis:none;scroll-behavior:smooth}*{box-sizing:border-box}body{margin:0;background:radial-gradient(ellipse at 75% 12%,#1b0928 0,transparent 35%),#09070d}a{color:inherit;text-decoration:none}.topbar{height:88px;padding:0 7%;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ffffff12;background:#0b0810;position:sticky;top:0;z-index:5}.brand{display:flex;align-items:center;gap:12px;font-weight:800;letter-spacing:2px;font-size:15px}.brand small{display:block;font-size:8px;letter-spacing:2.2px;color:#a59aaa;margin-top:5px}.brand-mark{width:36px;height:36px;border:1px solid #a64aff;color:#bd70ff;display:grid;place-items:center;font-family:'Barlow Condensed';font-size:25px}.nav{display:flex;gap:38px;font-size:10px;letter-spacing:1.5px;color:#c9c0d0}.nav a:hover{color:#c078ff}.support-top,.btn{display:inline-flex;align-items:center;justify-content:center;gap:12px;font-size:10px;font-weight:800;letter-spacing:1px;padding:14px 18px}.support-top,.gold{background:#c69b54;color:#120d10}.mobile-menu{display:none;background:none;border:0;color:white}.hero{min-height:650px;padding:90px 7%;display:flex;align-items:center;position:relative;overflow:hidden;background:radial-gradient(ellipse at 78% 48%,#41106b66,transparent 44%),linear-gradient(115deg,#0a0710,#13091c 60%,#09070d)}.hero:before{content:"";position:absolute;width:600px;height:600px;border:1px solid #a74cff22;border-radius:50%;right:4%;top:4%}.hero-copy{position:relative;z-index:2;max-width:52%}.eyebrow,.section-kicker{font-size:10px;letter-spacing:3px;color:#bcb0c5}.eyebrow i,.live-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#b85cff;margin-right:9px;box-shadow:0 0 12px #b85cff}.eyebrow span,.section-kicker span{color:#bd75ff;margin:0 8px}.hero h1{font-family:'Barlow Condensed';font-size:clamp(90px,13vw,170px);line-height:.9;letter-spacing:-4px;margin:24px 0;color:#fff}.hero h1 span{color:#bc6aff}.hero-copy p{color:#a99eaf;font-size:13px;line-height:1.9}.actions{display:flex;gap:12px;margin-top:30px;flex-wrap:wrap}.btn{min-height:46px}.outline{border:1px solid #80628f;color:#eee}.btn:hover,.social-card:hover{transform:translateY(-3px);filter:brightness(1.15)}.hero-meta{display:flex;gap:32px;margin-top:75px;font-size:8px;letter-spacing:2px;color:#73677b}.art-frame{position:absolute;width:48%;right:5%;top:50%;transform:translateY(-50%);border:1px solid #a34be955;padding:7px;background:#180b25;clip-path:polygon(5% 0,100% 0,100% 91%,93% 100%,0 100%,0 8%);box-shadow:0 0 80px #8d22d533}.art-frame img{display:block;width:100%;height:auto}.vertical-note{position:absolute;right:2%;top:40%;writing-mode:vertical-rl;font-size:8px;letter-spacing:3px;color:#8c6c9d}.section{padding:100px 7%}.section-kicker{color:#bd79f2}.section-heading{display:flex;justify-content:space-between;align-items:end;margin:22px 0 38px}.section-heading h2{font-family:'Barlow Condensed';font-size:64px;line-height:1;margin:0;text-transform:uppercase}.section-heading h2 em{font-style:normal;color:#b968f1}.section-heading p{font-size:11px;line-height:1.8;color:#978b9e}.social-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}.social-card{background:#15101b;border:1px solid #ffffff16;padding:20px 14px;display:flex;align-items:center;gap:12px;min-width:0;transition:.2s}.social-icon{color:#bd72f4}.social-icon svg{width:21px}.social-card b,.social-card small{display:block}.social-card b{font-size:12px}.social-card small{font-size:9px;color:#95899d;margin-top:5px}.external{width:13px;margin-left:auto;color:#75677d}.feature-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px}.feature{min-height:270px;padding:28px;background:linear-gradient(135deg,#191020,#100c15);border:1px solid #ffffff19;position:relative;overflow:hidden}.feature:after{content:"";position:absolute;width:220px;height:220px;border:1px solid #a24be533;border-radius:50%;right:-60px;top:40px}.donate{background:linear-gradient(120deg,#211328,#15101a)}.feature-number{font-size:9px;letter-spacing:2px;color:#b77be0}.feature-icon{margin-top:25px;color:#bd79f2}.feature h3{font-family:'Barlow Condensed';font-size:30px;margin:10px 0 5px}.feature p{color:#a99eaf;font-size:12px;margin:0 0 20px}.feature .btn{position:relative;z-index:1}.content-section{background:#0d0911;border-top:1px solid #ffffff10}.content-section .section-heading h2{text-transform:none}.feed-status{font-size:9px;letter-spacing:1.5px;color:#9e91a5;padding:14px;border:1px solid #ffffff17;margin-bottom:22px}.feed-status span{color:#b56be8;margin:0 8px}.feed-columns{display:grid;grid-template-columns:1fr 1fr;gap:18px}.feed-column{border:1px solid #ffffff19;background:#130e19;padding:20px}.feed-title{font-family:'Barlow Condensed';font-size:23px;letter-spacing:1px;padding-bottom:17px;border-bottom:1px solid #ffffff18}.feed-title span{color:#b66be8}.feed-title svg{float:right;color:#b66be8;width:19px}.empty-feed{min-height:230px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}.play-circle{width:48px;height:48px;border:1px solid #b96bf0;border-radius:50%;display:grid;place-items:center;color:#c17bfa}.play-circle svg{width:17px}.empty-feed h3{font-family:'Barlow Condensed';font-size:25px;margin:15px 0 3px}.empty-feed p,.feed-footnote{font-size:10px;color:#9a8da1}.empty-feed a{font-size:9px;letter-spacing:1px;color:#c17bfa;margin-top:15px;display:flex;gap:8px;align-items:center}.feed-footnote{text-align:center;margin-top:25px}footer{border-top:1px solid #ffffff16;padding:30px 7%;display:flex;align-items:center;justify-content:space-between}footer>span,footer .back-top{font-size:8px;letter-spacing:1px;color:#887d90}.back-top:hover{color:#c17bfa}
@media(max-width:850px){.topbar{padding:0 5%}.nav{gap:15px}.support-top{font-size:8px;padding:12px}.hero{padding:70px 6%;min-height:720px;align-items:flex-start}.hero-copy{max-width:100%;padding-top:20px}.hero h1{font-size:100px}.art-frame{width:88%;right:6%;top:auto;bottom:25px;transform:none}.vertical-note{display:none}.section{padding:75px 5%}.social-grid{grid-template-columns:repeat(2,1fr)}.social-card:last-child{grid-column:span 2}.section-heading h2{font-size:52px}}
@media(max-width:560px){.topbar{height:72px}.mobile-menu{display:block}.nav{display:none;position:absolute;top:72px;left:0;right:0;background:#100b17;padding:22px;flex-direction:column}.nav.open{display:flex}.support-top{display:none}.hero{min-height:700px}.hero h1{font-size:88px}.hero-copy p br{display:none}.actions{flex-direction:column;align-items:flex-start}.hero-meta{margin-top:30px;gap:14px}.art-frame{bottom:25px;width:92%;right:4%}.section-heading{display:block}.section-heading p{margin-top:15px}.section-heading h2{font-size:48px}.social-grid{grid-template-columns:1fr}.social-card:last-child{grid-column:auto}.feature-grid,.feed-columns{grid-template-columns:1fr}.feature{min-height:250px}footer{gap:18px;align-items:flex-start;flex-direction:column}}.video-card{display:block;margin:18px 0 22px;border:1px solid #ffffff18;background:#0d0912;transition:.2s}.video-card:hover{transform:translateY(-3px);border-color:#a95be0}.video-thumb{height:190px;position:relative;overflow:hidden;background:#09070d}.video-thumb img{width:100%;height:100%;object-fit:cover;display:block;transition:.25s}.video-card:hover .video-thumb img{transform:scale(1.035)}.video-thumb:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,#09070d88,transparent 55%)}.video-tag{position:absolute;z-index:1;left:12px;top:12px;padding:7px 10px;background:#1a1023e8;color:#e6c8ff;font-size:8px;letter-spacing:1.5px}.video-tag i{display:inline-block;width:6px;height:6px;border-radius:50%;background:#f04b72;margin-right:6px}.video-play{position:absolute;z-index:1;left:50%;top:50%;transform:translate(-50%,-50%);width:46px;height:46px;border:1px solid #fff;border-radius:50%;display:grid;place-items:center;color:white;background:#10081788}.video-play svg{width:17px}.video-info{padding:15px 16px}.video-info h3{font-family:'Barlow Condensed';font-size:24px;margin:0 0 10px}.video-info span,.feed-more{display:flex;align-items:center;gap:8px;font-size:9px;letter-spacing:1px;color:#c17bfa}.feed-more{margin:20px 0 4px}
.refresh-button{float:right;display:inline-flex;align-items:center;justify-content:center;background:transparent;color:#c17bfa;border:1px solid #ffffff2b;padding:5px 8px;cursor:pointer}.refresh-button:hover{background:#281532}.feed-warning{font-size:10px;line-height:1.6;color:#d7bd91;border-left:2px solid #c69b54;padding:8px 12px;margin:-8px 0 20px;background:#c69b5410}.feed-footnote{display:flex;align-items:center;justify-content:center;gap:7px}.video-info h3{overflow-wrap:anywhere}.social-card:focus-visible,.btn:focus-visible,.nav a:focus-visible,.refresh-button:focus-visible{outline:2px solid #c17bfa;outline-offset:3px}

