'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Users,
  ShieldCheck,
  Award,
  X,
  ZoomIn,
  Heart,
  Plane,
  Briefcase,
  Cake,
  Gem,
  Baby,
  Home as HomeIcon,
  Palette,
  Camera,
  MessagesSquare,
  ClipboardList,
  PenTool,
  PartyPopper,
  Phone,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Quote,
} from 'lucide-react';
import { GoldButton } from '@/components/ui/gold-button';
import { LazyVideo } from '@/components/ui/lazy-video';
import { GlassCard } from '@/components/ui/glass-card';
import { TraditionalBorder } from '@/components/ui/traditional-border';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { SITE, SITE_STATS, getWhatsAppUrl } from '@/lib/site-config';
import { getTestimonials, TestimonialWithVerification } from '@/lib/data/testimonials';
import { SharedImageLightbox } from '@/components/ui/shared-image-lightbox';

export default function HomePage() {
  const [galleryCategory, setGalleryCategory] = useState<string>('all');
  const [activeLightbox, setActiveLightbox] = useState<{
    images: string[];
    index: number;
    title?: string;
    subtitle?: string;
  } | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<TestimonialWithVerification[]>([]);

  useEffect(() => {
    getTestimonials().then(setTestimonials);
  }, []);

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const statIcons = [
    <Award key="i1" className="w-5 h-5 text-gold-500" />,
    <Calendar key="i2" className="w-5 h-5 text-gold-500" />,
    <Users key="i3" className="w-5 h-5 text-gold-500" />,
    <ShieldCheck key="i4" className="w-5 h-5 text-gold-500" />,
  ];
  const stats = SITE_STATS.map((s, i) => ({ ...s, icon: statIcons[i] }));


  const whyChooseUs = [
    { title: 'End-to-End Planning', desc: 'From the first consultation to cleanup, one team manages the whole event.' },
    { title: 'Customized Experiences', desc: 'Every event is built around your vision and budget, not a fixed template.' },
    { title: 'Experienced Team', desc: '10+ years of hands-on event execution across Karnataka.' },
    { title: 'Creative Event Concepts', desc: 'Fresh décor and staging ideas for weddings, corporate events and celebrations.' },
    { title: 'Trusted Across Karnataka', desc: `${SITE.googleRating} average rating from 100+ clients we've worked with.` },
    { title: 'Attention To Every Detail', desc: 'From seating charts to lighting cues, nothing is left to chance.' },
  ];

  const processSteps = [
    { num: '01', title: 'Consultation', desc: 'Understanding your vision, guest count and budget.', icon: <MessagesSquare className="w-5 h-5" /> },
    { num: '02', title: 'Planning', desc: 'A detailed blueprint covering every vendor and timeline.', icon: <ClipboardList className="w-5 h-5" /> },
    { num: '03', title: 'Design', desc: 'Décor concepts, stage design and lighting finalized with you.', icon: <PenTool className="w-5 h-5" /> },
    { num: '04', title: 'Execution', desc: 'Vendor coordination and day-of management, handled by our team.', icon: <Award className="w-5 h-5" /> },
    { num: '05', title: 'Celebration', desc: 'You enjoy the event while we manage the details in the background.', icon: <PartyPopper className="w-5 h-5" /> },
  ];

  const pillars = [
    {
      id: 'photography',
      title: 'Photography',
      subtitle: 'Traditional, Candid & Cinematic Coverage',
      desc: 'Traditional and candid photography and videography, drone coverage, LED wall and live streaming.',
      img: '/photography-videography-collage.jpg',
      badge: 'PHOTOGRAPHY',
      href: '/gallery',
      cta: 'Explore Gallery',
    },
    {
      id: 'decoration',
      title: 'Decoration',
      subtitle: 'Silver, Gold & Platinum Tier Décor',
      desc: 'Stage, manthapa, entrance and home decor in Silver, Gold and Platinum tiers with floral and lighting design.',
      img: '/sid-party29.jpeg',
      badge: 'DECORATION',
      href: '/gallery',
      cta: 'Explore Gallery',
    },
    {
      id: 'catering',
      title: 'Catering',
      subtitle: 'Full South Indian Breakfast, Lunch & Dinner Menus',
      desc: 'Full South Indian menus for breakfast, lunch and dinner - from welcome drinks and starters to desserts and paan.',
      img: '/onam-sadhya-lunch-menu-1.webp',
      badge: 'CATERING',
      href: '/gallery',
      cta: 'Explore Gallery',
    },
  ];

  const galleryShowcase = [
    {
      title: 'Tropical Floral Reception Backdrop',
      category: 'manthapa',
      categoryLabel: 'Manthapa',
      url: '/sid-party25.jpeg',
    },
    {
      title: 'Traditional Saptapadi Muhurtham Ceremony',
      category: 'rituals',
      categoryLabel: 'Rituals',
      url: '/sid-party7.jpeg',
    },
    {
      title: 'Authentic South Indian Feast',
      category: 'sadhya',
      categoryLabel: 'Sadhya Feast',
      url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Kanchipuram Silk Bridal Portrait & Jewelry',
      category: 'bridal',
      categoryLabel: 'Bridal Portraits',
      url: '/sid-party9.jpeg',
    },
    {
      title: 'Vibrant Floral Wall Art Decoration',
      category: 'manthapa',
      categoryLabel: 'Manthapa',
      url: '/sid-party22.jpeg',
    },
    {
      title: 'Live Auspicious Nadaswaram & Thavil Recital',
      category: 'rituals',
      categoryLabel: 'Rituals',
      url: '/ChatGPT Image Jul 28, 2026, 04_57_21 PM.jpg',
    },
  ];

  const filteredGallery = galleryCategory === 'all'
    ? galleryShowcase
    : galleryShowcase.filter((g) => g.category === galleryCategory);

  return (
    <main className="bg-silk-100 text-maroon-900 min-h-screen relative pb-12 font-sans">
      
      {/* 1. CINEMATIC HERO SECTION ("Royal South Indian Sanctum") */}
      <section className="relative min-h-screen-dvh flex items-center justify-center bg-maroon-950 text-silk-50 px-5 sm:px-8 overflow-hidden pt-16 pb-12 sm:pt-20 sm:pb-16">
        
        {/* Background Video rotated 90 degrees to the left with Warm Ambient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center bg-maroon-950">
          <LazyVideo
            src="/sid-video1.mp4"
            className="absolute top-1/2 left-1/2 object-cover opacity-85 pointer-events-none"
            style={{
              width: 'max(160dvh, 160vw)',
              height: 'max(160vw, 160dvh)',
              minWidth: '110dvh',
              minHeight: '110vw',
              transform: 'translate(-50%, -50%) rotate(-90deg)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/30 to-maroon-950/40" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-5 sm:space-y-8 py-6 sm:py-10">
          
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-transparent border border-gold-400/60 backdrop-blur-sm text-gold-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-lg"
          >
            {SITE.tagline.toUpperCase()}
          </motion.div>

          {/* Main Display Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-playfair font-bold tracking-tight leading-[1.15] text-silk-50 px-2"
          >
            Crafting Extraordinary Celebrations <br />
            <span className="gold-text-foil font-script block mt-1 sm:mt-2">Creating Timeless Memories</span>
          </motion.h1>

          {/* Subtitle Paragraph */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gold-100/90 max-w-2xl mx-auto font-sans leading-relaxed font-light px-2"
          >
            From dream weddings to grand corporate experiences, SID Events transforms every occasion in {SITE.city}, {SITE.state}{' '}into an unforgettable celebration &mdash; with a live custom wedding package builder to plan every detail.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2"
          >
            <Link href="/custom-builder">
              <GoldButton size="lg" variant="gold">
                Plan Your Event
              </GoldButton>
            </Link>
            <Link href="/gallery">
              <GoldButton
                size="lg"
                variant="outline"
                className="!bg-transparent !text-silk-50 !border-silk-50/50 hover:!bg-silk-50/10"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Work
              </GoldButton>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="max-w-[1600px] mx-auto px-4 -mt-8 sm:-mt-10 relative z-20">
        <div className="bg-silk-50 border-2 border-gold-400/40 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-maroon-900">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-1 sm:space-y-2 border-r last:border-0 border-gold-400/20 px-1 sm:px-2">
              <div className="flex justify-center">{stat.icon}</div>
              <div className="text-xl sm:text-4xl font-bold font-heading maroon-text-gradient">
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="text-[8px] sm:text-[10px] uppercase font-bold text-maroon-700 tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>



      {/* 3. LATEST SERVICES */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="font-script-sm text-gold-600 block">
            Heritage Craftsmanship
          </span>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-maroon-950">
            The Three Things Every <span className="font-script text-gold-500 font-normal">Muhurtham Needs</span>
          </h2>
          <p className="text-sm text-maroon-800/80 leading-relaxed font-sans">
            The décor, the feast and the coverage &mdash; these are the three categories most families start with, and where our custom builder begins too.
          </p>
          <TraditionalBorder />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((p, idx) => (
            <Link
              key={idx}
              href="/gallery"
              className="group flex flex-col justify-between bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left border border-gold-200/50 cursor-pointer"
            >
              <div className="relative h-96 sm:h-[440px] lg:h-[500px] w-full overflow-hidden">
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/50 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-maroon-900/90 text-gold-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-gold-400/40 backdrop-blur-md shadow-md">
                  {p.badge}
                </span>

                <div className="absolute top-4 right-4 bg-maroon-950/80 text-gold-300 p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity border border-gold-400/30">
                  <ArrowRight className="w-4 h-4" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-silk-50">
                  <span className="text-[10px] font-semibold text-gold-300 bg-maroon-950/80 px-2.5 py-1 rounded-full border border-gold-400/30 inline-flex items-center gap-1.5 backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 text-gold-400" /> View in Gallery ↗
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-3">
                <h3 className="font-playfair text-2xl font-bold text-maroon-950 group-hover:text-gold-600 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs font-bold text-gold-700 uppercase tracking-wider">{p.subtitle}</p>
                <p className="text-xs text-maroon-800/80 leading-relaxed font-sans">{p.desc}</p>

                <div className="pt-3 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-maroon-800 group-hover:text-gold-600 transition-colors">
                    {p.cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. WEDDING SHOWCASE */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gold-400/30 pb-6">
          <div>
            <span className="font-script-sm text-gold-600 block">Visual Heritage</span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-maroon-950">
              South Indian <span className="font-script text-gold-500 font-normal">Wedding Showcase</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Showcase' },
              { id: 'manthapa', label: 'Manthapas' },
              { id: 'rituals', label: 'Rituals' },
              { id: 'sadhya', label: 'Sadhya Feast' },
              { id: 'bridal', label: 'Bridal Portraits' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setGalleryCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  galleryCategory === cat.id
                    ? 'bg-maroon-800 text-gold-300 shadow'
                    : 'bg-silk-200 text-maroon-900 hover:bg-gold-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredGallery.map((item, i) => (
            <Link
              key={i}
              href="/gallery"
              className="group relative h-96 sm:h-[420px] rounded-3xl overflow-hidden shadow-lg cursor-pointer border border-gold-400/30 block"
            >
              <Image
                src={item.url}
                alt={item.title}
                fill
                sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/60 via-transparent to-transparent opacity-50 group-hover:opacity-75 transition-opacity" />

              <div className="absolute top-4 right-4 bg-maroon-950/80 text-gold-300 p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity border border-gold-400/30">
                <ArrowRight className="w-5 h-5" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-silk-50">
                <span className="text-[10px] uppercase font-bold text-gold-300 bg-maroon-950/80 px-2.5 py-0.5 rounded border border-gold-400/30">
                  {item.categoryLabel || (item.category === 'manthapa' ? 'Manthapa' : item.category)}
                </span>
                <h4 className="font-playfair text-lg font-bold text-silk-50 mt-1 group-hover:text-gold-300 transition-colors">{item.title}</h4>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5B. WHY CHOOSE US */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="font-script-sm text-gold-600 block">
            The SID Distinction
          </span>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-maroon-950">
            What Makes Us <span className="font-script text-gold-500 font-normal">Different</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6">
          {whyChooseUs.map((item, idx) => (
            <div key={idx} className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gold-200/40 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-maroon-900 text-gold-300 flex items-center justify-center text-xs font-bold font-heading">
                {idx + 1}
              </div>
              <h3 className="font-playfair text-base font-bold text-maroon-900">{item.title}</h3>
              <p className="text-xs text-maroon-700/80 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. VERIFIED CLIENT TESTIMONIALS (Single Review Slider with Side Navigation Buttons) */}
      <section className="bg-silk-50 text-maroon-950 py-20 border-t-2 border-gold-400/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="font-script-sm text-gold-600 block">
              Client Gratitude
            </span>
            <h2 className="font-playfair text-3xl sm:text-5xl font-bold maroon-text-gradient">
              Words From <span className="font-script text-gold-500 font-normal">Happy Families</span>
            </h2>
            <TraditionalBorder />
          </div>

          {/* Testimonial Single Card Slider */}
          {testimonials.length === 0 ? null : (
          <>
          <div className="relative flex items-center justify-between gap-3 sm:gap-6">

            {/* Desktop Left Previous Button */}
            <button
              onClick={handlePrevTestimonial}
              className="hidden sm:flex p-3 sm:p-4 rounded-full bg-white text-maroon-900 hover:bg-gold-400 hover:text-maroon-950 border-2 border-gold-400/60 shadow-lg transition-all shrink-0 cursor-pointer hover:scale-110"
              aria-label="Previous Review"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Active Single Review Card */}
            <div className="w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard variant="light" className="flex flex-col justify-between space-y-6 p-5 sm:p-10 border-2 border-gold-400/50 relative shadow-xl bg-white">
                    <Quote className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-12 sm:h-12 text-gold-400/20" />
                    
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex gap-1 text-gold-500">
                            {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                            ))}
                          </div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] sm:text-[11px] font-bold shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Google Verified
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-maroon-800 bg-gold-100 px-2.5 py-1 rounded-full border border-gold-300 self-start sm:self-auto">
                          Review {testimonialIndex + 1} of {testimonials.length}
                        </span>
                      </div>

                      <p className="text-sm sm:text-base text-maroon-900 italic leading-relaxed font-sans pr-2 sm:pr-6">
                        &ldquo;{testimonials[testimonialIndex].comment}&rdquo;
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 border-t border-gold-300/60">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-maroon-800 to-maroon-950 text-gold-300 font-bold font-playfair flex items-center justify-center border-2 border-gold-400/70 shadow-md text-xs sm:text-sm shrink-0 uppercase">
                          {testimonials[testimonialIndex].coupleNames.split(/\s+/).map((n: string) => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-playfair text-base sm:text-lg font-bold text-maroon-950">
                            {testimonials[testimonialIndex].coupleNames}
                          </h4>
                          <p className="text-xs text-maroon-700">
                            {testimonials[testimonialIndex].location}
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 self-start sm:self-auto">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Verified Google Review
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop Right Next Button */}
            <button
              onClick={handleNextTestimonial}
              className="hidden sm:flex p-3 sm:p-4 rounded-full bg-white text-maroon-900 hover:bg-gold-400 hover:text-maroon-950 border-2 border-gold-400/60 shadow-lg transition-all shrink-0 cursor-pointer hover:scale-110"
              aria-label="Next Review"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Mobile Controls & Dots Indicator */}
          <div className="flex items-center justify-between sm:justify-center gap-2 sm:gap-4 pt-2 overflow-hidden max-w-full">
            <button
              onClick={handlePrevTestimonial}
              className="p-2 sm:p-2.5 rounded-full bg-white text-maroon-900 hover:bg-gold-400 border-2 border-gold-400/60 shadow-md transition-all sm:hidden cursor-pointer shrink-0"
              aria-label="Previous Review"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Mobile: show text counter instead of dots */}
            <div className="sm:hidden text-center">
              <span className="text-xs font-bold text-maroon-900">
                {testimonialIndex + 1} / {testimonials.length}
              </span>
            </div>

            {/* Desktop: show dots */}
            <div className="hidden sm:flex justify-center items-center gap-1.5 sm:gap-2 flex-wrap max-w-full">
              {testimonials.map((_: TestimonialWithVerification, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setTestimonialIndex(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    testimonialIndex === idx
                      ? 'w-6 sm:w-8 h-2.5 bg-maroon-900'
                      : 'w-2.5 h-2.5 bg-gold-400/40 hover:bg-gold-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNextTestimonial}
              className="p-2 sm:p-2.5 rounded-full bg-white text-maroon-900 hover:bg-gold-400 border-2 border-gold-400/60 shadow-md transition-all sm:hidden cursor-pointer shrink-0"
              aria-label="Next Review"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          </>
          )}
        </div>
      </section>

      {/* 7. LIVE WEDDING COUNTDOWN */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <CountdownTimer title="Upcoming Royal Muhurtham Countdown" />
      </section>

      {/* 8. FINAL CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="bg-maroon-950 rounded-2xl sm:rounded-3xl p-6 sm:p-16 text-center space-y-5 sm:space-y-6 border border-gold-400/30 relative overflow-hidden">
          <div className="relative z-10 space-y-5 sm:space-y-6">
            <h2 className="font-playfair font-bold text-silk-50">
              Let&apos;s Create Something <span className="gold-text-foil font-script block sm:inline mt-1 sm:mt-0">Extraordinary Together</span>
            </h2>
            <p className="text-gold-100/80 max-w-xl mx-auto">
              Your event deserves careful planning and flawless execution. Tell us what you have in mind.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Link href="/contact">
                <GoldButton variant="gold" size="lg" icon={<Phone className="w-5 h-5" />}>
                  Get Free Consultation
                </GoldButton>
              </Link>
              <a href={getWhatsAppUrl('Hi! I would like to plan an event with SID Events.')} target="_blank" rel="noopener noreferrer">
                <GoldButton variant="dark" size="lg" icon={<MessagesSquare className="w-5 h-5" />}>
                  Message Us on WhatsApp
                </GoldButton>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SHARED LIGHTBOX MODAL */}
      {activeLightbox && (
        <SharedImageLightbox
          images={activeLightbox.images}
          initialIndex={activeLightbox.index}
          isOpen={true}
          onClose={() => setActiveLightbox(null)}
          title={activeLightbox.title}
          subtitle={activeLightbox.subtitle}
        />
      )}
    </main>
  );
}
