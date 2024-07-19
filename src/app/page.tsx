import { Banner, CustomGuide, Hero, KeydeukBest, KeydeukPick, TextTickerSection } from './_components';

export default async function Home() {
  return (
    <>
      <Hero />
      <CustomGuide />
      <TextTickerSection />
      <KeydeukPick />
      <KeydeukBest />
      <Banner />
    </>
  );
}
