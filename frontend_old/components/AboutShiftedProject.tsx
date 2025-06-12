import React from 'react';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-2xl sm:text-3xl font-semibold text-main-accent mb-4 sm:mb-6">{children}</h2>
);

const Paragraph: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <p className={`text-text-primary text-base sm:text-lg leading-relaxed mb-6 ${className}`}>{children}</p>
);

const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="text-text-primary text-base sm:text-lg leading-relaxed mb-2 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-main-accent">
    {children}
  </li>
);

const AboutShiftedProject: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-3 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-12 my-8">
      <header className="text-center mb-10 sm:mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-3">
          <span className="text-main-accent">About </span><span className="text-highlight">Shifted Project</span>
        </h1>
        <p className="text-xl sm:text-2xl text-text-secondary font-light">
          Menantang Stigma. Membuka Sudut Pandang. Memperluas Wawasan.
        </p>
      </header>

      <section className="mb-10 sm:mb-12">
        <SectionTitle>Our Mission</SectionTitle>
        <Paragraph>
          Menyuguhkan konten edukatif dengan pendekatan ringan dan kreatif. 
          Menyuarakan opini dari berbagai sudut pandang tanpa polarisasi. 
          Memberikan ruang ekspresi dan dialog terhadap hal-hal yang dianggap tabu atau sepele.
        </Paragraph>
      </section>

      <section className="mb-10 sm:mb-12">
        <SectionTitle>Our Vision</SectionTitle>
        <Paragraph>
          Menjadi media edukasi berbasis naratif, reflektif, dan multi-perspektif yang 
          menggeser cara pandang anak muda terhadap isu-isu kompleks.
        </Paragraph>
      </section>

      <section className="mb-10 sm:mb-12">
        <SectionTitle>Our Core Belief</SectionTitle>
        <Paragraph>
          Kami percaya bahwa perubahan tidak selalu tentang benar atau salah, tapi tentang berani 
          melihat dari sisi yang jarang disorot. Dengan gaya komunikatif, naratif, dan reflektif – 
          kami tidak datang untuk menggurui, tapi untuk mengajak berpikir.
        </Paragraph>
      </section>

      <section>
        <SectionTitle>Content Formats</SectionTitle>
        <ul className="list-none p-0 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          <ListItem>Monolog Naratif (Voiceover Thought)</ListItem>
          <ListItem>Dialog imajinatif (Karakter Fiksi Diskusi)</ListItem>
          <ListItem>Video Essay Pop Culture</ListItem>
          <ListItem>Storytelling Reflektif (Cerpen Visual)</ListItem>
          <ListItem>Eksperimen Sosial & Mini Interview</ListItem>
        </ul>
      </section>
    </div>
  );
};

export default AboutShiftedProject;