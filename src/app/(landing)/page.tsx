import { ScrollRevealWrapper } from '@/providers/scroll-review-wrapper';
import { Classes, Hero, Learning, Professor, Public } from '@/components/landing';
import Header from '@/components/landing/header';

export default async function LandingPage() {
  return (
    <ScrollRevealWrapper>
      <div className="h-screen [&>section]:flex [&>section]:min-h-screen [&>section]:py-[3.3%] [&>section]:px-[5%] [&>section]:border-b-2 [&>section]:border-(--primary-gray)">
        <Header/>
        <Hero />
        <Public />
        <Learning />
        <Professor />
        <Classes />
      </div>
    </ScrollRevealWrapper>
  );
}