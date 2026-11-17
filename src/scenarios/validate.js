// Checks a scenario for authoring mistakes: wrong ids, unsorted keys, missing answers.
// Returns a list of problems (empty = OK). Used by tests so a broken situation never ships.

function checkClip(clip, where, ids, problems) {
  if (!clip) return
  if (!(clip.duration > 0)) problems.push(`${where}: duration musi być > 0`)
  for (const [id, keys] of Object.entries(clip.tracks ?? {})) {
    if (!ids.has(id)) problems.push(`${where}: nieznany zawodnik "${id}"`)
    checkKeys(keys, `${where}/${id}`, clip.duration, problems)
  }
  checkKeys(clip.ball ?? [], `${where}/piłka`, clip.duration, problems)
  for (const k of clip.ball ?? []) {
    if (k.on && !ids.has(k.on)) problems.push(`${where}/piłka: nieznany zawodnik "${k.on}"`)
    if (!k.on && (typeof k.x !== 'number' || typeof k.y !== 'number')) problems.push(`${where}/piłka: klucz bez pozycji`)
  }
}

function checkKeys(keys, where, duration, problems) {
  let prev = -Infinity
  for (const k of keys) {
    if (k.t < prev) problems.push(`${where}: klucze nie są posortowane po czasie`)
    if (k.t > duration + 1e-9) problems.push(`${where}: klucz t=${k.t} po końcu klipu (${duration})`)
    prev = k.t
  }
}

export function validateScenario(sc) {
  const problems = []
  const ids = new Set(sc.entities.map((e) => e.id))
  if (ids.size !== sc.entities.length) problems.push('powtórzone id zawodników')
  if (sc.entities.filter((e) => e.you).length !== 1) problems.push('dokładnie jeden zawodnik musi mieć you: true')
  if (sc.ball.on && !ids.has(sc.ball.on)) problems.push(`piłka u nieznanego zawodnika "${sc.ball.on}"`)
  if (!sc.stages?.length) problems.push('brak etapów')

  for (const base of sc.stages ?? []) {
    const versions = [base, ...(base.variants ?? []).map((v) => ({ ...base, ...v, id: `${base.id}~${v.variantId}` }))]
    for (const st of versions) validateStage(st, ids, problems)
    for (const v of base.variants ?? []) {
      if (!v.variantId) problems.push(`etap ${base.id}: wariant bez variantId`)
      // Every version offers the same four answers — only the cue decides which one is best.
      const sig = (opts) => (opts ?? []).map((o) => `${o.id}|${o.label}`).sort().join('\n')
      if (sig(v.options ?? base.options) !== sig(base.options)) problems.push(`etap ${base.id}~${v.variantId}: inne odpowiedzi niż w wersji podstawowej`)
      if ((v.options ?? base.options).find((o) => o.correct)?.id === base.options.find((o) => o.correct)?.id) {
        problems.push(`etap ${base.id}~${v.variantId}: ta sama najlepsza odpowiedź co w wersji podstawowej`)
      }
    }
  }
  return problems
}

function validateStage(st, ids, problems) {
  const w = `etap ${st.id}`
  if (st.options?.length !== 4) problems.push(`${w}: potrzebne 4 odpowiedzi`)
  if ((st.options ?? []).filter((o) => o.correct).length !== 1) problems.push(`${w}: dokładnie jedna poprawna odpowiedź`)
  if (new Set((st.options ?? []).map((o) => o.id)).size !== st.options?.length) problems.push(`${w}: powtórzone id odpowiedzi`)
  checkClip(st.intro, `${w}/intro`, ids, problems)
  for (const o of st.options ?? []) {
    if (!o.label || !o.feedback) problems.push(`${w}/${o.id}: brak treści lub wyjaśnienia`)
    if (o.quality != null && (o.correct || ![0, 1, 2].includes(o.quality))) problems.push(`${w}/${o.id}: quality 0–2 tylko dla nie-najlepszych`)
    if (!o.clip) problems.push(`${w}/${o.id}: brak animacji`)
    checkClip(o.clip, `${w}/${o.id}`, ids, problems)
  }
  if (!st.timeout) problems.push(`${w}: brak reakcji na koniec czasu`)
  else {
    if (!st.timeout.clip && !st.options.some((o) => o.id === st.timeout.optionId)) problems.push(`${w}/timeout: brak animacji`)
    checkClip(st.timeout.clip, `${w}/timeout`, ids, problems)
  }
}
