export default async function AboutPage() {
  return (
    <section className="rounded-2xl bg-[#f6f2ea] px-6 py-10 text-[#0f1230] shadow-lg sm:px-12 sm:py-14">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="space-y-12">
          <div className="flex items-start gap-6">
            <span className="mt-1 h-12 w-1.5 bg-[#121a4d]" aria-hidden="true" />
            <div>
              <p className="text-2xl font-semibold tracking-tight sm:text-3xl">Designer</p>
              <p className="mt-3 text-lg sm:text-xl">Hana Murakami (村上 花)</p>
            </div>
          </div>

          <div className="space-y-3 text-sm leading-relaxed text-[#3b3f58]">
            <p>2000 Born in Japan</p>
            <p>2018 Moved to Australia as an international student</p>
            <p>
              2019 Started Architect disciplines at The University of Melbourne, Bachelor of Design, majoring in
              Architecture.
            </p>
            <p>2023: Graduated the University with First Class Honors (H1) for all architecture studio subjects.</p>
          </div>

          <div className="space-y-4 text-sm text-[#3b3f58]">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#0f1230]">FEATURED</p>
            <div className="space-y-2">
              <p>2020 MSDx Summer (FoDR)</p>
              <div>
                <p>2021 MSDx Winter (Design Studio Alpha)</p>
                <p className="pl-6">MSDx Summer (Design Studio Beta)</p>
              </div>
              <div>
                <p>2022 MSDx Winter (Design Studio Gamma, Digital Design)</p>
                <p className="pl-6">MSDx Summer (Design Studio Delta)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/designerphoto.avif" alt="Hana Murakami portrait" className="w-full rounded-xl object-cover" />
          </div>
        </div>
      </div>

      <div className="mt-16 border-t-4 border-[#0f1230] pt-12">
        <div className="space-y-8 text-sm text-[#3b3f58]">
          <div className="flex items-start gap-6">
            <span className="mt-1 h-10 w-1.5 bg-[#121a4d]" aria-hidden="true" />
            <p className="text-xl font-semibold tracking-tight text-[#0f1230] sm:text-2xl">Skills</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
            <p className="text-[#0f1230]">+ 3 years</p>
            <div className="space-y-1">
              <p>Rhinoceros</p>
              <p>Adobe InDesign</p>
              <p>Adobe illustrator</p>
              <p>Adobe Photoshop</p>
              <p>Google Sheet</p>
              <p>MS Office (Word, Excel, Power Point)</p>
              <p>Wix</p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
            <p className="text-[#0f1230]">+2 years</p>
            <div className="space-y-1">
              <p>Adobe Premier</p>
              <p>Grasshopper</p>
              <p>Twinmotion</p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
            <p className="text-[#0f1230]">0-1 year</p>
            <div className="space-y-1">
              <p>Auto CAD</p>
              <p>Archi CAD</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t-4 border-[#0f1230] pt-12">
        <div className="space-y-6 text-sm leading-relaxed text-[#3b3f58]">
          <div className="flex items-start gap-6">
            <span className="mt-1 h-10 w-1.5 bg-[#121a4d]" aria-hidden="true" />
            <p className="text-xl font-semibold tracking-tight text-[#0f1230] sm:text-2xl">Philosophy</p>
          </div>
          <p>I want to design architecture as if I were writing a poem.</p>
          <p>
            I would like my design to keep supporting someone for a lifelong time. I want to create architecture like
            gentle words, a beautiful poem that stays in one's mind forever and saves us when needed.
          </p>
          <p>
            Our human history has not always been about success and development. During our life, there are moments
            full of sorrow and suffering. We might not only move forward and keep changing in the best way. I would
            like to design architectures that gently embrace many people's lives and walk alongside them.
          </p>
          <p>I want to design so people can feel the pain when they are in pain.</p>
          <p>I want people to feel happy when they are happy.</p>
          <p>I want people to be genuine and honest themselves.</p>
          <p>What kind of space makes it possible?</p>
          <p>For humans to stay to be humans</p>
          <p>For philosophy to forever exist.</p>
          <p>
            Reflecting human emotions in architectural space allows us to merge into space. I believe this makes us
            adore the space we belong to and leads us to love ourselves to have better lives.
          </p>
          <p className="pt-4 text-[#0f1230]">HANA MURAKAMI</p>
        </div>
      </div>
    </section>
  );
}
