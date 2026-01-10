import { ScrollRevealWrapper } from '@/providers/scroll-review-wrapper';
import { Classes, Hero, Learning, Professor, Public } from '@/components/landing';
import Header from '@/components/landing/header';

export default async function LandingPage() {
  return (
    <ScrollRevealWrapper>
      <div className="h-screen [&>section]:flex [&>section]:min-h-screen [&>section]:h-screen [&>section]:py-10 [&>section]:px-15 [&>section]:border-b [&>section]:border-gray-200">
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