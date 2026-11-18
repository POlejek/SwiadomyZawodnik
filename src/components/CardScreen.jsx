import { useRef, useState } from 'react'
import { ATTRS, CARD_TIERS, albumCards, albumCompletion } from '../card'
import { shirtOf } from '../profile'
import { BADGES } from '../progress'
import { findScenario } from '../scenarios'
import { grupa } from '../taxonomy'
import PlayerCard, { cardToPng } from './PlayerCard'

const TIER_STYLE = {
  bronze: 'from-amber-900 via-amber-600 to-amber-800 text-amber-50',
  silver: 'from-slate-500 via-slate-200 to-slate-400 text-slate-900',
  gold: 'from-yellow-700 via-yellow-300 to-yellow-600 text-yellow-950',
}

/** "Moja karta": the player's card with skills, and the album of fundamental and special cards. */
export default function CardScreen({ card, progress, profile, onExit }) {
  const [tab, setTab] = useState('karta')
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6" data-testid="card-screen">
      <header className="flex items-center gap-3 py-2">
        <button type="button" onClick={onExit} className="btn-ghost" aria-label="Wróć">
          ←
        </button>
        <h1 className="flex-1 text-2xl font-extrabold text-white">Karta i album</h1>
      </header>
      <div className="tabs mt-3 max-w-xs" role="tablist">
        {[
          ['karta', 'Moja karta'],
          ['album', 'Album'],
        ].map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className={`tab flex-1 ${tab === id ? 'tab-on' : ''}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      {tab === 'karta' ? <CardTab card={card} profile={profile} /> : <AlbumTab progress={progress} />}
    </div>
  )
}

function CardTab({ card, profile }) {
  const svg = useRef(null)
  const [status, setStatus] = useState('')
  const share = async () => {
    try {
      const blob = await cardToPng(svg.current)
      const file = new File([blob], 'moja-karta.png', { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: `Moja karta w Świadomym Zawodniku: ${card.overall}!` })
        setStatus('Karta wysłana.')
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'moja-karta.png'
        a.click()
        URL.revokeObjectURL(url)
        setStatus('Karta zapisana jako obrazek.')
      }
    } catch {
      setStatus('Nie udało się udostępnić karty.')
    }
  }

  return (
    <div className="mt-6 grid gap-8 md:grid-cols-[300px_1fr] md:items-start">
      <div className="mx-auto w-full max-w-[300px]">
        <PlayerCard ref={svg} card={card} name={profile?.name} number={profile?.number} shirt={shirtOf(profile)} idPrefix="big" className="w-full drop-shadow-2xl" />
        <button type="button" className="btn-secondary mt-4 w-full" onClick={share}>
          Udostępnij kartę
        </button>
        {status && <p className="mt-2 text-center text-sm text-lime-300">{status}</p>}
      </div>
      <div>
        <p className="text-sm leading-relaxed text-slate-300">
          Każda decyzja podnosi umiejętności — najbardziej te najlepsze. Na początku rosną szybko, potem coraz wolniej, jak u prawdziwego zawodnika.{' '}
          <b className="text-white">Oceny nigdy nie spadają.</b>
        </p>
        <div className="mt-5 space-y-4">
          {ATTRS.map((a) => {
            const { value, cap } = card.attrs[a.key]
            return (
              <div key={a.key}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-bold text-white">
                    <span className="mr-2 inline-block w-9 font-black tabular-nums text-lime-300">{value}</span>
                    {a.label} <span className="text-xs font-semibold text-slate-500">{a.key}</span>
                  </p>
                  <span className="shrink-0 text-xs text-slate-400">pułap {cap}</span>
                </div>
                <div className="relative mt-1.5 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-slate-600/60" style={{ width: `${cap}%` }} />
                  <div className="absolute inset-y-0 left-0 rounded-full bg-lime-400" style={{ width: `${value}%` }} />
                </div>
                <p className="mt-1 text-xs text-slate-400">{a.how}</p>
              </div>
            )
          })}
        </div>
        <div className="panel mt-6 !p-4 text-sm leading-relaxed text-slate-300">
          <b className="text-white">Jak podnieść pułap?</b> Pułap umiejętności rośnie z medalami za fundamenty z jej grupy. Złoty medal to najlepsza decyzja w{' '}
          <b className="text-white">5 różnych dniach</b> — dlatego wracaj do powtórek. Do 99 dojdziesz tylko ze złotem we wszystkich fundamentach, a każda nowa sytuacja daje nowy cel.
        </div>
      </div>
    </div>
  )
}

function AlbumTab({ progress }) {
  const cards = albumCards(progress)
  const specials = Object.keys(BADGES)
  const done = albumCompletion(progress, specials)
  return (
    <div className="mt-6" data-testid="album">
      <div className="panel !p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-bold text-white">Album</p>
          <p className="text-sm text-slate-300">
            <b className="text-white tabular-nums">{done.filled}</b> / {done.total} kart · {Math.round(done.share * 100)}%
          </p>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-600 via-slate-200 to-yellow-300" style={{ width: `${done.share * 100}%` }} />
        </div>
        <p className="mt-2 text-xs text-slate-400">Każdy fundament ma trzy karty: brązową, srebrną i złotą. Karty zdobywasz za decyzje — bez losowania.</p>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-extrabold text-white">Fundamenty gry</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c) => (
          <FundamentCard key={c.id} c={c} />
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-extrabold text-white">Karty specjalne</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {specials.map((id) => {
          const b = BADGES[id]
          const got = progress.badges[id]
          return (
            <div key={id} className={`album-card ${got ? 'bg-gradient-to-br from-sky-500 via-indigo-500 to-fuchsia-600 text-white' : 'album-locked'}`}>
              <span className="text-3xl" aria-hidden>
                {got ? b.icon : '?'}
              </span>
              <p className="mt-2 text-sm font-extrabold leading-tight">{b.name}</p>
              <p className={`mt-1 text-[11px] leading-snug ${got ? 'text-white/80' : 'text-slate-500'}`}>{b.text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FundamentCard({ c }) {
  const tierIndex = c.tier ? CARD_TIERS.findIndex((t) => t.id === c.tier) : -1
  const nextItem = c.next
  const sc = nextItem && findScenario(nextItem.scenarioId)
  return (
    <div className={`album-card ${c.tier ? `bg-gradient-to-br ${TIER_STYLE[c.tier]}` : 'album-locked'}`} data-testid="album-card">
      <p className={`text-[10px] font-bold uppercase tracking-wider ${c.tier ? 'opacity-70' : 'text-slate-500'}`}>{grupa(c.fundament.grupa)?.label}</p>
      <p className="mt-1 text-base font-black leading-tight">{c.fundament.label}</p>
      <div className="mt-2 flex gap-1" aria-label={c.tier ? `Karta: ${CARD_TIERS[tierIndex].label}` : 'Karta do zdobycia'}>
        {CARD_TIERS.map((t, i) => (
          <span key={t.id} className={`h-2 flex-1 rounded-full ${i <= tierIndex ? 'bg-current opacity-80' : 'bg-black/20'}`} />
        ))}
      </div>
      <p className={`mt-2 text-[11px] leading-snug ${c.tier ? 'opacity-80' : 'text-slate-400'}`}>
        {tierIndex === 2
          ? 'Komplet — złota karta!'
          : sc
            ? `Następna: najlepsza decyzja w „${nextItem.title}” (${sc.title}) w kolejnym dniu.`
            : c.fundament.opis}
      </p>
    </div>
  )
}
