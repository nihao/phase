import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  zh: {
    translation: {
      nav: {
        appName: '相谕',
        home: '牵引',
        companion: '陪伴',
        profile: '档案'
      },
      auth: {
        welcome: '欢迎来到相谕',
        subtitle: '洞悉节律，顺势而为，找回你的内在能量。',
        continueWithGoogle: '使用 Google 账号继续',
        terms: '登录即表示您同意我们的服务条款和隐私政策。',
        error: '登录失败，请重试'
      },
      flow: {
        greeting: '你好',
        defaultName: '行者',
        todayGuidance: '今日气象',
        mainTension: '今日主张力',
        tensionDesc: '木火相刑 · 局部过热',
        view: '查看',
        energyAura: '当前能量场',
        energyState: '平稳流动',
        actions: {
          chat: '唤醒相谕',
          chatDesc: '倾听你的感受',
          breathe: '正念呼吸',
          breatheDesc: '3分钟重置',
          journal: '能量手记',
          journalDesc: '记录当下'
        },
        days: ['日', '一', '二', '三', '四', '五', '六'],
        chartDays: ['日', '一', '二', '三', '四', '五', '六'],
        rhythm: {
          today: {
            title: '局部过热',
            type: '收束期',
            desc: '今天的重点，不在于更快，而在于更稳。你本就更容易在这种压力结构里提前进入拉扯，而这两天的时运又放大了这种倾向。',
            stats: {
              tension: { label: '张力指数', value: '偏高' },
              resistance: { label: '行动阻力', value: '中等' },
              recovery: { label: '恢复建议', value: '静心' }
            }
          },
          other: {
            title: '能量回暖',
            type: '上升窗口',
            desc: '外部协作阻力开始下降，适合进行轻量沟通与铺垫。若有重要决策或关键推进，更建议放在此时。',
            stats: {
              tension: { label: '张力指数', value: '平稳' },
              resistance: { label: '行动阻力', value: '偏低' },
              recovery: { label: '恢复建议', value: '行动' }
            }
          }
        }
      },
      lab: {
        title: 'Companion',
        subtitle: '你的专属能量向导',
        emptyTitle: '此刻，能量如何流动？',
        emptyDesc: '我在这里陪你理清思绪，找到当下的答案。',
        inputPlaceholder: '分享你的感受...',
        sensing: '正在感知能量...',
        prompts: [
          '我感觉今天有些阻滞',
          '帮我梳理一下这周的重心',
          '我需要快速补充能量',
          '回顾我最近的进展'
        ],
        fallback: '抱歉，气象观测站暂时失去连接。请稍后再试。'
      },
      profile: {
        title: 'Profile',
        level: 'Lv.',
        exp: 'EXP',
        avgEnergy: '平均能量',
        insights: '洞察次数',
        tabs: {
          activity: '动态',
          insights: '洞察',
          settings: '设置'
        },
        logout: '退出登录',
        language: 'Language (语言)',
        activity: {
          insight: '深度洞察解锁',
          action: '完成恢复动作',
          chat: '陪伴会话'
        },
        time: {
          today: '今天',
          yesterday: '昨天'
        }
      }
    }
  },
  en: {
    translation: {
      nav: {
        appName: 'Phase',
        home: 'Home',
        companion: 'Companion',
        profile: 'Profile'
      },
      auth: {
        welcome: 'Welcome to Phase',
        subtitle: 'Discover your rhythm and navigate your energy flow with clarity.',
        continueWithGoogle: 'Continue with Google',
        terms: 'By continuing, you agree to our Terms of Service and Privacy Policy.',
        error: 'Failed to sign in. Please try again.'
      },
      flow: {
        greeting: 'Hello',
        defaultName: 'Traveler',
        todayGuidance: 'Today\'s Weather',
        mainTension: 'Main Tension',
        tensionDesc: 'Wood-Fire Clash · Overheating',
        view: 'View',
        energyAura: 'Current Aura',
        energyState: 'Flowing Smoothly',
        actions: {
          chat: 'Talk to Phase',
          chatDesc: 'Share your feelings',
          breathe: 'Breathe',
          breatheDesc: '3 min reset',
          journal: 'Journal',
          journalDesc: 'Record the moment'
        },
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        chartDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        rhythm: {
          today: {
            title: 'Local Overheating',
            type: 'Consolidation',
            desc: 'The focus today is not on speed, but stability. You are prone to internal friction under this pressure structure, and current transits amplify this tendency.',
            stats: {
              tension: { label: 'Tension Index', value: 'High' },
              resistance: { label: 'Action Resistance', value: 'Medium' },
              recovery: { label: 'Recovery Advice', value: 'Meditate' }
            }
          },
          other: {
            title: 'Energy Warming',
            type: 'Ascending Window',
            desc: 'External collaboration resistance begins to drop. Suitable for light communication and groundwork. Important decisions are better placed here.',
            stats: {
              tension: { label: 'Tension Index', value: 'Stable' },
              resistance: { label: 'Action Resistance', value: 'Low' },
              recovery: { label: 'Recovery Advice', value: 'Action' }
            }
          }
        }
      },
      lab: {
        title: 'Companion',
        subtitle: 'Your personal energy guide',
        emptyTitle: 'How is your energy flowing?',
        emptyDesc: "I'm here to help you navigate your current state and find clarity.",
        inputPlaceholder: 'Share your thoughts...',
        sensing: 'Sensing energy...',
        prompts: [
          "I'm feeling stuck today",
          "Help me plan my week",
          "Need a quick energy boost",
          "Reflect on my recent progress"
        ],
        fallback: "I'm having trouble connecting right now. Let's take a deep breath and try again in a moment."
      },
      profile: {
        title: 'Profile',
        level: 'Lv.',
        exp: 'EXP',
        avgEnergy: 'Avg Energy',
        insights: 'Insights',
        tabs: {
          activity: 'Activity',
          insights: 'Insights',
          settings: 'Settings'
        },
        logout: 'Sign Out',
        language: '语言 (Language)',
        activity: {
          insight: 'Deep Insight Unlocked',
          action: 'Completed Recovery',
          chat: 'Companion Session'
        },
        time: {
          today: 'Today',
          yesterday: 'Yesterday'
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
