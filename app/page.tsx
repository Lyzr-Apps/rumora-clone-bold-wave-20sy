'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import {
  FiTrendingUp, FiZap, FiMessageSquare, FiTarget, FiCopy, FiClock,
  FiCheck, FiRefreshCw, FiChevronDown, FiChevronUp, FiSearch,
  FiBarChart2, FiArrowRight, FiPlay, FiEye, FiActivity,
  FiAlertCircle, FiX, FiSettings, FiCalendar, FiSend,
  FiCheckCircle, FiCircle, FiExternalLink, FiFilter, FiMenu,
  FiGlobe, FiUsers, FiLayers, FiAward
} from 'react-icons/fi'
import { HiOutlineSparkles, HiOutlineLightBulb, HiOutlineReply } from 'react-icons/hi'
import { BiVideoRecording } from 'react-icons/bi'
import { RiTiktokLine, RiYoutubeLine, RiRocketLine } from 'react-icons/ri'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'

// ─── Constants ───────────────────────────────────────────────
const AGENT_ID = '699a267d4274f089c16d4440'

// ─── Interfaces ──────────────────────────────────────────────
interface DiscoveredVideo {
  title?: string; platform?: string; url_suggestion?: string
  estimated_views?: string; engagement_level?: string
  relevance_score?: number; why_target?: string; niche_match?: string
}
interface CommentItem {
  text?: string; style?: string; naturalness?: number
  brand_mention_type?: string; estimated_engagement?: string
}
interface GeneratedCommentGroup {
  target_video?: string; platform?: string; comments?: CommentItem[]
}
interface ReplyStrategy {
  comment_type?: string; example_original_comment?: string
  suggested_reply?: string; brand_integration?: string; tone?: string
}
interface WeeklyBreakdown {
  week?: number; theme?: string; daily_videos?: number
  platform_focus?: string; key_actions?: string[]
}
interface DailyScheduleItem {
  day?: string; videos_to_target?: number; platform?: string
  optimal_time?: string; focus_area?: string
}
interface KPIs {
  comments_per_day?: number; target_replies?: number
  reach_goal?: string; engagement_rate_target?: string
}
interface CampaignPlan {
  goal?: string; duration?: string; total_target_videos?: number
  total_target_reach?: string; weekly_breakdown?: WeeklyBreakdown[]
  daily_schedule?: DailyScheduleItem[]; kpis?: KPIs
}
interface ExecutionQueueItem {
  priority?: number; video_title?: string; platform?: string
  action?: string; pre_written_comment?: string
  optimal_post_time?: string; expected_reach?: string; status?: string
}
interface AgentResponseData {
  discovered_videos?: DiscoveredVideo[]
  generated_comments?: GeneratedCommentGroup[]
  reply_strategies?: ReplyStrategy[]
  campaign_plan?: CampaignPlan
  execution_queue?: ExecutionQueueItem[]
}

