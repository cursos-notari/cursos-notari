import { ScrollRevealWrapper } from '@/providers/scroll-review-wrapper';
import { Classes, Hero, Learning, Professor, Public } from '@/components/landing';
import styles from './landing.module.css';

export default async function LandingPage() {
  return (
    <ScrollRevealWrapper>
      <div className={styles.landingMain}>
        <Hero />
        <Public />
        <Learning />
        <Professor />
        <Classes />
      </div>
    </ScrollRevealWrapper>
  );
}