import { TradeCenterIntro } from '../../components/trade/TradeCenterIntro'
import { TradeListingsPanel } from '../../components/trade/TradeListingsPanel'
import { YourCollectionTradePanel } from '../../components/trade/YourCollectionTradePanel'
import { YourListedVinyls } from '../../components/trade/YourListedVinyls'

export default function TradePage() {
  return (
    <main className="flex-1 space-y-6">
      <TradeCenterIntro />

      <section className="grid gap-4 lg:grid-cols-[minmax(230px,0.95fr)_minmax(0,2.1fr)]">
        <YourCollectionTradePanel />
        <TradeListingsPanel />
      </section>

      <YourListedVinyls />
    </main>
  )
}
