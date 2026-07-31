import Image from 'next/image'

function FeatureCard({ title, body, src, alt }: { title: string; body: string; src: string; alt: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl p-6 border bg-white border-[#EAF3F3]">
      <h3
        className="text-lg font-semibold mb-2 font-jost text-brand-heading"
      >
        {title}
      </h3>
      <p className="text-sm text-brand-text">
        {body}
      </p>
      <div>
        <Image 
            src={src} 
            alt={alt} 
            width={200} 
            height={10} 
            className=""
        />
      </div>
      
    </div>
  );
}

export default function Features(){
    return(
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            title="Perimeter-checked clock-in"
            body="Staff can only clock in from inside a manager-defined radius around each site, so records reflect where care actually happened."
            src="/card1.png"
            alt="illustration"
          />
          <FeatureCard
            title="Live staff overview"
            body="See who's clocked in right now, where, and since when in one table, no chasing people down. Get a live staff overview."
            src="/card2.png"
            alt="illustration"
          />
          <FeatureCard
            title="Hours that add up"
            body="Average hours per day, clock-ins per day, and total hours per staff member over the last week, calculated for you."
            src="/card3.png"
            alt="illustration"
          />
        </div>
      </section>
    )
}