// ─── Sample Data ─────────────────────────────────────────────
const SAMPLE: AgentResponseData = {
  discovered_videos: [
    { title: '10 Productivity Hacks That Actually Work in 2026', platform: 'YouTube', url_suggestion: 'Search "productivity hacks 2026" on YouTube - top 3 results', estimated_views: '1.2M', engagement_level: 'High', relevance_score: 9, why_target: 'Massive engagement from target demographic, comment section actively discussing tool recommendations', niche_match: 'Productivity Software' },
    { title: 'I Tried Every Task Manager So You Don\'t Have To', platform: 'YouTube', url_suggestion: 'Search "best task manager review 2026"', estimated_views: '850K', engagement_level: 'High', relevance_score: 9, why_target: 'Viewers actively looking for tool recommendations in comments', niche_match: 'Project Management Tools' },
    { title: 'Remote Work Setup That Changed My Life', platform: 'TikTok', url_suggestion: 'Trending under #remotework and #WFH', estimated_views: '2.1M', engagement_level: 'High', relevance_score: 8, why_target: 'Viral reach with audience perfectly matching FlowDesk target users', niche_match: 'Remote Work Solutions' },
    { title: 'POV: Your Calendar Runs Your Life', platform: 'TikTok', url_suggestion: 'Trending under #corporatelife #productivity', estimated_views: '3.5M', engagement_level: 'High', relevance_score: 8, why_target: 'Relatable content, comment section is gold for productivity tool mentions', niche_match: 'Calendar & Scheduling' },
    { title: 'Why Most Teams Fail at Async Communication', platform: 'YouTube', url_suggestion: 'Search "async communication teams" - recent uploads', estimated_views: '420K', engagement_level: 'Medium', relevance_score: 8, why_target: 'Niche audience of team leads actively seeking solutions', niche_match: 'Team Communication' },
    { title: 'My Honest Review: Top 5 Project Management Tools', platform: 'YouTube', url_suggestion: 'Search "project management tools review 2026"', estimated_views: '670K', engagement_level: 'High', relevance_score: 10, why_target: 'Direct comparison content - perfect for positioning FlowDesk', niche_match: 'Project Management' },
    { title: 'How I Manage 3 Businesses From My Phone', platform: 'TikTok', url_suggestion: 'Trending under #entrepreneur #business', estimated_views: '1.8M', engagement_level: 'High', relevance_score: 7, why_target: 'Entrepreneur audience always seeking better tools', niche_match: 'Business Management' },
    { title: 'The Deep Work Method Nobody Talks About', platform: 'YouTube', url_suggestion: 'Search "deep work method" - videos from this week', estimated_views: '380K', engagement_level: 'Medium', relevance_score: 7, why_target: 'Engaged audience interested in focus and productivity systems', niche_match: 'Focus & Deep Work' },
    { title: 'Corporate Girlies Unite - Desk Organization', platform: 'TikTok', url_suggestion: 'Trending under #corporategirl #desksetup', estimated_views: '4.2M', engagement_level: 'High', relevance_score: 6, why_target: 'Massive reach, workspace optimization discussion in comments', niche_match: 'Workspace Optimization' },
    { title: 'Stop Using Spreadsheets for Project Management', platform: 'YouTube', url_suggestion: 'Search "spreadsheet vs project management" - recent', estimated_views: '290K', engagement_level: 'Medium', relevance_score: 9, why_target: 'Pain point content - viewers are ready to switch tools', niche_match: 'Project Management Migration' },
  ],
  generated_comments: [
    { target_video: '10 Productivity Hacks That Actually Work in 2026', platform: 'YouTube', comments: [
      { text: 'These are solid! I started using FlowDesk for hack #3 (time blocking) and it literally changed my workflow. The AI scheduling feature does the blocking for you based on your energy levels throughout the day.', style: 'helpful', naturalness: 9, brand_mention_type: 'subtle', estimated_engagement: 'High - adds value while mentioning tool naturally' },
      { text: 'Been doing #7 for months and my team thought I was magic. Plot twist: I just let FlowDesk auto-prioritize my tasks every morning. Sometimes the best hack is letting AI do the heavy lifting.', style: 'relatable', naturalness: 8, brand_mention_type: 'indirect', estimated_engagement: 'High - humor + relatability drives engagement' },
      { text: 'Has anyone combined these with a project management tool? I found that using something like FlowDesk alongside these hacks 10x the results. Curious what others are using?', style: 'question', naturalness: 9, brand_mention_type: 'subtle', estimated_engagement: 'Very High - question format invites discussion threads' },
    ]},
    { target_video: 'I Tried Every Task Manager So You Don\'t Have To', platform: 'YouTube', comments: [
      { text: 'Great review! One you might have missed is FlowDesk - it combines task management with AI scheduling. What sets it apart is the auto-priority engine that learns from your behavior. Would love to see it in your next comparison.', style: 'helpful', naturalness: 8, brand_mention_type: 'direct', estimated_engagement: 'Medium-High - informative suggestion to creator' },
      { text: 'I went through this exact journey last year. Tried everything on this list. Ended up on FlowDesk because the team collaboration features actually work without a PhD in project management. Simple > Complex every time.', style: 'endorsement', naturalness: 9, brand_mention_type: 'indirect', estimated_engagement: 'High - personal story resonates' },
    ]},
    { target_video: 'Remote Work Setup That Changed My Life', platform: 'TikTok', comments: [
      { text: 'This setup is fire but the real game changer for remote work is having the right digital tools. FlowDesk keeps my whole remote team synced without the constant Slack spam. Setup + right tools = unstoppable', style: 'endorsement', naturalness: 8, brand_mention_type: 'subtle', estimated_engagement: 'High - adds to conversation naturally' },
      { text: 'Okay but what about the digital workspace? My physical setup is similar but I pair it with FlowDesk for task flow and honestly that combo is what actually makes WFH work. Anyone else?', style: 'question', naturalness: 9, brand_mention_type: 'subtle', estimated_engagement: 'Very High - engages TikTok comment culture' },
    ]},
    { target_video: 'POV: Your Calendar Runs Your Life', platform: 'TikTok', comments: [
      { text: 'So real. I switched from letting my calendar control me to using FlowDesk AI scheduling. It literally learns when I am most productive and blocks time accordingly. Calendar runs my life but now it runs it WELL', style: 'relatable', naturalness: 9, brand_mention_type: 'indirect', estimated_engagement: 'High - relatable + solution in one' },
      { text: 'The fix nobody mentions: stop manually scheduling everything. AI tools like FlowDesk do this automatically now. I got 3 hours back every week just from that switch alone.', style: 'helpful', naturalness: 8, brand_mention_type: 'subtle', estimated_engagement: 'Medium-High - practical advice format' },
    ]},
    { target_video: 'My Honest Review: Top 5 Project Management Tools', platform: 'YouTube', comments: [
      { text: 'Solid list! I switched from #2 on your list to FlowDesk about 6 months ago. The AI auto-prioritization and the fact that it doesn\'t require a 2-week onboarding for new team members sold me. Would be great to see it in your next review!', style: 'endorsement', naturalness: 9, brand_mention_type: 'direct', estimated_engagement: 'High - direct positioning against competitors' },
      { text: 'Anyone else feel like these tools are all basically the same? FlowDesk was the first one that actually felt different - the AI features aren\'t just marketing buzzwords, they genuinely save time. Just my experience though, curious what others think.', style: 'question', naturalness: 8, brand_mention_type: 'indirect', estimated_engagement: 'Very High - provocative question drives debate' },
    ]},
  ],
  reply_strategies: [
    { comment_type: 'question', example_original_comment: 'What tools do you recommend for managing remote teams?', suggested_reply: 'Great question! We have been using FlowDesk for our remote team of 15 and it has been a game changer. The async updates and AI task prioritization mean fewer meetings and more actual work getting done. Happy to share our setup if helpful!', brand_integration: 'Answers genuinely while positioning FlowDesk as a tested solution from personal experience', tone: 'Helpful and genuine' },
    { comment_type: 'complaint', example_original_comment: 'I\'m so tired of switching between 5 different apps just to manage my tasks', suggested_reply: 'Felt this in my soul. That app-switching fatigue is real. I consolidated everything into FlowDesk last quarter and went from 5 tools to 1. The all-in-one approach actually works when the tool is designed right. Might be worth checking out!', brand_integration: 'Empathizes with pain point then naturally introduces FlowDesk as the solution they found', tone: 'Empathetic and relatable' },
    { comment_type: 'positive', example_original_comment: 'This productivity system is amazing! My output has doubled!', suggested_reply: 'Love seeing results like this! I had a similar boost when I combined a system like this with FlowDesk for the execution side. The planning + right tool combo is truly unbeatable. Keep crushing it!', brand_integration: 'Builds on positive energy and suggests FlowDesk as an enhancer rather than replacement', tone: 'Enthusiastic and supportive' },
    { comment_type: 'debate', example_original_comment: 'Notion is better than any project management tool out there, change my mind', suggested_reply: 'Notion is great for docs and wikis, no debate there. But for actual project management with deadlines, dependencies, and team workload? Tools built specifically for PM like FlowDesk handle that better imo. Different tools for different jobs. What specific PM features do you use in Notion?', brand_integration: 'Respectfully positions FlowDesk as purpose-built alternative while acknowledging competitor strengths', tone: 'Respectful and knowledgeable' },
    { comment_type: 'question', example_original_comment: 'Does anyone know a good tool for time blocking?', suggested_reply: 'FlowDesk has hands-down the best time blocking I have used. The AI actually learns your energy patterns and suggests optimal blocks. I used to spend 30 min every Sunday planning my week and now it does it automatically. Free trial if you want to test it!', brand_integration: 'Direct answer to a specific question, positions FlowDesk as the expert recommendation', tone: 'Direct and enthusiastic' },
    { comment_type: 'complaint', example_original_comment: 'Why do all these project management tools have such steep learning curves?', suggested_reply: 'THIS. I tried 4 different tools before finding one that didn\'t need a tutorial video playlist. FlowDesk literally took me 10 minutes to set up. They focused on making it intuitive instead of feature-bloated. Sometimes less really is more.', brand_integration: 'Addresses the exact pain point and positions FlowDesk as the exception to the rule', tone: 'Validating and solution-oriented' },
  ],
  campaign_plan: {
    goal: 'Achieve 100K+ reach through strategic comment placement on trending YouTube and TikTok videos in the productivity and project management niche',
    duration: '30 days',
    total_target_videos: 100,
    total_target_reach: '100,000+',
    weekly_breakdown: [
      { week: 1, theme: 'Foundation & Discovery', daily_videos: 3, platform_focus: 'YouTube (60%) + TikTok (40%)', key_actions: ['Identify top 25 target videos', 'Post 3-4 comments per day', 'Focus on high-relevance videos (8+ score)', 'Establish brand voice in comment sections', 'Monitor engagement on posted comments'] },
      { week: 2, theme: 'Engagement Scaling', daily_videos: 4, platform_focus: 'YouTube (50%) + TikTok (50%)', key_actions: ['Increase to 4 videos per day', 'Start reply strategy execution', 'Target medium-relevance videos (6-8 score)', 'Engage with replies to our comments', 'A/B test comment styles for best engagement'] },
      { week: 3, theme: 'Viral Wave Riding', daily_videos: 4, platform_focus: 'TikTok (60%) + YouTube (40%)', key_actions: ['Shift focus to TikTok for viral potential', 'Target trending and newly viral videos', 'Deploy question-style comments for thread generation', 'Cross-reference performing comments for patterns', 'Scale what works, cut what doesn\'t'] },
      { week: 4, theme: 'Reach Maximization', daily_videos: 5, platform_focus: 'Both equally', key_actions: ['Push for remaining reach target', 'Focus on highest-engagement videos', 'Deploy endorsement-style comments more aggressively', 'Final push on viral TikTok content', 'Document results and plan next month'] },
    ],
    daily_schedule: [
      { day: 'Day 1', videos_to_target: 3, platform: 'YouTube', optimal_time: '9:00 AM EST', focus_area: 'Productivity hack videos' },
      { day: 'Day 2', videos_to_target: 3, platform: 'TikTok', optimal_time: '12:00 PM EST', focus_area: 'Remote work content' },
      { day: 'Day 3', videos_to_target: 3, platform: 'YouTube', optimal_time: '10:00 AM EST', focus_area: 'Tool review videos' },
      { day: 'Day 4', videos_to_target: 3, platform: 'Both', optimal_time: '11:00 AM EST', focus_area: 'Project management content' },
      { day: 'Day 5', videos_to_target: 3, platform: 'TikTok', optimal_time: '1:00 PM EST', focus_area: 'Corporate lifestyle content' },
      { day: 'Day 6', videos_to_target: 2, platform: 'YouTube', optimal_time: '9:00 AM EST', focus_area: 'Deep work and focus content' },
      { day: 'Day 7', videos_to_target: 2, platform: 'Both', optimal_time: '10:00 AM EST', focus_area: 'Weekly roundup and engagement follow-ups' },
    ],
    kpis: { comments_per_day: 5, target_replies: 10, reach_goal: '100,000+', engagement_rate_target: '3-5% reply rate on comments' },
  },
  execution_queue: [
    { priority: 1, video_title: '10 Productivity Hacks That Actually Work in 2026', platform: 'YouTube', action: 'comment', pre_written_comment: 'These are solid! I started using FlowDesk for hack #3 (time blocking) and it literally changed my workflow. The AI scheduling feature does the blocking for you based on your energy levels.', optimal_post_time: '9:00 AM EST', expected_reach: '15,000-25,000', status: 'ready' },
    { priority: 2, video_title: 'Remote Work Setup That Changed My Life', platform: 'TikTok', action: 'comment', pre_written_comment: 'This setup is fire but the real game changer for remote work is having the right digital tools. FlowDesk keeps my whole remote team synced without the constant Slack spam.', optimal_post_time: '12:00 PM EST', expected_reach: '20,000-35,000', status: 'ready' },
    { priority: 3, video_title: 'POV: Your Calendar Runs Your Life', platform: 'TikTok', action: 'comment', pre_written_comment: 'So real. I switched from letting my calendar control me to using FlowDesk AI scheduling. It learns when you are most productive and blocks time accordingly.', optimal_post_time: '1:00 PM EST', expected_reach: '30,000-50,000', status: 'ready' },
    { priority: 4, video_title: 'Why Most Teams Fail at Async Communication', platform: 'YouTube', action: 'reply', pre_written_comment: 'Great question! We use FlowDesk for async updates and it has cut our meeting time by 40%. The AI summaries are actually useful unlike most tools.', optimal_post_time: '10:00 AM EST', expected_reach: '5,000-10,000', status: 'ready' },
    { priority: 5, video_title: 'My Honest Review: Top 5 Project Management Tools', platform: 'YouTube', action: 'comment', pre_written_comment: 'Solid list! I switched from #2 to FlowDesk about 6 months ago. The AI auto-prioritization and easy onboarding sold me. Would love to see it in your next review!', optimal_post_time: '11:00 AM EST', expected_reach: '8,000-15,000', status: 'ready' },
  ],
}

