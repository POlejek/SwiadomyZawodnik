import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { obrona2v1Skrzydlo as sc } from './scenarios/obrona2v1Skrzydlo'

const skip = (user) => user.click(screen.getByRole('button', { name: 'Pomiń animację' }))

describe('App', () => {
  beforeEach(() => localStorage.clear())

  it('plays the whole situation: wrong answer, retry, then the right decisions to the summary', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByRole('combobox', { name: /Czas na decyzję/ }), '0') // no clock in tests
    await user.click(screen.getAllByRole('button', { name: 'Graj' })[0])

    // Stage 1 — wrong answer first.
    await skip(user)
    expect(screen.getByRole('heading', { name: sc.stages[0].question })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Doskakuję do zawodnika/ }))
    await skip(user)
    const fb = screen.getByTestId('feedback')
    expect(within(fb).getByText('Zła decyzja')).toBeInTheDocument()
    expect(within(fb).getByRole('heading', { name: 'Gol dla rywala' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Spróbuj jeszcze raz' }))

    // Then all the right answers.
    for (const st of sc.stages) {
      if (st !== sc.stages[0]) await skip(user)
      const good = st.options.find((o) => o.correct)
      await user.click(screen.getByRole('button', { name: new RegExp(good.label.slice(0, 20)) }))
      await skip(user)
      expect(within(screen.getByTestId('feedback')).getByText('Najlepsza decyzja')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: /Dalej|Podsumowanie/ }))
    }

    const summary = screen.getByTestId('summary')
    expect(within(summary).getByText(/Najlepsze decyzje za pierwszym razem/)).toHaveTextContent('2 z 3')
    await user.click(screen.getByRole('button', { name: 'Inne sytuacje' }))
    expect(screen.getByText(/Rekord:/)).toBeInTheDocument()
  })

  it('answers with the keyboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByRole('combobox', { name: /Czas na decyzję/ }), '0')
    await user.click(screen.getAllByRole('button', { name: 'Graj' })[0])
    await skip(user)
    await user.keyboard('1')
    expect(screen.getByRole('button', { name: 'Pomiń animację' })).toBeInTheDocument()
  })
})
