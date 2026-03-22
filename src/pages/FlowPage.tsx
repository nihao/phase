import { useState } from 'react';
import { motion } from 'motion/react';
import { Wind, Compass, Calendar as CalendarIcon, Cloud, Crown, ArrowRight, Activity, ShieldAlert, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export function FlowPage() {
  return (
    <div className="min-h-full text-ink pb-32 md:pb-16 selection:bg-seal/20">
      <div className="max-w-3xl mx-auto px-6 pt-12 md:pt-20 relative z-10 space-y-24">
        
        {/* SECTION 1: Today Guidance (今日牵引) */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center space-y-12"
        >
          {/* Date & Meta */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-px h-12 bg-ink/20" />
            <div className="text-[11px] tracking-[0.4em] text-ink/50 uppercase font-sans">
              Today Guidance
            </div>
            <div className="text-[15px] tracking-widest text-ink/80 font-serif">
              甲辰年 · 二月十二
            </div>
          </div>

          {/* The Core Sign */}
          <div className="relative py-8 w-full max-w-lg">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-seal/5 rounded-full blur-3xl -z-10" />
            
            <h1 className="text-[56px] md:text-[72px] leading-tight font-serif font-light tracking-[0.1em] text-ink">
              局部过热
            </h1>
            
            <div className="absolute -top-4 right-4 md:-right-8 w-12 h-12 border border-seal text-seal flex items-center justify-center opacity-90 rotate-12 bg-paper">
              <span className="text-[16px] font-serif leading-none">慎</span>
            </div>
          </div>

          {/* Description & Guidance */}
          <div className="max-w-lg mx-auto space-y-8">
            <div className="flex justify-center items-center gap-6 text-[13px] text-ink/60 tracking-[0.2em] font-sans">
              <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> 张力上升</span>
              <span className="w-1 h-1 bg-ink/30 rounded-full" />
              <span className="flex items-center gap-1.5"><Wind className="w-4 h-4" /> 木火相刑</span>
            </div>
            
            <div className="bg-mist border border-ink/10 p-8 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-seal/80" />
              <p className="text-[16px] text-ink/90 leading-[2.2] text-justify font-serif">
                今天的重点，不在于更快，而在于更稳。你本就更容易在这种压力结构里提前进入拉扯，而这两天的时运又放大了这种倾向。
              </p>
              <div className="mt-6 pt-6 border-t border-ink/10">
                <p className="text-[14px] text-ink/70 leading-[2.0] font-serif text-justify">
                  <strong className="text-ink font-medium mr-2">牵引建议：</strong>
                  先把最容易让你局部过热的事项压一压，先降低内部噪音，再决定要不要推进。
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-ink/10 to-transparent" />

        {/* SECTION 2: Rhythm Map (节律地图) */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="space-y-10"
        >
          <div className="text-center mb-12">
            <h2 className="text-[12px] text-ink/50 tracking-[0.4em] uppercase font-sans mb-3">Rhythm Map</h2>
            <h3 className="text-[24px] font-serif text-ink tracking-widest">近期节律地图</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Day 1 */}
            <div className="bg-mist border border-ink/10 p-6 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-seal/5 rounded-full blur-2xl transition-all group-hover:bg-seal/10" />
              <div className="text-[12px] font-sans text-ink/50 mb-4 tracking-widest">明天 / 03.19</div>
              <div className="text-[18px] font-serif text-ink mb-2 tracking-widest">收束期</div>
              <p className="text-[13px] text-ink/60 leading-[1.8] font-serif flex-1">
                整体节律收束，适合整理和定稿，不宜开启新对抗。
              </p>
              <div className="mt-6 inline-flex items-center gap-1.5 text-[11px] text-jade font-sans tracking-widest border border-jade/20 bg-jade/5 px-2.5 py-1 w-fit">
                优先恢复
              </div>
            </div>

            {/* Day 2 */}
            <div className="bg-mist border border-ink/10 p-6 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-ink/5 rounded-full blur-2xl transition-all group-hover:bg-ink/10" />
              <div className="text-[12px] font-sans text-ink/50 mb-4 tracking-widest">后天 / 03.20</div>
              <div className="text-[18px] font-serif text-ink mb-2 tracking-widest">过渡带</div>
              <p className="text-[13px] text-ink/60 leading-[1.8] font-serif flex-1">
                外部协作阻力开始下降，适合进行轻量沟通与铺垫。
              </p>
              <div className="mt-6 inline-flex items-center gap-1.5 text-[11px] text-ink/60 font-sans tracking-widest border border-ink/10 bg-white px-2.5 py-1 w-fit">
                适合缓冲
              </div>
            </div>

            {/* Day 3 */}
            <div className="bg-mist border border-seal/20 p-6 flex flex-col relative overflow-hidden group shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-seal/10 rounded-full blur-2xl transition-all group-hover:bg-seal/20" />
              <div className="text-[12px] font-sans text-seal/70 mb-4 tracking-widest">大后天 / 03.21</div>
              <div className="text-[18px] font-serif text-ink mb-2 tracking-widest">上升窗口</div>
              <p className="text-[13px] text-ink/70 leading-[1.8] font-serif flex-1">
                能量回暖，若有重要决策或关键推进，更建议放在此时。
              </p>
              <div className="mt-6 inline-flex items-center gap-1.5 text-[11px] text-seal font-sans tracking-widest border border-seal/20 bg-seal/5 px-2.5 py-1 w-fit">
                适合推进
              </div>
            </div>
          </div>
          
          <div className="bg-white/40 border border-ink/10 p-6 flex items-start gap-4 mt-4">
            <ShieldAlert className="w-5 h-5 text-ink/40 shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <h4 className="text-[14px] font-serif text-ink mb-1.5 tracking-widest">为什么这对你很重要？</h4>
              <p className="text-[13px] text-ink/60 leading-[1.8] font-serif text-justify">
                你在紧绷状态下更容易过早用力，而不是等窗口真正打开。提前看清节律，能帮你减少在错误时机里的无效消耗。
              </p>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
