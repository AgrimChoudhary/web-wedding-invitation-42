import React, { useRef, useState, useEffect } from 'react';
import { Calendar, Music, Heart, MapPin, ExternalLink, Crown, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWedding } from '@/context/WeddingContext';
import { Button } from '@/components/ui/button';

interface Event {
  name: string;
  date: string;
  time: string;
  venue: string;
  mapLink?: string;
  icon: React.ReactNode;
  color: string;
}

const EventTimeline: React.FC = () => {
  const [visibleEvents, setVisibleEvents] = useState<number[]>([]);
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();
  const { weddingData } = useWedding();
  
  // Convert wedding data events to timeline events
  const events: Event[] = weddingData.events.map((event, index) => {
    const icons = [
      <div key="mehendi" className="p-2 rounded-full bg-gradient-to-br from-red-100 to-red-200 text-red-600 shadow-lg border border-red-300"><Heart size={18} /></div>,
      <div key="sangeet" className="p-2 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-600 shadow-lg border border-yellow-300"><Music size={18} /></div>,
      <div key="wedding" className="p-2 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 shadow-lg border border-purple-300"><Crown size={18} /></div>,
      <div key="reception" className="p-2 rounded-full bg-gradient-to-br from-green-100 to-green-200 text-green-600 shadow-lg border border-green-300"><Sparkles size={18} /></div>,
    ];
    
    const colors = [
      "bg-gradient-to-br from-red-50/90 to-red-100/70",
      "bg-gradient-to-br from-yellow-50/90 to-yellow-100/70",
      "bg-gradient-to-br from-purple-50/90 to-purple-100/70",
      "bg-gradient-to-br from-green-50/90 to-green-100/70"
    ];

    return {
      name: event.name,
      date: new Date(event.date).toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }),
      time: event.time,
      venue: `${event.venue}, ${event.address}`,
      mapLink: event.mapLink,
      icon: icons[index % icons.length],
      color: colors[index % colors.length]
    };
  });
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = eventRefs.current.indexOf(entry.target as HTMLDivElement);
          if (entry.isIntersecting && index !== -1 && !visibleEvents.includes(index)) {
            setVisibleEvents(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    eventRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => observer.disconnect();
  }, [visibleEvents]);

  const handleEventHover = (index: number) => {
    setActiveEvent(index);
  };

  const handleEventLeave = () => {
    setActiveEvent(null);
  };

  return (
    <section className="w-full py-16 bg-gradient-to-br from-wedding-cream/60 via-wedding-blush/5 to-wedding-cream/60 relative overflow-hidden">
      {/* Royal background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-wedding-maroon/5"></div>
      <div className="absolute top-20 left-20 w-3 h-3 bg-wedding-gold/40 rounded-full animate-pulse"></div>
      <div className="absolute bottom-24 right-24 w-4 h-4 bg-wedding-maroon/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-32 right-32 w-2 h-2 bg-wedding-gold/50 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>

      <div className="w-full max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown size={24} className="text-wedding-gold animate-pulse" />
            <span className="inline-block py-2 px-6 bg-gradient-to-r from-wedding-gold/20 to-wedding-maroon/20 rounded-full text-base font-semibold text-wedding-gold border border-wedding-gold/30 tracking-wider shadow-lg">
              Royal Celebrations
            </span>
            <Crown size={24} className="text-wedding-gold animate-pulse" />
          </div>
          <h2 className="font-great-vibes text-4xl md:text-5xl text-wedding-maroon mb-4 drop-shadow-lg">Wedding Timeline</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6 text-lg">
            Join us for these magnificent celebrations as we embark on our eternal journey together
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-wedding-gold/60 to-wedding-gold"></div>
            <Sparkles size={16} className="text-wedding-gold animate-pulse" />
            <div className="h-[2px] w-20 bg-gradient-to-l from-transparent via-wedding-gold/60 to-wedding-gold"></div>
          </div>
        </div>
        
        <div className="relative">
          {/* Enhanced timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-wedding-gold/30 via-wedding-gold/60 to-wedding-gold/30 transform -translate-x-1/2 shadow-lg rounded-full"></div>
          
          <div className="space-y-8">
            {events.map((event, index) => (
              <div 
                key={index}
                ref={el => eventRefs.current[index] = el}
                className={`relative flex flex-col md:flex-row ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                } items-center md:items-start gap-6 md:gap-8 ${
                  visibleEvents.includes(index) 
                    ? 'opacity-100 transform translate-y-0 transition-all duration-1000 ease-out' 
                    : 'opacity-0 transform translate-y-16'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
                onMouseEnter={() => handleEventHover(index)}
                onMouseLeave={handleEventLeave}
              >
                {/* Enhanced timeline dot */}
                <div className="hidden md:flex absolute left-1/2 w-14 h-14 bg-gradient-to-br from-wedding-gold via-wedding-gold/90 to-wedding-gold/70 rounded-full transform -translate-x-1/2 items-center justify-center z-10 transition-all duration-500 shadow-2xl border-4 border-white royal-timeline-dot">
                  <div className={`w-6 h-6 bg-wedding-cream rounded-full transition-all duration-500 shadow-inner ${activeEvent === index ? 'scale-75 bg-wedding-gold/20' : 'scale-100'}`}></div>
                  {activeEvent === index && (
                    <>
                      <div className="absolute inset-0 bg-wedding-gold/40 rounded-full animate-ping"></div>
                      <div className="absolute inset-0 bg-wedding-gold/20 rounded-full animate-pulse"></div>
                    </>
                  )}
                </div>
                
                {/* Royal event card */}
                <div 
                  className={`royal-event-card md:w-5/12 w-full p-6 transition-all duration-500 ${
                    activeEvent === index ? 'royal-event-active' : ''
                  } ${event.color}`}
                >
                  {/* Decorative corner elements */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-wedding-gold/40 rounded-tl-lg"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-wedding-gold/40 rounded-tr-lg"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-wedding-gold/40 rounded-bl-lg"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-wedding-gold/40 rounded-br-lg"></div>
                  
                  <div className="flex items-start gap-5 relative z-10">
                    <div className={`flex-shrink-0 transition-all duration-500 ${activeEvent === index ? 'transform scale-110 rotate-12' : ''}`}>
                      {event.icon}
                    </div>
                    <div className="w-full">
                      <h3 className="font-great-vibes text-2xl md:text-3xl text-wedding-maroon mb-3 flex items-center gap-3">
                        {event.name}
                        {activeEvent === index && <Sparkles size={18} className="text-wedding-gold animate-pulse" />}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-700">
                          <Calendar size={16} className="mr-3 text-wedding-gold" />
                          <span className="font-semibold text-lg">{event.date}</span>
                        </div>
                        <p className="text-gray-600 pl-7 text-base">{event.time}</p>
                        {event.venue && <p className="text-gray-700 font-medium pl-7 text-base">{event.venue}</p>}
                        
                        {event.mapLink && (
                          <div className="pl-7 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="h-9 px-4 bg-gradient-to-r from-wedding-gold/10 to-wedding-gold/20 hover:from-wedding-gold/20 hover:to-wedding-gold/30 border-wedding-gold/40 hover:border-wedding-gold/60 text-wedding-maroon transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                              <a 
                                href={event.mapLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <MapPin size={14} />
                                <span>View Location</span>
                                <ExternalLink size={12} />
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block md:w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Royal styling */}
      <style>{`
        .royal-event-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,249,239,0.9) 100%);
          border: 2px solid transparent;
          border-radius: 20px;
          box-shadow: 
            0 8px 32px rgba(139,69,19,0.1), 
            0 4px 16px rgba(212,175,55,0.15),
            inset 0 1px 0 rgba(255,255,255,0.8);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
          background-clip: padding-box;
        }

        .royal-event-card::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 2px;
          background: linear-gradient(45deg, 
            rgba(212,175,55,0.8) 0%, 
            rgba(139,69,19,0.4) 25%,
            rgba(212,175,55,0.6) 50%,
            rgba(139,69,19,0.3) 75%,
            rgba(212,175,55,0.8) 100%
          );
          border-radius: 20px;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: xor;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          opacity: 0.6;
          transition: opacity 0.5s ease;
        }

        .royal-event-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent);
          transition: left 0.8s ease;
        }

        .royal-event-card:hover::after {
          left: 100%;
        }

        .royal-event-card:hover::before {
          opacity: 1;
        }

        .royal-event-active {
          transform: scale(1.03);
          box-shadow: 
            0 16px 64px rgba(139,69,19,0.2), 
            0 8px 32px rgba(212,175,55,0.3),
            0 0 40px rgba(212,175,55,0.15),
            inset 0 1px 0 rgba(255,255,255,0.9);
        }

        .royal-event-active::before {
          background: linear-gradient(45deg, 
            rgba(212,175,55,1) 0%, 
            rgba(139,69,19,0.6) 25%,
            rgba(212,175,55,0.8) 50%,
            rgba(139,69,19,0.5) 75%,
            rgba(212,175,55,1) 100%
          );
          background-size: 200% 200%;
          animation: royal-border-glow 3s ease infinite;
          opacity: 1;
        }

        .royal-timeline-dot {
          box-shadow: 
            0 0 20px rgba(212,175,55,0.5),
            0 0 40px rgba(212,175,55,0.3),
            0 8px 16px rgba(139,69,19,0.2);
        }

        .royal-timeline-dot:hover {
          box-shadow: 
            0 0 30px rgba(212,175,55,0.7),
            0 0 60px rgba(212,175,55,0.4),
            0 12px 24px rgba(139,69,19,0.3);
        }

        @keyframes royal-border-glow {
          0%, 100% { 
            background-position: 0% 50%;
            background-size: 200% 200%;
          }
          50% { 
            background-position: 100% 50%;
            background-size: 300% 300%;
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default EventTimeline;