// ─── Helpers ─────────────────────────────────────────────────
function gid() { return Math.random().toString(36).slice(2, 10) }

function engBadge(level?: string) {
  if (!level) return 'bg-gray-700/40 text-gray-400 border-gray-600/40'
  const l = level.toLowerCase()
  if (l === 'high') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
  if (l === 'medium') return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
  return 'bg-red-500/15 text-red-400 border-red-500/30'
}

function styleBadge(s?: string) {
  if (!s) return 'bg-gray-700/40 text-gray-400 border-gray-600/40'
  const m: Record<string, string> = {
    helpful: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    relatable: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    question: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    endorsement: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  }
  return m[s.toLowerCase()] || 'bg-gray-700/40 text-gray-400 border-gray-600/40'
}

function mentionBadge(t?: string) {
  if (!t) return 'bg-gray-700/40 text-gray-400'
  const m: Record<string, string> = {
    subtle: 'bg-gray-600/30 text-gray-300', indirect: 'bg-amber-500/15 text-amber-400',
    direct: 'bg-pink-500/15 text-pink-400',
  }
  return m[t.toLowerCase()] || 'bg-gray-700/40 text-gray-400'
}

function replyTypeBadge(t?: string) {
  if (!t) return 'bg-gray-700/40 text-gray-400 border-gray-600/40'
  const m: Record<string, string> = {
    question: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    complaint: 'bg-red-500/15 text-red-400 border-red-500/30',
    positive: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    debate: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  }
  return m[t?.toLowerCase() ?? ''] || 'bg-gray-700/40 text-gray-400 border-gray-600/40'
}

function platformIcon(p?: string) {
  const pl = p?.toLowerCase() ?? ''
  if (pl.includes('youtube')) return <RiYoutubeLine className="w-4 h-4 text-red-400" />
  if (pl.includes('tiktok')) return <RiTiktokLine className="w-4 h-4 text-cyan-400" />
  return <FiPlay className="w-4 h-4 text-purple-400" />
}

function platformBg(p?: string) {
  const pl = p?.toLowerCase() ?? ''
  if (pl.includes('youtube')) return 'bg-red-500/10 border-red-500/20 text-red-400'
  if (pl.includes('tiktok')) return 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
  return 'bg-purple-500/10 border-purple-500/20 text-purple-400'
}

function ScoreRing({ score, size = 48 }: { score: number; size?: number }) {
  const r = (size - 8) / 2
  const c = 2 * Math.PI * r
  const pct = (score / 10) * c
  const color = score >= 7 ? '#10b981' : score >= 4 ? '#eab308' : '#ef4444'
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="4" fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="4" fill="none"
          strokeDasharray={c} strokeDashoffset={c - pct} strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <span className="absolute text-xs font-bold" style={{ color }}>{score}</span>
    </div>
  )
}

