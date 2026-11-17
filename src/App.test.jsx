import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { readSetFromHash } from './components/CoachPanel'
import { CATALOG, SCENARIOS } from './scenarios'
import { obrona2v1Skrzydlo as sc } from './scenarios/obrona2v1Skrzydlo'

const skip = (user) => user.click(screen.getByRole('button', { name: 'Pomiń animację' }))
const skipIfIntro = async (user) => {
  const b = screen.queryByRole('button', { name: 'Pomiń animację' })
  if (b) await user.click(b)
}

async function start(user) {
  render(<App />)
  await user.click(screen.getByRole('button', { name: 'Pomiń' })) // first visit: profile
  await user.selectOptions(screen.getByRole('combobox', { name: /Czas na decyzję/ }), '0') // no clock in tests
}

describe('App', () => {
  // Fixed randomness: the base version of every stage, not mirrored, answers in their written order.
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(Math, 'random').mockReturnValue(0.2)
  })
  afterEach(() => vi.restoreAllMocks())

  it('plays a whole situation: wrong answer, retry, what-if, then the best decisions to the summary', async () => {
    const user = userEvent.setup()
    await start(user)
    await user.click(screen.getAllByRole('button', { name: 'Graj' })[0])

    await skip(user)
    expect(screen.getByRole('heading', { name: sc.stages[0].question })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Doskakuję do zawodnika/ }))
    await skip(user)
    const fb = screen.getByTestId('feedback')
    expect(within(fb).getByText('Zła decyzja')).toBeInTheDocument()
    expect(within(fb).getByRole('heading', { name: 'Gol dla rywala' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Spróbuj jeszcze raz' }))

    for (const st of sc.stages) {
      if (st !== sc.stages[0]) await skip(user)
      const good = st.options.find((o) => o.correct)
      await user.click(screen.getByRole('button', { name: new RegExp(good.label.slice(0, 20)) }))
      await skip(user)
      expect(within(screen.getByTestId('feedback')).getByText('Najlepsza decyzja')).toBeInTheDocument()
      if (st === sc.stages[0]) {
        // "What if…": watch another answer, then go back.
        await user.click(screen.getByRole('button', { name: /Biegnę kryć/ }))
        await skip(user)
        expect(screen.getByText(/Co by było, gdyby… · Zła decyzja/)).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: /Wróć do najlepszej decyzji/ }))
      }
      await user.click(screen.getByRole('button', { name: /Dalej|Podsumowanie/ }))
    }

    const summary = screen.getByTestId('summary')
    expect(within(summary).getByText(/Najlepsze decyzje za pierwszym razem/)).toHaveTextContent('2 z 3')
    await user.click(screen.getByRole('button', { name: 'Inne sytuacje' }))
    expect(screen.getByText(/Rekord:/)).toBeInTheDocument()
  })

  it('first visit: the profile puts the name and number on the pitch', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByRole('textbox', { name: /Imię/ }), 'Kuba')
    await user.type(screen.getByRole('spinbutton', { name: /Numer/ }), '7')
    await user.click(screen.getByRole('button', { name: 'Obrońca' }))
    await user.click(screen.getByRole('button', { name: 'Gramy!' }))
    expect(screen.getByRole('button', { name: /Edytuj profil/ })).toHaveTextContent('Kuba')
    expect(screen.getAllByText('Twoja pozycja').length).toBeGreaterThan(0)
    await user.click(screen.getAllByRole('button', { name: 'Graj' })[0])
    expect(screen.getAllByText('KUBA').length).toBeGreaterThan(0)
  })

  it('daily training: five decisions, a summary, XP and a badge', async () => {
    const user = userEvent.setup()
    await start(user)
    await user.click(screen.getByRole('button', { name: 'Zacznij trening' }))
    for (const item of CATALOG.slice(0, 5)) {
      const stage = SCENARIOS.find((s) => s.id === item.scenarioId).stages[item.stageIndex]
      await skipIfIntro(user)
      await user.click(screen.getByRole('button', { name: new RegExp(stage.options.find((o) => o.correct).label.slice(0, 20)) }))
      await skip(user)
      await user.click(screen.getByRole('button', { name: /Dalej/ }))
    }
    const summary = screen.getByTestId('training-summary')
    expect(summary).toHaveTextContent('5 / 5')
    expect(screen.getAllByText('Trening dnia').length).toBeGreaterThan(0) // badge toast
    await user.click(screen.getByRole('button', { name: 'Wróć do menu' }))
    expect(screen.getByText('Zrobione na dziś ✓')).toBeInTheDocument()
  })

  it('answers with the keyboard', async () => {
    const user = userEvent.setup()
    await start(user)
    await user.click(screen.getAllByRole('button', { name: 'Graj' })[0])
    await skip(user)
    await user.keyboard('1')
    expect(screen.getByRole('button', { name: 'Pomiń animację' })).toBeInTheDocument()
  })
})

describe('coach set link', () => {
  it('reads known situations from the link', () => {
    const ids = SCENARIOS.map((s) => s.id)
    expect(readSetFromHash('#zestaw=atak-2v1,nie-ma,kontrpressing&tytul=Tydzie%C5%84%201', ids)).toMatchObject({
      ids: ['atak-2v1', 'kontrpressing'],
      title: 'Tydzień 1',
    })
    expect(readSetFromHash('', ids)).toBeNull()
  })
})
