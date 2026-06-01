"use client"

import { useState, useEffect, useRef } from "react"
import { Users, DollarSign, Briefcase, Target, Ghost, Calendar, FileSignature, Wallet, PieChart, Activity, UserCheck, Brain, Search, Clock, CheckCircle, Handshake, Rocket, MessageCircle, TrendingUp, ArrowRight, ArrowDown } from "lucide-react"

export default function CULTFORMPresentation() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set([0]))
  const slideRefs = useRef<(HTMLElement | null)[]>([])

  // Calculator state
  const [calcMode, setCalcMode] = useState<"clients" | "total">("clients")
  const [clients, setClients] = useState(20)
  const [averageCheckInput, setAverageCheckInput] = useState("10000")
  const [totalSumInput, setTotalSumInput] = useState("200000")
  const [term, setTerm] = useState(1)
  const [reinvest, setReinvest] = useState(false)
  
  const handleClientsChange = (newCount: number) => {
    const count = Math.max(1, newCount)
    setClients(count)
  }

  const handleCheckChange = (val: string) => setAverageCheckInput(val)
  const handleCheckBlur = () => {
    let num = parseInt(averageCheckInput) || 500
    num = Math.max(500, Math.round(num / 500) * 500)
    setAverageCheckInput(num.toString())
  }

  const handleTotalSumChange = (val: string) => setTotalSumInput(val)
  const handleTotalSumBlur = () => {
    let num = parseInt(totalSumInput) || 500
    num = Math.max(500, Math.round(num / 500) * 500)
    setTotalSumInput(num.toString())
  }

  const averageCheck = parseInt(averageCheckInput) || 10000
  const totalSum = parseInt(totalSumInput) || 200000
  
  const initialInvestments = calcMode === "clients" ? clients * averageCheck : totalSum
  const startBonus = initialInvestments * 0.03
  
  // Calculate compounding
  const termMonths = term * 12
  let currentPrinters = Math.floor(initialInvestments / 500)
  let cashPool = initialInvestments % 500
  
  const firstMonthPassive = currentPrinters * 500 * 0.025
  let totalBdPassiveIncome = 0
  let lastMonthPassive = firstMonthPassive

  for (let i = 1; i <= termMonths; i++) {
    // 1. Calculate BD income for the CURRENT month
    const bdIncome = currentPrinters * 500 * 0.025
    totalBdPassiveIncome += bdIncome
    
    if (i === termMonths) {
      lastMonthPassive = bdIncome
    }

    // 2. Client gets profit at the end of the month
    const clientProfit = currentPrinters * 500 * 0.06
    
    // 3. Reinvestment happens at the end of the month, expanding pool for NEXT month
    if (reinvest) {
      cashPool += clientProfit
      const newPrinters = Math.floor(cashPool / 500)
      currentPrinters += newPrinters
      cashPool -= newPrinters * 500
    }
  }

  const totalEarned = startBonus + totalBdPassiveIncome
  const avgMonthlyPassive = totalBdPassiveIncome / termMonths

  const slides = [
    { num: "01", label: "ГЛАВНАЯ" },
    { num: "02", label: "ПРЕДЛОЖЕНИЕ" },
    { num: "03", label: "ЦЕННОСТЬ" },
    { num: "04", label: "УСЛОВИЯ" },
    { num: "05", label: "НАВЫКИ" },
    { num: "06", label: "ДЕЯТЕЛЬНОСТЬ" },
    { num: "07", label: "КАЛЬКУЛЯТОР" },
    { num: "08", label: "МИССИЯ" },
  ]

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    slideRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSlide(index)
                setVisibleSections((prev) => new Set([...prev, index]))
              }
            })
          },
          { threshold: 0.2 }
        )
        observer.observe(ref)
        observers.push(observer)
      }
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  return (
    <div className="bg-background text-foreground min-h-screen font-sans selection:bg-accent/20 selection:text-foreground">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-6 md:px-10 lg:px-16 py-6">
          <button 
            onClick={() => slideRefs.current[0]?.scrollIntoView({ behavior: "smooth" })}
            className="text-sm md:text-base font-medium tracking-[0.3em] text-foreground hover:text-foreground/80 transition-colors"
          >
            CULTFORM
          </button>
          <div className="hidden lg:flex items-center gap-1">
            {slides.map((slide, index) => (
              index !== 0 && (
                <button
                  key={slide.label}
                  onClick={() => slideRefs.current[index]?.scrollIntoView({ behavior: "smooth" })}
                  className={`px-3 py-2 text-[10px] tracking-[0.15em] transition-all duration-500 ${
                    activeSlide === index 
                      ? "text-accent" 
                      : "text-foreground/40 hover:text-foreground/80"
                  }`}
                >
                  {slide.label}
                </button>
              )
            ))}
          </div>
          <div className="lg:hidden flex items-center gap-3">
            <span className="text-[10px] tracking-[0.2em] text-foreground/50">
              {slides[activeSlide]?.label}
            </span>
            <span className="text-sm font-light tabular-nums text-foreground">
              {String(activeSlide + 1).padStart(2, "0")}
              <span className="text-foreground/30">/08</span>
            </span>
          </div>
        </div>
      </nav>

      {/* Slide Progress Indicator */}
      <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => slideRefs.current[index]?.scrollIntoView({ behavior: "smooth" })}
            className={`w-[2px] transition-all duration-500 ${
              activeSlide === index 
                ? "h-8 bg-accent" 
                : "h-4 bg-foreground/20 hover:bg-foreground/40"
            }`}
          />
        ))}
      </div>

      {/* Slide 1 - Hero */}
      <section
        ref={(el) => { slideRefs.current[0] = el }}
        className="min-h-screen flex flex-col justify-between px-6 md:px-10 lg:px-16 pt-32 pb-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[60%] h-[1px] bg-gradient-to-l from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div
          className={`flex-1 flex flex-col justify-center items-center text-center w-full max-w-screen-2xl mx-auto transition-all duration-1000 ease-out ${
            visibleSections.has(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          }`}
        >
          <div className="relative inline-block">
            <h1 className="text-[15vw] md:text-[12vw] lg:text-[11vw] font-semibold tracking-[-0.03em] leading-none mb-8 md:mb-12">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70 tracking-[0.5rem]">CULTFORM</span>
            </h1>
          </div>
          <div className="max-w-3xl lg:max-w-4xl flex flex-col items-center">
            <div className="h-[1px] w-24 bg-accent mb-8" />
            <p className="text-xl md:text-2xl lg:text-3xl xl:text-[2.5rem] font-light leading-[1.3] text-foreground/90">
              Как монетизировать свой коммуникативный талант?
            </p>
          </div>
          
          <div className={`flex flex-wrap justify-center gap-6 md:gap-12 w-full mt-16 md:mt-24 transition-all duration-1000 delay-300 ${
            visibleSections.has(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            <div className="w-20 h-20 md:w-28 md:h-28 bg-neon-purple rounded-full flex items-center justify-center text-background hover:scale-105 transition-transform duration-300 cursor-pointer shadow-[0_0_30px_rgba(115,109,245,0.3)]">
              <MessageCircle className="w-10 h-10 md:w-14 md:h-14 stroke-[2]" />
            </div>
            <div className="w-20 h-20 md:w-28 md:h-28 bg-neon-green rounded-3xl flex items-center justify-center text-background hover:scale-105 transition-transform duration-300 cursor-pointer shadow-[0_0_30px_rgba(15,187,66,0.3)]">
              <Users className="w-10 h-10 md:w-14 md:h-14 stroke-[2]" />
            </div>
            <div className="w-20 h-20 md:w-28 md:h-28 bg-neon-orange rounded-[40%] rounded-br-lg flex items-center justify-center text-background hover:scale-105 transition-transform duration-300 cursor-pointer shadow-[0_0_30px_rgba(246,96,35,0.3)]">
              <Handshake className="w-10 h-10 md:w-14 md:h-14 stroke-[2]" />
            </div>
            <div className="w-20 h-20 md:w-28 md:h-28 bg-neon-yellow rounded-2xl flex items-center justify-center text-background hover:scale-105 transition-transform duration-300 cursor-pointer shadow-[0_0_30px_rgba(255,194,0,0.3)]">
              <Rocket className="w-10 h-10 md:w-14 md:h-14 stroke-[2]" />
            </div>
            <div className="w-20 h-20 md:w-28 md:h-28 bg-neon-blue rounded-full flex items-center justify-center text-background hover:scale-105 transition-transform duration-300 cursor-pointer shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <TrendingUp className="w-10 h-10 md:w-14 md:h-14 stroke-[2]" />
            </div>
          </div>
        </div>
      </section>

      {/* Slide 2 - Offer */}
      <section
        ref={(el) => { slideRefs.current[1] = el }}
        className="min-h-screen flex items-center px-6 md:px-10 lg:px-16 py-32 relative"
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] border-t border-dashed border-border" />
        
        <div className="w-full max-w-7xl mx-auto">
          <div
            className={`transition-all duration-1000 ease-out ${
              visibleSections.has(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            }`}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-[-0.02em] leading-none mb-12 lg:mb-20">
              Предложение:
            </h2>
            
            <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8 mb-6 lg:mb-8">
              <div className="flex-1 group relative p-8 md:p-12 border border-foreground/10 bg-neon-purple/5 hover:bg-neon-purple/10 border-neon-purple/20 hover:border-neon-purple/50 transition-colors duration-500 rounded-2xl">
                <div className="absolute top-0 left-0 w-16 h-1 bg-neon-purple rounded-tl-2xl" />
                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                  <span className="text-neon-purple font-semibold">5 000 долларов в месяц</span>{" "}
                  за выполнение функционала бизнес-девелопера
                </p>
              </div>
              
              <div className="flex flex-col items-center justify-center flex-shrink-0 text-neon-green/40 group-hover:text-neon-green transition-colors">
                <ArrowRight className="w-10 h-10 hidden lg:block" strokeWidth={1.5} />
                <ArrowDown className="w-10 h-10 lg:hidden" strokeWidth={1.5} />
              </div>
              
              <div className="flex-1 group relative p-8 md:p-12 border border-foreground/10 bg-neon-green/5 hover:bg-neon-green/10 border-neon-green/20 hover:border-neon-green/50 transition-colors duration-500 rounded-2xl">
                <div className="absolute top-0 left-0 w-16 h-1 bg-neon-green rounded-tl-2xl" />
                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                  При достижении KPI в <span className="text-neon-green font-semibold">20 клиентов</span>{" "}
                  и среднем чеке <span className="text-neon-green font-semibold">10 000$</span>
                </p>
              </div>
            </div>

            <div className="w-full lg:w-2/3 group relative p-8 md:p-12 lg:p-16 border border-foreground/10 bg-neon-orange/5 hover:bg-neon-orange/10 border-neon-orange/20 hover:border-neon-orange/50 transition-colors duration-500 rounded-2xl">
              <div className="absolute top-0 left-0 w-16 h-1 bg-neon-orange rounded-tl-2xl" />
              <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                <span className="text-neon-orange font-semibold">Пассивный доход</span> на весь срок действия контракта с клиентом
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 3 - Concept */}
      <section
        ref={(el) => { slideRefs.current[2] = el }}
        className="min-h-screen flex items-center px-6 md:px-10 lg:px-16 py-32 relative"
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] border-t border-dashed border-border" />
        
        <div className="w-full max-w-7xl mx-auto">
          <div
            className={`transition-all duration-1000 ease-out ${
              visibleSections.has(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            }`}
          >
            <div className="grid lg:grid-cols-[1fr,1.2fr] gap-12 lg:gap-24">
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-[-0.02em] leading-tight sticky top-32">
                  Ценность:
                </h2>
              </div>
              
              <div className="space-y-0">
                <div className="group flex gap-6 md:gap-8 items-start py-6 md:py-8 border-b border-border/50 hover:bg-foreground/[0.02] transition-colors">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-light text-accent/60 group-hover:text-accent transition-colors min-w-[60px] md:min-w-[80px]">
                    01
                  </span>
                  <p className="text-base md:text-lg lg:text-xl leading-relaxed pt-2 md:pt-3">
                    Поиск людей, у которых есть доступный для инвестиций капитал в размере от 500 до 50 000 долларов
                  </p>
                </div>
                <div className="group flex gap-6 md:gap-8 items-start py-6 md:py-8 hover:bg-foreground/[0.02] transition-colors">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-light text-accent/60 group-hover:text-accent transition-colors min-w-[60px] md:min-w-[80px]">
                    02
                  </span>
                  <p className="text-base md:text-lg lg:text-xl leading-relaxed pt-2 md:pt-3">
                    Конвертация их в клиентов компании, предоставляющей услуги по приобретению производственных мощностей в виде 3D-принтеров и управлению ими
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 4 - Terms */}
      <section
        ref={(el) => { slideRefs.current[3] = el }}
        className="min-h-screen flex items-center px-6 md:px-10 lg:px-16 py-32 relative"
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] border-t border-dashed border-border" />
        
        <div className="w-full max-w-7xl mx-auto">
          <div
            className={`transition-all duration-1000 ease-out ${
              visibleSections.has(3) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            }`}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-[-0.02em] leading-none mb-12 lg:mb-20">
              Условия:
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 pb-8 lg:pb-16">
              {[
                {
                  text: "2,5% в месяц от суммы, на которую клиент приобрел и сдал в аренду оборудование",
                  Icon: Wallet,
                  hoverClass: "hover:border-neon-blue/50 hover:bg-neon-blue/5",
                  textClass: "text-neon-blue",
                  bgClass: "bg-neon-blue/10"
                },
                {
                  text: "3% стартовая премия от суммы сделки при подписании контракта",
                  Icon: FileSignature,
                  hoverClass: "hover:border-neon-purple/50 hover:bg-neon-purple/5",
                  textClass: "text-neon-purple",
                  bgClass: "bg-neon-purple/10"
                },
                {
                  text: "Бонус за выполнение плана в 20 клиентов (индивидуальный сюрприз)",
                  Icon: Target,
                  hoverClass: "hover:border-neon-green/50 hover:bg-neon-green/5",
                  textClass: "text-neon-green",
                  bgClass: "bg-neon-green/10"
                },
                {
                  text: "Путешествия и обучение за счет компании",
                  Icon: Rocket,
                  hoverClass: "hover:border-neon-yellow/50 hover:bg-neon-yellow/5",
                  textClass: "text-neon-yellow",
                  bgClass: "bg-neon-yellow/10"
                },
              ].map((item, index) => {
                const Icon = item.Icon;
                return (
                <div
                  key={index}
                  className={`group relative px-6 py-10 md:px-8 md:py-12 border border-dashed border-foreground/20 transition-all duration-500 flex flex-col items-center text-center gap-6 overflow-hidden ${item.hoverClass}`}
                  style={{ borderRadius: '3rem' }}
                >
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black opacity-5 pointer-events-none group-hover:scale-110 transition-all duration-700 z-0 ${item.textClass}`}>
                    0{index + 1}
                  </div>
                  
                  <div className={`p-4 rounded-full ${item.bgClass} ${item.textClass} group-hover:scale-110 transition-transform duration-500 z-10`}>
                    <Icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
                  </div>
                  
                  <p className="text-sm md:text-lg leading-relaxed text-foreground/80 group-hover:text-foreground transition-colors z-10">
                    {item.text}
                  </p>
                </div>
              )})}
            </div>
          </div>
        </div>
      </section>

      {/* Slide 5 - Skills */}
      <section
        ref={(el) => { slideRefs.current[4] = el }}
        className="min-h-screen flex items-center px-6 md:px-10 lg:px-16 py-32 relative"
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] border-t border-dashed border-border" />
        
        <div className="w-full max-w-7xl mx-auto">
          <div
            className={`transition-all duration-1000 ease-out ${
              visibleSections.has(4) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            }`}
          >
            <div className="grid lg:grid-cols-[1fr,1.2fr] gap-12 lg:gap-24">
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-[-0.02em] leading-tight sticky top-32">
                  Желаемые<br />компетенции:
                </h2>
              </div>
              
              <div className="space-y-0">
                {[
                  "Ведение активного образа жизни, позволяющего заводить множество лояльных знакомых",
                  "Личное обаяние и умение выстроить грамотную коммуникацию",
                  "Навык обучения новому - досконального погружения в предметную область и оперирования профессиональной терминологией",
                  "Аналитический склад ума для процессов исследования непознанного при необходимости",
                  "Способность стратегического и тактического проектирования эффективных коммуникативных действий"
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group flex gap-6 md:gap-8 items-start py-6 md:py-8 border-b border-border/50 last:border-b-0 hover:bg-foreground/[0.02] transition-colors"
                  >
                    <span className="text-3xl md:text-4xl lg:text-5xl font-light text-accent/60 group-hover:text-accent transition-colors min-w-[60px] md:min-w-[80px]">
                      0{index + 1}
                    </span>
                    <p className="text-base md:text-lg lg:text-xl leading-relaxed pt-2 md:pt-3">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 6 - Routine */}
      <section
        ref={(el) => { slideRefs.current[5] = el }}
        className="min-h-screen flex items-center px-6 md:px-10 lg:px-16 py-32 relative"
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] border-t border-dashed border-border" />
        
        <div className="w-full max-w-7xl mx-auto">
          <div
            className={`transition-all duration-1000 ease-out ${
              visibleSections.has(5) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            }`}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-[-0.02em] leading-none mb-12 lg:mb-20">
              Деятельность:
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {[
                { title: "Подготовка презентации", solution: "Подготовка презентации клиенту услуг компании" },
                { title: "Мероприятия", solution: "Посещение деловых или развлекательных публичных мероприятий" },
                { title: "Встречи", solution: "Завтрак/обед/ужин с клиентом в ресторане" },
                { title: "Согласование контракта", solution: "Согласование условий контракта клиента с юристом компании" },
                { title: "Подписание", solution: "Согласование итогового контракта и сопровождение процесса подписания" },
                { title: "Профит", solution: "Получение персональных финансовых профитов в наличном виде, в криптовалюте или на расчетный счет" },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`group relative p-6 md:p-8 lg:p-10 border border-foreground/10 hover:border-foreground/30 hover:bg-foreground/[0.02] transition-all duration-500`}
                >
                  <div className="absolute top-0 left-0 w-0 group-hover:w-full h-[1px] bg-accent transition-all duration-500" />
                  <h4 className="text-lg md:text-xl lg:text-2xl font-medium mb-4 flex items-start gap-4">
                    <span className="w-2 h-2 bg-accent mt-2 flex-shrink-0" />
                    <span>{item.title}</span>
                  </h4>
                  <p className="text-sm md:text-base text-foreground/70 leading-relaxed pl-6">
                    {item.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Slide 7 - Calculator */}
      <section
        ref={(el) => { slideRefs.current[6] = el }}
        className="min-h-screen flex items-center px-6 md:px-10 lg:px-16 py-32 relative"
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] border-t border-dashed border-border" />
        
        <div className="w-full max-w-4xl mx-auto">
          <div
            className={`transition-all duration-1000 ease-out ${
              visibleSections.has(6) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            }`}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.02em] leading-none mb-12 lg:mb-20">
              Калькулятор премирования:
            </h2>

            <div className="border border-foreground/10 p-8 md:p-12 lg:p-16 relative overflow-hidden bg-background">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="space-y-12 relative z-10">
                {/* Tabs */}
                <div className="flex p-1 bg-surface rounded-xl">
                  <button
                    onClick={() => setCalcMode("clients")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors rounded-lg ${calcMode === "clients" ? "bg-border text-foreground" : "text-muted hover:text-foreground"}`}
                  >
                    По клиентам
                  </button>
                  <button
                    onClick={() => setCalcMode("total")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors rounded-lg ${calcMode === "total" ? "bg-border text-foreground" : "text-muted hover:text-foreground"}`}
                  >
                    Общая сумма
                  </button>
                </div>

                {calcMode === "clients" ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-muted text-[10px] tracking-[0.2em] block">
                        КОЛИЧЕСТВО КЛИЕНТОВ
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleClientsChange(clients - 1)}
                          className="w-12 h-12 border border-foreground/20 text-xl hover:bg-surface hover:border-foreground/40 transition-all flex items-center justify-center"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={clients}
                          onChange={(e) => handleClientsChange(parseInt(e.target.value) || 1)}
                          className="w-24 h-12 bg-transparent border border-foreground/20 text-center text-xl font-semibold focus:outline-none focus:border-accent tabular-nums"
                        />
                        <button
                          onClick={() => handleClientsChange(clients + 1)}
                          className="w-12 h-12 border border-foreground/20 text-xl hover:bg-surface hover:border-foreground/40 transition-all flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-muted text-[10px] tracking-[0.2em] block">
                        СРЕДНИЙ ЧЕК ($) <span className="text-accent ml-1">*КРАТНО 500</span>
                      </label>
                      <input
                        type="number"
                        step="500"
                        min="500"
                        value={averageCheckInput}
                        onChange={(e) => handleCheckChange(e.target.value)}
                        onBlur={handleCheckBlur}
                        className="w-full h-12 bg-transparent border border-foreground/20 px-4 text-xl font-semibold focus:outline-none focus:border-accent tabular-nums"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <label className="text-muted text-[10px] tracking-[0.2em] block">
                      ОБЩАЯ ПРИВЛЕЧЕННАЯ СУММА ($) <span className="text-accent ml-1">*КРАТНО 500</span>
                    </label>
                    <input
                      type="number"
                      step="500"
                      min="500"
                      value={totalSumInput}
                      onChange={(e) => handleTotalSumChange(e.target.value)}
                      onBlur={handleTotalSumBlur}
                      className="w-full h-14 bg-transparent border border-foreground/20 px-6 text-xl font-semibold focus:outline-none focus:border-accent tabular-nums"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <label className="text-muted text-[10px] tracking-[0.2em] block">
                    СРОК КОНТРАКТА (ЛЕТ)
                  </label>
                  <div className="flex items-center gap-8">
                    <div className="flex-1 relative">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={term}
                        onChange={(e) => setTerm(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-[10px] text-muted mt-2">
                        <span>1</span>
                        <span>5</span>
                      </div>
                    </div>
                    <span className="text-4xl font-semibold w-24 text-right tabular-nums text-accent">
                      {term} {term === 1 ? 'год' : term > 4 ? 'лет' : 'года'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-6">
                  <span className="text-sm md:text-base font-medium">Реинвестирование прибыли клиентами</span>
                  <button
                    onClick={() => setReinvest(!reinvest)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0 ${reinvest ? 'bg-accent' : 'bg-foreground/20'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-background transition-transform ${reinvest ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="h-[1px] bg-border" />

                {/* Results */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 md:p-8 bg-surface border-l-2 border-neon-purple">
                    <p className="text-muted text-[10px] tracking-[0.2em] mb-4 uppercase">Стартовая премия (3%)</p>
                    <p className="text-4xl md:text-5xl font-semibold tabular-nums">
                      ${startBonus.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="p-6 md:p-8 bg-surface border-l-2 border-neon-green">
                    <p className="text-muted text-[10px] tracking-[0.2em] mb-4 uppercase">
                      {reinvest ? 'Ср. пассивный доход (2.5%)' : 'Пассивный доход (2.5%)'}
                    </p>
                    <p className="text-4xl md:text-5xl font-semibold tabular-nums">
                      ${avgMonthlyPassive.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-sm text-muted mt-2 uppercase tracking-[0.1em]">в месяц</p>
                  </div>
                </div>

                <div className={`p-6 md:p-8 border-l-2 border-accent bg-accent/5`}>
                  <p className="text-accent text-[10px] tracking-[0.2em] mb-4 uppercase">Всего заработано за {term} {term === 1 ? 'год' : term > 4 ? 'лет' : 'года'}</p>
                  <p className="text-5xl md:text-6xl font-semibold tabular-nums text-accent">
                    ${totalEarned.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  {reinvest && (
                    <p className="text-sm text-foreground/70 mt-2">
                      Пассивный доход вырос с ${firstMonthPassive.toLocaleString(undefined, { maximumFractionDigits: 0 })} до ${lastMonthPassive.toLocaleString(undefined, { maximumFractionDigits: 0 })} в месяц
                    </p>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 8 - Mission */}
      <section
        ref={(el) => { slideRefs.current[7] = el }}
        className="min-h-screen flex items-center px-6 md:px-10 lg:px-16 py-32 relative"
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] border-t border-dashed border-border" />
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-0">
          <div
            className={`transition-all duration-1000 ease-out ${
              visibleSections.has(7) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            }`}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-[-0.02em] leading-none mb-16 lg:mb-24 text-center">
              Миссия:
            </h2>
            
            <div className="mb-20 lg:mb-28 flex justify-center">
              <div className="group relative py-6 flex flex-col items-center text-center">
                <p className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold mb-6 leading-[1.1] text-accent">
                  Объединение
                </p>
                <div className="w-16 h-[2px] bg-accent mb-6" />
                <p className="text-lg md:text-xl lg:text-2xl text-muted uppercase tracking-[0.2em] font-light">
                  человеческих ресурсов
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-24 relative">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-foreground/10 hidden md:block" />
              
              <div className="group relative pt-8 md:pt-12 flex flex-col text-left">
                <div className="absolute left-0 top-0 w-0 h-[2px] bg-red-500 group-hover:w-full transition-all duration-700 hidden md:block" />
                <div className="w-12 h-[1px] bg-red-500 mb-6 md:hidden" />
                <p className="text-[10px] tracking-[0.2em] font-bold text-red-500 uppercase mb-4">
                  ПРОБЛЕМА
                </p>
                <p className="text-lg md:text-xl lg:text-2xl text-muted leading-relaxed">
                  Общее качество жизни человечества на планете не очень высокое, так как людям порой сложно взаимодействовать друг с другом, договариваться и сотрудничать.
                </p>
              </div>
              
              <div className="group relative pt-8 md:pt-12 flex flex-col text-left">
                <div className="absolute left-0 top-0 w-0 h-[2px] bg-neon-green group-hover:w-full transition-all duration-700 hidden md:block" />
                <div className="w-12 h-[1px] bg-neon-green mb-6 md:hidden" />
                <p className="text-[10px] tracking-[0.2em] font-bold text-neon-green uppercase mb-4">
                  РЕШЕНИЕ
                </p>
                <p className="text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed">
                  Создание сообщества профессиональных бизнес-девелоперов, которые могут объединять ресурсы разных контрагентов и умножать благополучие каждого из них
                </p>
              </div>
            </div>

            <div className="pt-16 border-t border-dashed border-border">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-[1px] bg-accent mb-12" />
                <p className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold tracking-[0.1em] mb-8">
                  CULTFORM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
