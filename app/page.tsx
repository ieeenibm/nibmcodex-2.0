import Hero from '@/components/hero'
import About from '@/components/about'
import Timeline from '@/components/timeline'
import VerticalScroll from '@/components/vertical-scroll'
import OrganizingCommittee from '@/components/organizing-committee'
import Registration from '@/components/registration'
import Sponsors from '@/components/sponsors'
import FAQ from '@/components/faq'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      <Hero />
      <About />
      <Timeline />
      <VerticalScroll />
      <OrganizingCommittee />
      <Sponsors />
      <FAQ />
      <Registration />
      <Footer />
    </main>
  )
}