// ─── Sidebar Nav Items ───────────────────────────────────────
const NAV_ITEMS = [
  { id: 'setup', label: 'Campaign Setup', icon: FiSettings },
  { id: 'discovery', label: 'Video Discovery', icon: FiSearch },
  { id: 'comments', label: 'Comment Queue', icon: FiMessageSquare },
  { id: 'replies', label: 'Reply Strategies', icon: HiOutlineReply },
  { id: 'plan', label: 'Campaign Plan', icon: FiCalendar },
  { id: 'queue', label: 'Execution Queue', icon: FiSend },
]

// ─── Main Component ──────────────────────────────────────────
export default function Page() {
  // State
  const [activeTab, setActiveTab] = useState('setup')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [agentResponse, setAgentResponse] = useState<AgentResponseData | null>(null)
  const [showSampleData, setShowSampleData] = useState(false)

  // Form
  const [brandName, setBrandName] = useState('')
  const [industry, setIndustry] = useState('')
  const [services, setServices] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [brandWebsite, setBrandWebsite] = useState('')
  const [brandTone, setBrandTone] = useState('professional')
  const [platform, setPlatform] = useState<'youtube' | 'tiktok' | 'both'>('both')
  const [campaignGoal, setCampaignGoal] = useState('100K Reach')
  const [commentsPerDay, setCommentsPerDay] = useState(5)

  // Tracking
  const [postedComments, setPostedComments] = useState<Set<string>>(new Set())
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1]))
  const [platformFilter, setPlatformFilter] = useState('all')
  const [showSidebar, setShowSidebar] = useState(false)

  // Derived data
  const displayData: AgentResponseData | null = showSampleData ? SAMPLE : agentResponse
  const discoveredVideos = useMemo(() => Array.isArray(displayData?.discovered_videos) ? displayData.discovered_videos : [], [displayData])
  const generatedComments = useMemo(() => {
    const gc = Array.isArray(displayData?.generated_comments) ? displayData.generated_comments : []
    return gc.map(g => ({ ...g, comments: Array.isArray(g?.comments) ? g.comments : [] }))
  }, [displayData])
  const replyStrategies = useMemo(() => Array.isArray(displayData?.reply_strategies) ? displayData.reply_strategies : [], [displayData])
  const campaignPlan = displayData?.campaign_plan || {} as CampaignPlan
  const executionQueue = useMemo(() => Array.isArray(displayData?.execution_queue) ? displayData.execution_queue : [], [displayData])
  const weeklyBreakdown = useMemo(() => Array.isArray(campaignPlan?.weekly_breakdown) ? campaignPlan.weekly_breakdown : [], [campaignPlan])
  const dailySchedule = useMemo(() => Array.isArray(campaignPlan?.daily_schedule) ? campaignPlan.daily_schedule : [], [campaignPlan])
  const kpis = campaignPlan?.kpis || {} as KPIs

  const filteredVideos = useMemo(() => {
    if (platformFilter === 'all') return discoveredVideos
    return discoveredVideos.filter(v => v.platform?.toLowerCase().includes(platformFilter))
  }, [discoveredVideos, platformFilter])

  const totalCommentsReady = useMemo(() => generatedComments.reduce((a, g) => a + (Array.isArray(g.comments) ? g.comments.length : 0), 0), [generatedComments])
  const hasData = displayData !== null

  // Handlers
  const handleCopy = useCallback((text: string, id: string) => {
    if (!text) return
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  const togglePosted = useCallback((id: string) => {
    setPostedComments(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }, [])

  const toggleTask = useCallback((priority: number) => {
    setCompletedTasks(prev => {
      const s = new Set(prev)
      s.has(priority) ? s.delete(priority) : s.add(priority)
      return s
    })
  }, [])

  const toggleWeek = useCallback((w: number) => {
    setExpandedWeeks(prev => {
      const s = new Set(prev)
      s.has(w) ? s.delete(w) : s.add(w)
      return s
    })
  }, [])

  const handleLaunch = useCallback(async () => {
    if (!brandName.trim() && !industry.trim()) {
      setError('Please provide at least a brand name and industry/niche to start the campaign.')
      return
    }
    setLoading(true)
    setError(null)

    const message = `Run a complete viral video comment marketing campaign analysis:

Brand Name: ${brandName}
Industry/Niche: ${industry}
Services/Products: ${services}
Target Audience: ${targetAudience}
Brand Website: ${brandWebsite}
Brand Tone: ${brandTone}
Target Platforms: ${platform}
Campaign Goal: ${campaignGoal}
Comments Per Day: ${commentsPerDay}

Find 10 trending videos on ${platform === 'both' ? 'YouTube and TikTok' : platform} relevant to ${industry}.
Generate 2-3 marketing comments per video that subtly promote ${brandName}.
Create reply strategies for common comment types.
Build a 30-day campaign plan targeting ${campaignGoal} reach across 100+ videos.
Provide today's execution queue with 5 ready-to-post comments.`

    try {
      const result = await callAIAgent(message, AGENT_ID)
      if (result.success) {
        const data = result?.response?.result as AgentResponseData | undefined
        setAgentResponse(data ?? null)
        setActiveTab('discovery')
        setPostedComments(new Set())
        setCompletedTasks(new Set())
      } else {
        setError(result?.error ?? result?.response?.message ?? 'Campaign analysis failed. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    }
    setLoading(false)
  }, [brandName, industry, services, targetAudience, brandWebsite, brandTone, platform, campaignGoal, commentsPerDay])

  // ─── RENDER ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 flex flex-col">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#1e1e2e] bg-[#0a0a0f]/95 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSidebar(!showSidebar)} className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-gray-400">
              <FiMenu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
                <FiZap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">RUMORA</span>
            </div>
            <span className="hidden sm:inline text-[11px] text-gray-500 border-l border-[#1e1e2e] pl-3 ml-1">Viral Video Comment Automation</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-emerald-400 animate-pulse' : hasData ? 'bg-violet-400' : 'bg-gray-600'}`} />
              <span className="text-[11px] text-gray-500">{loading ? 'Processing...' : hasData ? 'Campaign Active' : 'Idle'}</span>
            </div>
            <Separator orientation="vertical" className="h-5 bg-[#1e1e2e]" />
            <div className="flex items-center gap-2">
              <Label htmlFor="sample" className="text-[11px] text-gray-500 cursor-pointer">Demo</Label>
              <Switch id="sample" checked={showSampleData} onCheckedChange={setShowSampleData} className="data-[state=checked]:bg-violet-600 scale-90" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-[1600px] mx-auto w-full">
        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className={`${showSidebar ? 'fixed inset-0 z-40 bg-black/60 lg:static lg:bg-transparent' : 'hidden lg:block'}`}>
          {showSidebar && <div className="absolute inset-0 lg:hidden" onClick={() => setShowSidebar(false)} />}
          <div className={`${showSidebar ? 'absolute left-0 top-0 bottom-0 w-64 bg-[#0a0a0f] border-r border-[#1e1e2e] z-50 pt-16' : ''} w-60 border-r border-[#1e1e2e] p-4 space-y-4 shrink-0 overflow-y-auto`} style={{ maxHeight: 'calc(100vh - 56px)' }}>
            {/* Brand Profile */}
            {(brandName || showSampleData) && (
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/10 to-pink-500/5 border border-violet-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <FiAward className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-100">{showSampleData ? 'FlowDesk' : brandName || 'Your Brand'}</p>
                    <p className="text-[10px] text-gray-500">{showSampleData ? 'Productivity Software' : industry || 'Set up campaign'}</p>
                  </div>
                </div>
                <Badge className={`text-[10px] ${hasData ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-gray-700/40 text-gray-400 border-gray-600/40'} border`}>
                  {hasData ? 'Campaign Active' : 'Not Started'}
                </Badge>
              </div>
            )}

            {/* Navigation */}
            <nav className="space-y-1">
              {NAV_ITEMS.map(item => (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setShowSidebar(false) }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === item.id ? 'bg-violet-500/15 text-violet-300 font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </button>
              ))}
            </nav>

            <Separator className="bg-[#1e1e2e]" />

            {/* Mini Stats */}
            <div className="space-y-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider px-1">Campaign Stats</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-[#111118] border border-[#1e1e2e]">
                  <p className="text-[10px] text-gray-500">Videos</p>
                  <p className="text-lg font-bold text-gray-100">{discoveredVideos.length}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-[#111118] border border-[#1e1e2e]">
                  <p className="text-[10px] text-gray-500">Comments</p>
                  <p className="text-lg font-bold text-gray-100">{totalCommentsReady}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-[#111118] border border-[#1e1e2e]">
                  <p className="text-[10px] text-gray-500">Reach</p>
                  <p className="text-sm font-bold text-emerald-400">{campaignPlan?.total_target_reach || '--'}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-[#111118] border border-[#1e1e2e]">
                  <p className="text-[10px] text-gray-500">Queue</p>
                  <p className="text-lg font-bold text-gray-100">{executionQueue.length}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Content ────────────────────────────────── */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 56px)' }}>
          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-300">{error}</p>
                <button onClick={() => { setError(null); handleLaunch() }}
                  className="mt-1.5 text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                  <FiRefreshCw className="w-3 h-3" /> Retry
                </button>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300"><FiX className="w-4 h-4" /></button>
            </div>
          )}

          {/* ═══ Tab: Campaign Setup ══════════════════════ */}
          {activeTab === 'setup' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent mb-2">Launch Your Viral Comment Campaign</h1>
                <p className="text-sm text-gray-400">Set up your brand profile and let AI discover trending videos, generate comments, and plan your 30-day campaign</p>
              </div>

              {/* Campaign Promise Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 via-pink-500/10 to-violet-500/10 border border-violet-500/20">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  {[
                    { val: '100K+', label: 'Reach Target', icon: FiTrendingUp },
                    { val: 'YouTube', label: '+ TikTok', icon: FiPlay },
                    { val: '100', label: 'Videos', icon: BiVideoRecording },
                    { val: '1', label: 'Brand', icon: FiAward },
                    { val: '30', label: 'Days', icon: FiCalendar },
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <s.icon className="w-4 h-4 text-violet-400" />
                      <span className="text-lg font-bold text-white">{s.val}</span>
                      <span className="text-[10px] text-gray-500">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4 p-5 rounded-xl bg-[#111118] border border-[#1e1e2e]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-300 text-xs flex items-center gap-1"><FiAward className="w-3 h-3 text-violet-400" /> Brand Name</Label>
                    <Input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="e.g. FlowDesk"
                      className="bg-[#0a0a0f] border-[#1e1e2e] text-gray-200 placeholder:text-gray-600 focus:border-violet-500/50 h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-300 text-xs flex items-center gap-1"><FiLayers className="w-3 h-3 text-cyan-400" /> Industry / Niche</Label>
                    <Input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. Productivity Software, SaaS"
                      className="bg-[#0a0a0f] border-[#1e1e2e] text-gray-200 placeholder:text-gray-600 focus:border-violet-500/50 h-10" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-xs flex items-center gap-1"><HiOutlineLightBulb className="w-3 h-3 text-yellow-400" /> Services / Products to Promote</Label>
                  <Textarea value={services} onChange={e => setServices(e.target.value)}
                    placeholder="Describe what you want to promote in the comments..."
                    className="bg-[#0a0a0f] border-[#1e1e2e] text-gray-200 placeholder:text-gray-600 focus:border-violet-500/50 min-h-[80px]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-300 text-xs flex items-center gap-1"><FiUsers className="w-3 h-3 text-pink-400" /> Target Audience</Label>
                    <Input value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="e.g. Remote workers, startup founders"
                      className="bg-[#0a0a0f] border-[#1e1e2e] text-gray-200 placeholder:text-gray-600 focus:border-violet-500/50 h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-300 text-xs flex items-center gap-1"><FiGlobe className="w-3 h-3 text-emerald-400" /> Brand Website</Label>
                    <Input value={brandWebsite} onChange={e => setBrandWebsite(e.target.value)} placeholder="https://yoursite.com"
                      className="bg-[#0a0a0f] border-[#1e1e2e] text-gray-200 placeholder:text-gray-600 focus:border-violet-500/50 h-10" />
                  </div>
                </div>

                {/* Tone */}
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-xs">Brand Tone</Label>
                  <div className="flex flex-wrap gap-2">
                    {['professional', 'casual', 'witty', 'inspirational'].map(t => (
                      <button key={t} onClick={() => setBrandTone(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${brandTone === t ? 'bg-violet-500/20 border-violet-500/40 text-violet-300' : 'bg-[#0a0a0f] border-[#1e1e2e] text-gray-500 hover:text-gray-300 hover:border-gray-600'}`}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform */}
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-xs">Target Platforms</Label>
                  <div className="flex gap-2">
                    {([['youtube', 'YouTube', RiYoutubeLine, 'text-red-400'], ['tiktok', 'TikTok', RiTiktokLine, 'text-cyan-400'], ['both', 'Both', FiPlay, 'text-violet-400']] as const).map(([val, label, Icon, iconColor]) => (
                      <button key={val} onClick={() => setPlatform(val as 'youtube' | 'tiktok' | 'both')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${platform === val ? 'bg-violet-500/15 border-violet-500/40 text-violet-300' : 'bg-[#0a0a0f] border-[#1e1e2e] text-gray-500 hover:border-gray-600'}`}>
                        <Icon className={`w-4 h-4 ${iconColor}`} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goal + Comments */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-300 text-xs">Campaign Goal</Label>
                    <div className="flex gap-2">
                      {['100K Reach', '50K Reach', 'Custom'].map(g => (
                        <button key={g} onClick={() => setCampaignGoal(g)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${campaignGoal === g ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-[#0a0a0f] border-[#1e1e2e] text-gray-500 hover:text-gray-300'}`}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-300 text-xs">Comments Per Day: {commentsPerDay}</Label>
                    <input type="range" min={3} max={15} value={commentsPerDay} onChange={e => setCommentsPerDay(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#1e1e2e] rounded-lg appearance-none cursor-pointer accent-violet-500" />
                  </div>
                </div>
              </div>

              {/* Launch Button */}
              <button onClick={handleLaunch} disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                {loading ? (
                  <><FiRefreshCw className="w-4 h-4 animate-spin" /> Discovering Videos &amp; Building Campaign...</>
                ) : (
                  <><RiRocketLine className="w-5 h-5" /> Launch Campaign Discovery</>
                )}
              </button>

              {loading && (
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="p-4 rounded-xl bg-[#111118] border border-[#1e1e2e] space-y-3">
                      <Skeleton className="h-4 w-48 bg-[#1e1e2e]" />
                      <Skeleton className="h-3 w-full bg-[#1e1e2e]" />
                      <Skeleton className="h-3 w-3/4 bg-[#1e1e2e]" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ Tab: Video Discovery ═════════════════════ */}
          {activeTab === 'discovery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FiSearch className="w-5 h-5 text-violet-400" /> Discovered Target Videos
                  <Badge className="text-[11px] bg-violet-500/15 text-violet-300 border border-violet-500/30">{filteredVideos.length}</Badge>
                </h2>
                <div className="flex items-center gap-2">
                  <FiFilter className="w-3.5 h-3.5 text-gray-500" />
                  {['all', 'youtube', 'tiktok'].map(f => (
                    <button key={f} onClick={() => setPlatformFilter(f)}
                      className={`px-3 py-1 rounded-lg text-xs border transition-all ${platformFilter === f ? 'bg-violet-500/15 border-violet-500/40 text-violet-300' : 'bg-[#111118] border-[#1e1e2e] text-gray-500 hover:text-gray-300'}`}>
                      {f === 'all' ? 'All' : f === 'youtube' ? 'YouTube' : 'TikTok'}
                    </button>
                  ))}
                </div>
              </div>

              {!hasData && !loading ? (
                <div className="p-12 rounded-xl bg-[#111118] border border-[#1e1e2e] text-center">
                  <FiSearch className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-base font-medium text-gray-400 mb-2">No Videos Discovered Yet</h3>
                  <p className="text-sm text-gray-500 mb-4">Set up your campaign to discover target videos</p>
                  <Button onClick={() => setActiveTab('setup')} variant="outline" className="border-violet-500/30 text-violet-300 hover:bg-violet-600/10">
                    Go to Campaign Setup
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredVideos.map((video, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#111118] border border-[#1e1e2e] hover:border-violet-500/30 transition-all group">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className={`text-[10px] border ${platformBg(video.platform)}`}>
                            {platformIcon(video.platform)}
                            <span className="ml-1">{video.platform}</span>
                          </Badge>
                          <Badge className={`text-[10px] border ${engBadge(video.engagement_level)}`}>
                            {video.engagement_level}
                          </Badge>
                        </div>
                        <ScoreRing score={video.relevance_score ?? 0} />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-200 mb-2 leading-snug">{video.title}</h3>
                      <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><FiEye className="w-3 h-3" /> {video.estimated_views}</span>
                        <Badge className="text-[10px] bg-[#0a0a0f] text-gray-400 border border-[#1e1e2e]">{video.niche_match}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-3 leading-relaxed">{video.why_target}</p>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500">
                        <FiExternalLink className="w-3 h-3" />
                        <span className="truncate">{video.url_suggestion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="p-4 rounded-xl bg-[#111118] border border-[#1e1e2e] space-y-3">
                      <Skeleton className="h-5 w-20 bg-[#1e1e2e]" />
                      <Skeleton className="h-4 w-full bg-[#1e1e2e]" />
                      <Skeleton className="h-3 w-3/4 bg-[#1e1e2e]" />
                      <Skeleton className="h-3 w-1/2 bg-[#1e1e2e]" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ Tab: Comment Queue ═══════════════════════ */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FiMessageSquare className="w-5 h-5 text-pink-400" /> Comment Queue
                  <Badge className="text-[11px] bg-pink-500/15 text-pink-300 border border-pink-500/30">{totalCommentsReady} ready</Badge>
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  {postedComments.size} of {totalCommentsReady} posted
                </div>
              </div>

              {!hasData && !loading ? (
                <div className="p-12 rounded-xl bg-[#111118] border border-[#1e1e2e] text-center">
                  <FiMessageSquare className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-base font-medium text-gray-400 mb-2">No Comments Generated</h3>
                  <p className="text-sm text-gray-500 mb-4">Run a campaign to generate marketing comments</p>
                  <Button onClick={() => setActiveTab('setup')} variant="outline" className="border-violet-500/30 text-violet-300 hover:bg-violet-600/10">
                    Set Up Campaign
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {generatedComments.map((group, gi) => (
                    <div key={gi} className="space-y-2">
                      <div className="flex items-center gap-2 px-1">
                        {platformIcon(group.platform)}
                        <h3 className="text-sm font-semibold text-gray-300">{group.target_video}</h3>
                        <Badge className={`text-[10px] border ${platformBg(group.platform)}`}>{group.platform}</Badge>
                      </div>
                      <div className="space-y-2">
                        {(Array.isArray(group.comments) ? group.comments : []).map((comment, ci) => {
                          const cid = `${gi}-${ci}`
                          const isPosted = postedComments.has(cid)
                          return (
                            <div key={ci} className={`p-4 rounded-xl border transition-all ${isPosted ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-[#111118] border-[#1e1e2e] hover:border-violet-500/20'}`}>
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge className={`text-[10px] border ${styleBadge(comment.style)}`}>{comment.style}</Badge>
                                  <Badge className={`text-[10px] ${mentionBadge(comment.brand_mention_type)}`}>{comment.brand_mention_type}</Badge>
                                  {isPosted && <Badge className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Posted</Badge>}
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button onClick={() => handleCopy(comment.text ?? '', cid)}
                                    className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 hover:text-white transition-colors" title="Copy">
                                    {copiedId === cid ? <FiCheck className="w-3.5 h-3.5 text-emerald-400" /> : <FiCopy className="w-3.5 h-3.5" />}
                                  </button>
                                  <button onClick={() => togglePosted(cid)}
                                    className={`p-1.5 rounded-md hover:bg-white/5 transition-colors ${isPosted ? 'text-emerald-400' : 'text-gray-500 hover:text-emerald-400'}`} title={isPosted ? 'Mark unposted' : 'Mark as posted'}>
                                    {isPosted ? <FiCheckCircle className="w-3.5 h-3.5" /> : <FiCircle className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>
                              <div className="relative mb-2">
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 to-pink-500 rounded-full" />
                                <p className="pl-3.5 text-sm text-gray-200 leading-relaxed">{comment.text}</p>
                                {copiedId === cid && <span className="absolute -top-1 right-0 text-[10px] text-emerald-400 font-medium">Copied!</span>}
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-gray-500">
                                <span className="flex items-center gap-1">
                                  Naturalness: <span className="text-gray-300 font-medium">{comment.naturalness ?? 0}/10</span>
                                </span>
                                <span>{comment.estimated_engagement}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {loading && (
                <div className="space-y-3">{[1,2,3].map(i => (
                  <div key={i} className="p-4 rounded-xl bg-[#111118] border border-[#1e1e2e] space-y-3">
                    <Skeleton className="h-5 w-48 bg-[#1e1e2e]" />
                    <Skeleton className="h-16 w-full bg-[#1e1e2e]" />
                    <Skeleton className="h-3 w-32 bg-[#1e1e2e]" />
                  </div>
                ))}</div>
              )}
            </div>
          )}

          {/* ═══ Tab: Reply Strategies ════════════════════ */}
          {activeTab === 'replies' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <HiOutlineReply className="w-5 h-5 text-cyan-400" /> Reply Strategies
                <Badge className="text-[11px] bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">{replyStrategies.length}</Badge>
              </h2>

              {!hasData && !loading ? (
                <div className="p-12 rounded-xl bg-[#111118] border border-[#1e1e2e] text-center">
                  <HiOutlineReply className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-base font-medium text-gray-400 mb-2">No Reply Strategies</h3>
                  <p className="text-sm text-gray-500 mb-4">Run a campaign to generate reply strategies</p>
                  <Button onClick={() => setActiveTab('setup')} variant="outline" className="border-violet-500/30 text-violet-300 hover:bg-violet-600/10">
                    Set Up Campaign
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {replyStrategies.map((rs, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#111118] border border-[#1e1e2e] hover:border-cyan-500/20 transition-all space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={`text-[10px] border ${replyTypeBadge(rs.comment_type)}`}>{rs.comment_type}</Badge>
                        <Badge className="text-[10px] bg-[#0a0a0f] text-gray-400 border border-[#1e1e2e]">{rs.tone}</Badge>
                      </div>
                      {/* Original Comment */}
                      <div className="p-3 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e]">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Original Comment</p>
                        <p className="text-sm text-gray-400 italic">&ldquo;{rs.example_original_comment}&rdquo;</p>
                      </div>
                      <div className="flex items-center justify-center"><FiArrowRight className="w-3 h-3 text-gray-600 rotate-90" /></div>
                      {/* Suggested Reply */}
                      <div className="relative p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-violet-500 rounded-full" />
                        <div className="pl-2">
                          <p className="text-[10px] text-cyan-400 uppercase tracking-wider mb-1">Your Reply</p>
                          <p className="text-sm text-gray-200 leading-relaxed">{rs.suggested_reply}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-gray-500"><span className="text-gray-400">Strategy:</span> {rs.brand_integration}</p>
                        <button onClick={() => handleCopy(rs.suggested_reply ?? '', `reply-${i}`)}
                          className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 hover:text-white transition-colors">
                          {copiedId === `reply-${i}` ? <FiCheck className="w-3.5 h-3.5 text-emerald-400" /> : <FiCopy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {loading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">{[1,2,3,4].map(i => (
                  <div key={i} className="p-4 rounded-xl bg-[#111118] border border-[#1e1e2e] space-y-3">
                    <Skeleton className="h-5 w-24 bg-[#1e1e2e]" />
                    <Skeleton className="h-16 w-full bg-[#1e1e2e]" />
                    <Skeleton className="h-16 w-full bg-[#1e1e2e]" />
                  </div>
                ))}</div>
              )}
            </div>
          )}

          {/* ═══ Tab: Campaign Plan ═══════════════════════ */}
          {activeTab === 'plan' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FiCalendar className="w-5 h-5 text-emerald-400" /> 30-Day Campaign Plan
              </h2>

              {!hasData && !loading ? (
                <div className="p-12 rounded-xl bg-[#111118] border border-[#1e1e2e] text-center">
                  <FiCalendar className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-base font-medium text-gray-400 mb-2">No Campaign Plan</h3>
                  <p className="text-sm text-gray-500 mb-4">Launch a campaign to generate your 30-day plan</p>
                  <Button onClick={() => setActiveTab('setup')} variant="outline" className="border-violet-500/30 text-violet-300 hover:bg-violet-600/10">
                    Set Up Campaign
                  </Button>
                </div>
              ) : (
                <>
                  {/* Campaign Header */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-[#111118] to-emerald-500/5 border border-emerald-500/20">
                    <p className="text-sm text-gray-300 mb-3">{campaignPlan?.goal}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] text-center">
                        <p className="text-[10px] text-gray-500 mb-1">Target Reach</p>
                        <p className="text-xl font-bold text-emerald-400">{campaignPlan?.total_target_reach || '--'}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] text-center">
                        <p className="text-[10px] text-gray-500 mb-1">Total Videos</p>
                        <p className="text-xl font-bold text-violet-400">{campaignPlan?.total_target_videos || '--'}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] text-center">
                        <p className="text-[10px] text-gray-500 mb-1">Duration</p>
                        <p className="text-xl font-bold text-cyan-400">{campaignPlan?.duration || '--'}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] text-center">
                        <p className="text-[10px] text-gray-500 mb-1">Comments/Day</p>
                        <p className="text-xl font-bold text-pink-400">{kpis?.comments_per_day || '--'}</p>
                      </div>
                    </div>
                  </div>

                  {/* KPIs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Comments/Day', val: kpis?.comments_per_day, icon: FiMessageSquare, color: 'text-pink-400' },
                      { label: 'Target Replies', val: kpis?.target_replies, icon: HiOutlineReply, color: 'text-cyan-400' },
                      { label: 'Reach Goal', val: kpis?.reach_goal, icon: FiTrendingUp, color: 'text-emerald-400' },
                      { label: 'Engagement Rate', val: kpis?.engagement_rate_target, icon: FiBarChart2, color: 'text-violet-400' },
                    ].map((kpi, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#111118] border border-[#1e1e2e]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-gray-500">{kpi.label}</span>
                          <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                        </div>
                        <p className={`text-sm font-bold ${kpi.color}`}>{kpi.val ?? '--'}</p>
                      </div>
                    ))}
                  </div>

                  {/* Weekly Breakdown */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2 px-1">
                      <FiLayers className="w-4 h-4 text-violet-400" /> Weekly Breakdown
                    </h3>
                    {weeklyBreakdown.map((week, i) => (
                      <div key={i} className="rounded-xl bg-[#111118] border border-[#1e1e2e] overflow-hidden">
                        <button onClick={() => toggleWeek(week.week ?? i+1)}
                          className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center text-sm font-bold text-violet-400">
                              W{week.week}
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-200">{week.theme}</p>
                              <p className="text-[11px] text-gray-500">{week.daily_videos} videos/day - {week.platform_focus}</p>
                            </div>
                          </div>
                          {expandedWeeks.has(week.week ?? i+1) ? <FiChevronUp className="w-4 h-4 text-gray-500" /> : <FiChevronDown className="w-4 h-4 text-gray-500" />}
                        </button>
                        {expandedWeeks.has(week.week ?? i+1) && (
                          <div className="px-4 pb-4 pt-0 border-t border-[#1e1e2e]">
                            <div className="space-y-1.5 mt-3">
                              {(Array.isArray(week.key_actions) ? week.key_actions : []).map((action, ai) => (
                                <div key={ai} className="flex items-start gap-2 text-sm text-gray-400">
                                  <FiArrowRight className="w-3 h-3 text-violet-400 mt-1 shrink-0" />
                                  <span>{action}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Daily Schedule */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2 px-1">
                      <FiClock className="w-4 h-4 text-cyan-400" /> Daily Schedule
                    </h3>
                    <div className="rounded-xl bg-[#111118] border border-[#1e1e2e] overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[#1e1e2e]">
                              <th className="text-left p-3 text-[11px] text-gray-500 uppercase tracking-wider font-medium">Day</th>
                              <th className="text-left p-3 text-[11px] text-gray-500 uppercase tracking-wider font-medium">Videos</th>
                              <th className="text-left p-3 text-[11px] text-gray-500 uppercase tracking-wider font-medium">Platform</th>
                              <th className="text-left p-3 text-[11px] text-gray-500 uppercase tracking-wider font-medium">Time</th>
                              <th className="text-left p-3 text-[11px] text-gray-500 uppercase tracking-wider font-medium">Focus</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dailySchedule.map((day, i) => (
                              <tr key={i} className="border-b border-[#1e1e2e]/50 hover:bg-white/[0.02] transition-colors">
                                <td className="p-3 text-gray-300 font-medium">{day.day}</td>
                                <td className="p-3 text-gray-400">{day.videos_to_target}</td>
                                <td className="p-3">
                                  <Badge className={`text-[10px] border ${platformBg(day.platform)}`}>{day.platform}</Badge>
                                </td>
                                <td className="p-3 text-gray-400 flex items-center gap-1"><FiClock className="w-3 h-3 text-gray-600" /> {day.optimal_time}</td>
                                <td className="p-3 text-gray-400">{day.focus_area}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {loading && (
                <div className="space-y-3">{[1,2,3].map(i => (
                  <div key={i} className="p-4 rounded-xl bg-[#111118] border border-[#1e1e2e] space-y-3">
                    <Skeleton className="h-6 w-32 bg-[#1e1e2e]" />
                    <Skeleton className="h-4 w-full bg-[#1e1e2e]" />
                    <Skeleton className="h-4 w-3/4 bg-[#1e1e2e]" />
                  </div>
                ))}</div>
              )}
            </div>
          )}

          {/* ═══ Tab: Execution Queue ═════════════════════ */}
          {activeTab === 'queue' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FiSend className="w-5 h-5 text-emerald-400" /> Today&apos;s Execution Queue
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  {completedTasks.size} of {executionQueue.length} completed
                </div>
              </div>

              {/* Progress */}
              {hasData && executionQueue.length > 0 && (
                <div className="p-4 rounded-xl bg-[#111118] border border-[#1e1e2e]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Today&apos;s Progress</span>
                    <span className="text-xs font-medium text-emerald-400">{Math.round((completedTasks.size / executionQueue.length) * 100)}%</span>
                  </div>
                  <Progress value={(completedTasks.size / executionQueue.length) * 100} className="h-2 bg-[#1e1e2e]" />
                </div>
              )}

              {!hasData && !loading ? (
                <div className="p-12 rounded-xl bg-[#111118] border border-[#1e1e2e] text-center">
                  <FiSend className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-base font-medium text-gray-400 mb-2">No Tasks in Queue</h3>
                  <p className="text-sm text-gray-500 mb-4">Launch a campaign to populate your execution queue</p>
                  <Button onClick={() => setActiveTab('setup')} variant="outline" className="border-violet-500/30 text-violet-300 hover:bg-violet-600/10">
                    Set Up Campaign
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {executionQueue.map((task, i) => {
                    const isDone = completedTasks.has(task.priority ?? i)
                    return (
                      <div key={i} className={`p-4 rounded-xl border transition-all ${isDone ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-[#111118] border-[#1e1e2e] hover:border-violet-500/20'}`}>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-violet-500/20 text-violet-400'}`}>
                              {isDone ? <FiCheck className="w-3.5 h-3.5" /> : `#${task.priority}`}
                            </div>
                            <Badge className={`text-[10px] border ${platformBg(task.platform)}`}>
                              {platformIcon(task.platform)}
                              <span className="ml-1">{task.platform}</span>
                            </Badge>
                            <Badge className={`text-[10px] border ${task.action === 'reply' ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' : 'bg-violet-500/15 text-violet-400 border-violet-500/30'}`}>
                              {task.action}
                            </Badge>
                            {isDone && <Badge className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Done</Badge>}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => handleCopy(task.pre_written_comment ?? '', `task-${i}`)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 transition-colors flex items-center gap-1">
                              {copiedId === `task-${i}` ? <><FiCheck className="w-3 h-3 text-emerald-400" /> Copied</> : <><FiCopy className="w-3 h-3" /> Copy</>}
                            </button>
                            <button onClick={() => toggleTask(task.priority ?? i)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${isDone ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25' : 'bg-[#0a0a0f] text-gray-400 hover:bg-white/5 border border-[#1e1e2e]'}`}>
                              {isDone ? <><FiCheckCircle className="w-3 h-3" /> Done</> : <><FiCircle className="w-3 h-3" /> Mark Done</>}
                            </button>
                          </div>
                        </div>

                        <h4 className="text-sm font-medium text-gray-200 mb-2">{task.video_title}</h4>

                        <div className="relative mb-3">
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 to-pink-500 rounded-full" />
                          <p className="pl-3.5 text-sm text-gray-300 leading-relaxed">{task.pre_written_comment}</p>
                        </div>

                        <div className="flex items-center gap-4 text-[11px] text-gray-500">
                          <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> {task.optimal_post_time}</span>
                          <span className="flex items-center gap-1"><FiEye className="w-3 h-3" /> Reach: {task.expected_reach}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {loading && (
                <div className="space-y-3">{[1,2,3].map(i => (
                  <div key={i} className="p-4 rounded-xl bg-[#111118] border border-[#1e1e2e] space-y-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-7 w-7 rounded-lg bg-[#1e1e2e]" />
                      <Skeleton className="h-5 w-20 bg-[#1e1e2e]" />
                      <Skeleton className="h-5 w-16 bg-[#1e1e2e]" />
                    </div>
                    <Skeleton className="h-4 w-3/4 bg-[#1e1e2e]" />
                    <Skeleton className="h-12 w-full bg-[#1e1e2e]" />
                  </div>
                ))}</div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-[#1e1e2e] bg-[#0a0a0f]">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <FiZap className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-[11px] text-gray-600">RUMORA - Viral Video Comment Automation</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-gray-600">
            <span>100K+ reach</span>
            <span className="text-gray-700">|</span>
            <span>100 videos</span>
            <span className="text-gray-700">|</span>
            <span>30 days</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
