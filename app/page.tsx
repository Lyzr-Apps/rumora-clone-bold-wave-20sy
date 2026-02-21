'use client'

import React, { useState, useCallback } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  FiTrendingUp, FiZap, FiMessageSquare, FiTarget, FiCopy, FiClock,
  FiCheck, FiRefreshCw, FiChevronDown, FiChevronUp, FiSearch,
  FiBarChart2, FiHash, FiArrowUp, FiArrowDown, FiArrowRight, FiPlay,
  FiEye, FiTrash2, FiBookmark, FiActivity, FiAlertCircle, FiX, FiSettings
} from 'react-icons/fi'
import { HiOutlineSparkles, HiOutlineLightBulb } from 'react-icons/hi'
import { BiVideoRecording } from 'react-icons/bi'
import { RiTiktokLine, RiYoutubeLine } from 'react-icons/ri'

const AGENT_ID = '699a22a5a28f723dc0af0b81'
const AGENT_NAME = 'Rumora Marketing Intelligence Agent'

// --- Interfaces ---
interface AnalysisData {
  video_topic?: string
  viral_score?: number
  audience_type?: string
  platform?: string
  trend_category?: string
  engagement_window?: string
}

interface CommentData {
  text?: string
  style?: string
  naturalness_score?: number
  engagement_potential?: string
  marketing_angle?: string
}

interface StrategyData {
  best_posting_time?: string
  recommended_hashtags?: string[]
  engagement_tips?: string[]
  ab_test_suggestions?: string[]
}

interface TrendInsightsData {
  trend_direction?: string
  predicted_peak?: string
  related_trends?: string[]
  opportunity_score?: number
}

interface AgentResponseData {
  analysis?: AnalysisData
  comments?: CommentData[]
  strategy?: StrategyData
  trend_insights?: TrendInsightsData
}

interface HistoryEntry {
  id: string
  timestamp: string
  videoUrl: string
  platform: string
  brandName: string
  viralScore: number
  topic: string
}

interface SavedComment {
  id: string
  text: string
  style: string
  savedAt: string
}

// --- Theme ---
const THEME_VARS: React.CSSProperties & Record<string, string> = {
  '--background': '240 15% 5%',
  '--foreground': '0 0% 95%',
  '--card': '240 12% 9%',
  '--card-foreground': '0 0% 95%',
  '--popover': '240 12% 9%',
  '--popover-foreground': '0 0% 95%',
  '--primary': '263 70% 60%',
  '--primary-foreground': '0 0% 100%',
  '--secondary': '240 10% 15%',
  '--secondary-foreground': '0 0% 80%',
  '--muted': '240 10% 14%',
  '--muted-foreground': '240 5% 55%',
  '--accent': '330 80% 55%',
  '--accent-foreground': '0 0% 100%',
  '--destructive': '0 62% 50%',
  '--destructive-foreground': '0 0% 98%',
  '--border': '240 10% 18%',
  '--input': '240 10% 18%',
  '--ring': '263 70% 60%',
  '--radius': '0.75rem',
}

// --- Sample Data ---
const SAMPLE_RESPONSE: AgentResponseData = {
  analysis: {
    video_topic: 'AI-Powered Productivity Tools for Remote Workers',
    viral_score: 8,
    audience_type: 'Tech-savvy professionals aged 25-40',
    platform: 'YouTube',
    trend_category: 'Technology & Productivity',
    engagement_window: '24-48 hours from posting'
  },
  comments: [
    {
      text: "This is literally what I've been searching for! Just switched to this workflow and my team's output doubled. Anyone else seeing similar results?",
      style: 'relatable',
      naturalness_score: 9,
      engagement_potential: 'High - personal experience drives replies',
      marketing_angle: 'Social proof through authentic experience sharing'
    },
    {
      text: "Wait, does this actually work with Notion? I tried 5 different tools last month and nothing integrated properly. Would love to hear from others who tried it.",
      style: 'question-based',
      naturalness_score: 8,
      engagement_potential: 'Very High - question format invites responses',
      marketing_angle: 'Problem-solution framing that highlights product value'
    },
    {
      text: "My boss asked why I finished the project 2 days early. I just smiled. Some secrets are worth keeping (but not this one - check the link in bio).",
      style: 'humorous',
      naturalness_score: 7,
      engagement_potential: 'High - humor increases shareability',
      marketing_angle: 'Aspirational results with playful tone'
    },
    {
      text: "Fun fact: the average remote worker wastes 3.5 hours daily on context switching. Tools like this cut that by 60%. The data doesn't lie.",
      style: 'informative',
      naturalness_score: 8,
      engagement_potential: 'Medium-High - statistics grab attention',
      marketing_angle: 'Data-driven credibility building'
    },
    {
      text: "Started using this 3 months ago when I was drowning in deadlines. Now I mentor others on the same workflow. The transformation was real.",
      style: 'story-based',
      naturalness_score: 9,
      engagement_potential: 'High - narrative arc creates emotional connection',
      marketing_angle: 'Transformation story builds aspirational desire'
    }
  ],
  strategy: {
    best_posting_time: 'Tuesday-Thursday, 9-11 AM EST (peak professional browsing)',
    recommended_hashtags: ['#ProductivityHacks', '#RemoteWork', '#AITools', '#WorkFromHome', '#TechLife', '#Efficiency'],
    engagement_tips: [
      'Reply to every comment within the first 2 hours to boost algorithmic ranking',
      'Pin a comment with a call-to-action after reaching 50+ comments',
      'Use the question-based comments first to seed discussion threads',
      'Space comments 15-30 minutes apart to appear organic',
      'Engage with other comments on the video before posting yours'
    ],
    ab_test_suggestions: [
      'Test relatable vs question-based as first comment to measure reply rates',
      'Compare morning (9 AM) vs lunch (12 PM) posting for engagement differences',
      'Try with and without hashtags in comment text to measure visibility impact',
      'Test emoji usage: professional minimal vs expressive to see audience preference'
    ]
  },
  trend_insights: {
    trend_direction: 'Rising',
    predicted_peak: 'Next 2-3 weeks as Q1 productivity season begins',
    related_trends: ['AI Automation', 'Digital Nomad Lifestyle', 'Solopreneur Tools', 'Deep Work Methodology', 'Async Communication'],
    opportunity_score: 9
  }
}

// --- Helper Functions ---
function getViralScoreColor(score: number): string {
  if (score >= 7) return 'text-emerald-400'
  if (score >= 4) return 'text-yellow-400'
  return 'text-red-400'
}

function getViralScoreBg(score: number): string {
  if (score >= 7) return 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30'
  if (score >= 4) return 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30'
  return 'from-red-500/20 to-red-500/5 border-red-500/30'
}

function getStyleColor(style?: string): string {
  switch (style?.toLowerCase()) {
    case 'humorous': return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    case 'informative': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    case 'relatable': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    case 'question-based': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    case 'story-based': return 'bg-pink-500/20 text-pink-300 border-pink-500/30'
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  }
}

function getTrendIcon(direction?: string) {
  switch (direction?.toLowerCase()) {
    case 'rising': return <FiArrowUp className="text-emerald-400" />
    case 'falling': return <FiArrowDown className="text-red-400" />
    case 'stable': return <FiArrowRight className="text-yellow-400" />
    default: return <FiTrendingUp className="text-purple-400" />
  }
}

function getTrendColor(direction?: string): string {
  switch (direction?.toLowerCase()) {
    case 'rising': return 'text-emerald-400'
    case 'falling': return 'text-red-400'
    case 'stable': return 'text-yellow-400'
    default: return 'text-purple-400'
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

// --- Markdown Renderer ---
function formatInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold">{part}</strong>
    ) : (
      part
    )
  )
}

function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### ')) return <h4 key={i} className="font-semibold text-sm mt-3 mb-1">{line.slice(4)}</h4>
        if (line.startsWith('## ')) return <h3 key={i} className="font-semibold text-base mt-3 mb-1">{line.slice(3)}</h3>
        if (line.startsWith('# ')) return <h2 key={i} className="font-bold text-lg mt-4 mb-2">{line.slice(2)}</h2>
        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-sm">{formatInline(line.slice(2))}</li>
        if (/^\d+\.\s/.test(line)) return <li key={i} className="ml-4 list-decimal text-sm">{formatInline(line.replace(/^\d+\.\s/, ''))}</li>
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i} className="text-sm">{formatInline(line)}</p>
      })}
    </div>
  )
}

// --- Viral Score Ring ---
function ViralScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 10) * circumference
  const strokeColor = score >= 7 ? '#10b981' : score >= 4 ? '#eab308' : '#ef4444'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={strokeColor} strokeWidth="8" fill="none" strokeDasharray={circumference} strokeDashoffset={circumference - progress} strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${getViralScoreColor(score)}`}>{score}</span>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">/ 10</span>
      </div>
    </div>
  )
}

// --- Loading Skeleton ---
function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="bg-[#16161f] border-[#2a2a3a]">
            <CardContent className="p-5">
              <Skeleton className="h-4 w-24 mb-3 bg-[#2a2a3a]" />
              <Skeleton className="h-8 w-32 bg-[#2a2a3a]" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-[#16161f] border-[#2a2a3a]">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48 bg-[#2a2a3a]" />
          <div className="flex gap-4">
            <Skeleton className="h-24 w-24 rounded-full bg-[#2a2a3a]" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-full bg-[#2a2a3a]" />
              <Skeleton className="h-4 w-3/4 bg-[#2a2a3a]" />
              <Skeleton className="h-4 w-1/2 bg-[#2a2a3a]" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="bg-[#16161f] border-[#2a2a3a]">
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-4 w-20 bg-[#2a2a3a]" />
              <Skeleton className="h-16 w-full bg-[#2a2a3a]" />
              <Skeleton className="h-3 w-32 bg-[#2a2a3a]" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// --- Comment Card ---
function CommentCard({
  comment,
  index,
  onCopy,
  onSave,
  copiedId,
}: {
  comment: CommentData
  index: number
  onCopy: (text: string, id: string) => void
  onSave: (comment: CommentData) => void
  copiedId: string | null
}) {
  const [expanded, setExpanded] = useState(false)
  const cardId = `comment-${index}`
  const isCopied = copiedId === cardId

  return (
    <Card className="bg-[#16161f] border-[#2a2a3a] hover:border-purple-500/30 transition-all duration-300 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Badge className={`text-[11px] border ${getStyleColor(comment?.style)}`}>
              {comment?.style ?? 'unknown'}
            </Badge>
            <span className="text-xs text-gray-500">#{index + 1}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onCopy(comment?.text ?? '', cardId)}
              className="p-1.5 rounded-md hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
              title="Copy comment"
            >
              {isCopied ? <FiCheck className="w-3.5 h-3.5 text-emerald-400" /> : <FiCopy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => onSave(comment)}
              className="p-1.5 rounded-md hover:bg-white/5 transition-colors text-gray-400 hover:text-purple-400"
              title="Save comment"
            >
              <FiBookmark className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="relative mb-4">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
          <p className="pl-4 text-sm text-gray-200 leading-relaxed italic">
            &ldquo;{comment?.text ?? ''}&rdquo;
          </p>
          {isCopied && (
            <span className="absolute -top-2 right-0 text-[10px] text-emerald-400 font-medium">Copied!</span>
          )}
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-500">Naturalness</span>
            <div className="w-16 h-1.5 rounded-full bg-[#2a2a3a] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
                style={{ width: `${((comment?.naturalness_score ?? 0) / 10) * 100}%` }}
              />
            </div>
            <span className="text-[11px] text-gray-400 font-medium">{comment?.naturalness_score ?? 0}/10</span>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
        >
          {expanded ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
          {expanded ? 'Hide details' : 'Show details'}
        </button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-[#2a2a3a] space-y-2">
            <div>
              <span className="text-[11px] text-gray-500 uppercase tracking-wider">Engagement Potential</span>
              <p className="text-sm text-gray-300 mt-0.5">{comment?.engagement_potential ?? 'N/A'}</p>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 uppercase tracking-wider">Marketing Angle</span>
              <p className="text-sm text-gray-300 mt-0.5">{comment?.marketing_angle ?? 'N/A'}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// --- Error Boundary ---
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f', color: '#e5e5e5' }}>
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-4 text-sm">{this.state.error}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: '' })}
              className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-500 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// --- Main Page ---
export default function Page() {
  // Core state
  const [activeTab, setActiveTab] = useState('analyze')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [agentResponse, setAgentResponse] = useState<AgentResponseData | null>(null)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)

  // Form state
  const [videoUrl, setVideoUrl] = useState('')
  const [platform, setPlatform] = useState<'youtube' | 'tiktok' | 'both'>('both')
  const [brandName, setBrandName] = useState('')
  const [brandMessage, setBrandMessage] = useState('')
  const [commentStyles, setCommentStyles] = useState<string[]>(['relatable', 'question-based'])
  const [numComments, setNumComments] = useState(5)

  // UI state
  const [showSampleData, setShowSampleData] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedHashtag, setCopiedHashtag] = useState<string | null>(null)
  const [savedComments, setSavedComments] = useState<SavedComment[]>([])
  const [analysisHistory, setAnalysisHistory] = useState<HistoryEntry[]>([])
  const [showSidebar, setShowSidebar] = useState(false)

  // Use sample data or real response
  const displayData: AgentResponseData | null = showSampleData ? SAMPLE_RESPONSE : agentResponse
  const analysis = displayData?.analysis ?? {}
  const comments: CommentData[] = Array.isArray(displayData?.comments) ? displayData.comments : []
  const strategy = displayData?.strategy ?? {}
  const trendInsights = displayData?.trend_insights ?? {}
  const hashtags = Array.isArray(strategy?.recommended_hashtags) ? strategy.recommended_hashtags : []
  const tips = Array.isArray(strategy?.engagement_tips) ? strategy.engagement_tips : []
  const abTests = Array.isArray(strategy?.ab_test_suggestions) ? strategy.ab_test_suggestions : []
  const relatedTrends = Array.isArray(trendInsights?.related_trends) ? trendInsights.related_trends : []

  // Stats
  const totalAnalyses = analysisHistory.length + (showSampleData ? 1 : 0)
  const totalComments = comments.length
  const avgViralScore = analysis?.viral_score ?? 0
  const savedCount = savedComments.length

  const handleStyleToggle = useCallback((style: string) => {
    setCommentStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    )
  }, [])

  const handleCopy = useCallback((text: string, id: string) => {
    if (!text) return
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  const handleCopyHashtag = useCallback((tag: string) => {
    if (!tag) return
    navigator.clipboard.writeText(tag).catch(() => {})
    setCopiedHashtag(tag)
    setTimeout(() => setCopiedHashtag(null), 2000)
  }, [])

  const handleSaveComment = useCallback((comment: CommentData) => {
    setSavedComments(prev => [
      ...prev,
      {
        id: generateId(),
        text: comment?.text ?? '',
        style: comment?.style ?? 'unknown',
        savedAt: new Date().toLocaleString()
      }
    ])
  }, [])

  const handleRemoveSaved = useCallback((id: string) => {
    setSavedComments(prev => prev.filter(c => c.id !== id))
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!videoUrl && !brandName && !brandMessage) {
      setError('Please provide at least a video URL, brand name, or brand message to analyze.')
      return
    }

    setLoading(true)
    setError(null)
    setActiveAgentId(AGENT_ID)

    const message = `Analyze this for viral marketing opportunities:
${videoUrl ? `Video/Content URL: ${videoUrl}` : ''}
Platform: ${platform}
${brandName ? `Brand: ${brandName}` : ''}
${brandMessage ? `Brand Message/Product: ${brandMessage}` : ''}
Desired Comment Styles: ${commentStyles.length > 0 ? commentStyles.join(', ') : 'any'}
Number of Comments: ${numComments}
Generate ${numComments} marketing comments and provide full analysis with strategy recommendations, trend insights, and engagement tips.`

    try {
      const result = await callAIAgent(message, AGENT_ID)
      setActiveAgentId(null)

      if (result.success) {
        const data = result?.response?.result as AgentResponseData | undefined
        setAgentResponse(data ?? null)

        // Add to history
        const newEntry: HistoryEntry = {
          id: generateId(),
          timestamp: new Date().toLocaleString(),
          videoUrl: videoUrl || 'Direct analysis',
          platform,
          brandName: brandName || 'N/A',
          viralScore: data?.analysis?.viral_score ?? 0,
          topic: data?.analysis?.video_topic ?? 'Analysis complete'
        }
        setAnalysisHistory(prev => [newEntry, ...prev])
        setActiveTab('results')
      } else {
        setError(result?.error ?? result?.response?.message ?? 'Analysis failed. Please try again.')
      }
    } catch (err) {
      setActiveAgentId(null)
      setError('Network error. Please check your connection and try again.')
    }

    setLoading(false)
  }, [videoUrl, platform, brandName, brandMessage, commentStyles, numComments])

  const handleQuickAction = useCallback((topic: string) => {
    setVideoUrl('')
    setBrandMessage(topic)
    setBrandName('')
  }, [])

  const hasResults = displayData !== null

  return (
    <ErrorBoundary>
      <div style={THEME_VARS} className="min-h-screen bg-[#0a0a0f] text-gray-100">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-[#2a2a3a] bg-[#0a0a0f]/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <FiZap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">RUMORA</span>
                </div>
                <span className="hidden sm:inline text-xs text-gray-500 border-l border-[#2a2a3a] pl-3 ml-1">AI Viral Marketing Intelligence</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="sample-toggle" className="text-xs text-gray-400 cursor-pointer">Sample Data</Label>
                  <Switch
                    id="sample-toggle"
                    checked={showSampleData}
                    onCheckedChange={setShowSampleData}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white lg:hidden"
                >
                  <FiBookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-[#16161f] border border-[#2a2a3a] p-1 h-auto">
                  <TabsTrigger value="analyze" className="gap-1.5 data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 text-gray-400 px-4 py-2">
                    <FiSearch className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Analyze</span>
                  </TabsTrigger>
                  <TabsTrigger value="results" className="gap-1.5 data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 text-gray-400 px-4 py-2">
                    <FiBarChart2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Results</span>
                  </TabsTrigger>
                  <TabsTrigger value="comments" className="gap-1.5 data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 text-gray-400 px-4 py-2">
                    <FiMessageSquare className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Comments</span>
                  </TabsTrigger>
                  <TabsTrigger value="strategy" className="gap-1.5 data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 text-gray-400 px-4 py-2">
                    <FiTarget className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Strategy</span>
                  </TabsTrigger>
                  <TabsTrigger value="dashboard" className="gap-1.5 data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 text-gray-400 px-4 py-2">
                    <FiActivity className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </TabsTrigger>
                </TabsList>

                {/* === ANALYZE TAB === */}
                <TabsContent value="analyze" className="space-y-6">
                  {/* Hero Input Section */}
                  <Card className="bg-gradient-to-br from-[#16161f] to-[#111118] border-[#2a2a3a] overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />
                    <CardHeader className="relative">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <HiOutlineSparkles className="w-5 h-5 text-purple-400" />
                        Viral Comment Generator
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Enter a video URL, trend topic, or brand details to generate high-engagement marketing comments
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative space-y-5">
                      {/* Video URL */}
                      <div className="space-y-2">
                        <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                          <BiVideoRecording className="w-3.5 h-3.5 text-purple-400" />
                          Video URL or Trend Topic
                        </Label>
                        <Input
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="https://youtube.com/watch?v=... or describe a trending topic"
                          className="bg-[#0a0a0f] border-[#2a2a3a] text-gray-200 placeholder:text-gray-600 focus:border-purple-500/50 h-11"
                        />
                      </div>

                      {/* Platform Selector */}
                      <div className="space-y-2">
                        <Label className="text-gray-300 text-sm">Platform</Label>
                        <div className="flex gap-2">
                          {(['youtube', 'tiktok', 'both'] as const).map(p => (
                            <button
                              key={p}
                              onClick={() => setPlatform(p)}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${platform === p ? 'bg-purple-600/20 border-purple-500/40 text-purple-300' : 'bg-[#0a0a0f] border-[#2a2a3a] text-gray-400 hover:border-gray-600'}`}
                            >
                              {p === 'youtube' && <RiYoutubeLine className="w-4 h-4 text-red-400" />}
                              {p === 'tiktok' && <RiTiktokLine className="w-4 h-4" />}
                              {p === 'both' && <FiPlay className="w-3.5 h-3.5" />}
                              {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Brand Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                            <FiTarget className="w-3.5 h-3.5 text-cyan-400" />
                            Brand Name
                          </Label>
                          <Input
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            placeholder="Your brand or product name"
                            className="bg-[#0a0a0f] border-[#2a2a3a] text-gray-200 placeholder:text-gray-600 focus:border-purple-500/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                            <FiHash className="w-3.5 h-3.5 text-pink-400" />
                            Number of Comments
                          </Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min={3}
                              max={10}
                              value={numComments}
                              onChange={(e) => setNumComments(parseInt(e.target.value))}
                              className="flex-1 h-2 bg-[#2a2a3a] rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                            <span className="text-sm font-semibold text-purple-300 w-6 text-center">{numComments}</span>
                          </div>
                        </div>
                      </div>

                      {/* Brand Message */}
                      <div className="space-y-2">
                        <Label className="text-gray-300 text-sm flex items-center gap-1.5">
                          <HiOutlineLightBulb className="w-3.5 h-3.5 text-yellow-400" />
                          Brand Message / Product Description
                        </Label>
                        <Textarea
                          value={brandMessage}
                          onChange={(e) => setBrandMessage(e.target.value)}
                          placeholder="Describe your product, brand positioning, or the key message you want to convey through comments..."
                          className="bg-[#0a0a0f] border-[#2a2a3a] text-gray-200 placeholder:text-gray-600 focus:border-purple-500/50 min-h-[100px]"
                        />
                      </div>

                      {/* Comment Styles */}
                      <div className="space-y-2">
                        <Label className="text-gray-300 text-sm">Comment Styles</Label>
                        <div className="flex flex-wrap gap-2">
                          {['humorous', 'informative', 'relatable', 'question-based', 'story-based'].map(style => (
                            <button
                              key={style}
                              onClick={() => handleStyleToggle(style)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${commentStyles.includes(style) ? getStyleColor(style) : 'bg-[#0a0a0f] border-[#2a2a3a] text-gray-500 hover:text-gray-300 hover:border-gray-600'}`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quick Action Chips */}
                      <div className="space-y-2">
                        <Label className="text-gray-300 text-sm">Quick Start Topics</Label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: 'Trending Tech', value: 'Latest trending technology product review video' },
                            { label: 'Fitness Viral', value: 'Viral fitness transformation and workout routine video' },
                            { label: 'Food Review', value: 'Popular food review and restaurant recommendation video' },
                            { label: 'Finance Tips', value: 'Personal finance and investment tips video going viral' },
                          ].map(chip => (
                            <button
                              key={chip.label}
                              onClick={() => handleQuickAction(chip.value)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-[#0a0a0f] border border-[#2a2a3a] text-gray-400 hover:text-purple-300 hover:border-purple-500/30 transition-all"
                            >
                              <FiTrendingUp className="w-3 h-3" />
                              {chip.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="relative flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm border-0 shadow-lg shadow-purple-500/20 transition-all"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <FiRefreshCw className="w-4 h-4 animate-spin" />
                            Analyzing...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <HiOutlineSparkles className="w-4 h-4" />
                            Analyze &amp; Generate Comments
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Error Display */}
                  {error && (
                    <Card className="bg-red-500/10 border-red-500/30">
                      <CardContent className="p-4 flex items-start gap-3">
                        <FiAlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-red-300">{error}</p>
                          <Button
                            onClick={() => { setError(null); handleAnalyze(); }}
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 p-0 h-auto"
                          >
                            <FiRefreshCw className="w-3 h-3 mr-1" /> Retry
                          </Button>
                        </div>
                        <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
                          <FiX className="w-4 h-4" />
                        </button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Loading State */}
                  {loading && <AnalysisSkeleton />}
                </TabsContent>

                {/* === RESULTS TAB === */}
                <TabsContent value="results" className="space-y-6">
                  {!hasResults && !loading ? (
                    <Card className="bg-[#16161f] border-[#2a2a3a]">
                      <CardContent className="p-12 text-center">
                        <FiBarChart2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-400 mb-2">No Results Yet</h3>
                        <p className="text-sm text-gray-500 mb-4">Run an analysis from the Analyze tab to see results here</p>
                        <Button
                          onClick={() => setActiveTab('analyze')}
                          variant="outline"
                          className="border-purple-500/30 text-purple-300 hover:bg-purple-600/10"
                        >
                          Go to Analyze
                        </Button>
                      </CardContent>
                    </Card>
                  ) : hasResults ? (
                    <>
                      {/* Analysis Overview */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Viral Score Card */}
                        <Card className={`bg-gradient-to-br ${getViralScoreBg(analysis?.viral_score ?? 0)} border`}>
                          <CardContent className="p-6 flex items-center gap-5">
                            <ViralScoreRing score={analysis?.viral_score ?? 0} />
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Viral Score</p>
                              <p className={`text-2xl font-bold ${getViralScoreColor(analysis?.viral_score ?? 0)}`}>
                                {(analysis?.viral_score ?? 0) >= 7 ? 'High Potential' : (analysis?.viral_score ?? 0) >= 4 ? 'Moderate' : 'Low Potential'}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">{analysis?.engagement_window ?? ''}</p>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Topic & Platform */}
                        <Card className="bg-[#16161f] border-[#2a2a3a]">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                                <BiVideoRecording className="w-4 h-4 text-purple-400" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Video Topic</p>
                                <p className="text-sm font-medium text-gray-200 leading-relaxed">{analysis?.video_topic ?? 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <Badge className={`text-[11px] ${analysis?.platform?.toLowerCase() === 'youtube' ? 'bg-red-500/20 text-red-300 border-red-500/30' : analysis?.platform?.toLowerCase() === 'tiktok' ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' : 'bg-purple-500/20 text-purple-300 border-purple-500/30'} border`}>
                                {analysis?.platform?.toLowerCase() === 'youtube' ? <RiYoutubeLine className="w-3 h-3 mr-1" /> : analysis?.platform?.toLowerCase() === 'tiktok' ? <RiTiktokLine className="w-3 h-3 mr-1" /> : <FiPlay className="w-3 h-3 mr-1" />}
                                {analysis?.platform ?? 'N/A'}
                              </Badge>
                              {analysis?.trend_category && (
                                <Badge className="text-[11px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                  {analysis.trend_category}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Audience & Trend */}
                        <Card className="bg-[#16161f] border-[#2a2a3a]">
                          <CardContent className="p-6 space-y-4">
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <FiEye className="w-3 h-3" /> Audience
                              </p>
                              <p className="text-sm text-gray-200">{analysis?.audience_type ?? 'N/A'}</p>
                            </div>
                            <Separator className="bg-[#2a2a3a]" />
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <FiTrendingUp className="w-3 h-3" /> Trend Direction
                              </p>
                              <div className="flex items-center gap-2">
                                {getTrendIcon(trendInsights?.trend_direction)}
                                <span className={`text-sm font-medium ${getTrendColor(trendInsights?.trend_direction)}`}>
                                  {trendInsights?.trend_direction ?? 'N/A'}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Trend Insights */}
                      <Card className="bg-[#16161f] border-[#2a2a3a]">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <FiTrendingUp className="w-4 h-4 text-cyan-400" />
                            Trend Insights
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Opportunity Score */}
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a]">
                              <ViralScoreRing score={trendInsights?.opportunity_score ?? 0} size={80} />
                              <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Opportunity</p>
                                <p className={`text-lg font-bold ${getViralScoreColor(trendInsights?.opportunity_score ?? 0)}`}>
                                  {trendInsights?.opportunity_score ?? 0}/10
                                </p>
                              </div>
                            </div>

                            {/* Predicted Peak */}
                            <div className="p-4 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a]">
                              <div className="flex items-center gap-2 mb-2">
                                <FiClock className="w-3.5 h-3.5 text-yellow-400" />
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Predicted Peak</p>
                              </div>
                              <p className="text-sm text-gray-200">{trendInsights?.predicted_peak ?? 'N/A'}</p>
                            </div>

                            {/* Related Trends */}
                            <div className="p-4 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a]">
                              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Related Trends</p>
                              <div className="flex flex-wrap gap-1.5">
                                {relatedTrends.length > 0 ? relatedTrends.map((trend, i) => (
                                  <Badge key={i} className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                    {trend}
                                  </Badge>
                                )) : (
                                  <span className="text-xs text-gray-500">No related trends</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Quick Comments Preview */}
                      <Card className="bg-[#16161f] border-[#2a2a3a]">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                              <FiMessageSquare className="w-4 h-4 text-pink-400" />
                              Generated Comments ({comments.length})
                            </CardTitle>
                            <Button
                              onClick={() => setActiveTab('comments')}
                              variant="ghost"
                              size="sm"
                              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                            >
                              View All <FiArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {comments.slice(0, 3).map((comment, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a]">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <Badge className={`text-[10px] border ${getStyleColor(comment?.style)}`}>
                                      {comment?.style ?? 'unknown'}
                                    </Badge>
                                    <span className="text-[10px] text-gray-500">Score: {comment?.naturalness_score ?? 0}/10</span>
                                  </div>
                                  <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">&ldquo;{comment?.text ?? ''}&rdquo;</p>
                                </div>
                                <button
                                  onClick={() => handleCopy(comment?.text ?? '', `preview-${i}`)}
                                  className="p-1.5 rounded hover:bg-white/5 text-gray-500 hover:text-white transition-colors shrink-0"
                                >
                                  {copiedId === `preview-${i}` ? <FiCheck className="w-3.5 h-3.5 text-emerald-400" /> : <FiCopy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : null}

                  {loading && <AnalysisSkeleton />}
                </TabsContent>

                {/* === COMMENTS TAB === */}
                <TabsContent value="comments" className="space-y-6">
                  {!hasResults && !loading ? (
                    <Card className="bg-[#16161f] border-[#2a2a3a]">
                      <CardContent className="p-12 text-center">
                        <FiMessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-400 mb-2">No Comments Generated</h3>
                        <p className="text-sm text-gray-500 mb-4">Run an analysis first to generate marketing comments</p>
                        <Button
                          onClick={() => setActiveTab('analyze')}
                          variant="outline"
                          className="border-purple-500/30 text-purple-300 hover:bg-purple-600/10"
                        >
                          <FiSearch className="w-3.5 h-3.5 mr-1.5" /> Start Analysis
                        </Button>
                      </CardContent>
                    </Card>
                  ) : hasResults ? (
                    <>
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                          <FiMessageSquare className="w-5 h-5 text-pink-400" />
                          Generated Comments
                          <Badge className="text-[11px] bg-purple-500/20 text-purple-300 border border-purple-500/30">{comments.length}</Badge>
                        </h2>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => {
                              const allText = comments.map((c, i) => `${i + 1}. [${c?.style ?? ''}] ${c?.text ?? ''}`).join('\n\n')
                              handleCopy(allText, 'all-comments')
                            }}
                            variant="outline"
                            size="sm"
                            className="border-[#2a2a3a] text-gray-400 hover:text-white hover:bg-white/5"
                          >
                            {copiedId === 'all-comments' ? <FiCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <FiCopy className="w-3.5 h-3.5 mr-1" />}
                            {copiedId === 'all-comments' ? 'Copied!' : 'Copy All'}
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {comments.map((comment, i) => (
                          <CommentCard
                            key={i}
                            comment={comment}
                            index={i}
                            onCopy={handleCopy}
                            onSave={handleSaveComment}
                            copiedId={copiedId}
                          />
                        ))}
                      </div>
                    </>
                  ) : null}

                  {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map(i => (
                        <Card key={i} className="bg-[#16161f] border-[#2a2a3a]">
                          <CardContent className="p-5 space-y-3">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-5 w-20 bg-[#2a2a3a]" />
                              <Skeleton className="h-4 w-8 bg-[#2a2a3a]" />
                            </div>
                            <Skeleton className="h-20 w-full bg-[#2a2a3a]" />
                            <Skeleton className="h-3 w-40 bg-[#2a2a3a]" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* === STRATEGY TAB === */}
                <TabsContent value="strategy" className="space-y-6">
                  {!hasResults && !loading ? (
                    <Card className="bg-[#16161f] border-[#2a2a3a]">
                      <CardContent className="p-12 text-center">
                        <FiTarget className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-400 mb-2">No Strategy Available</h3>
                        <p className="text-sm text-gray-500 mb-4">Run an analysis to get posting strategy and tips</p>
                        <Button
                          onClick={() => setActiveTab('analyze')}
                          variant="outline"
                          className="border-purple-500/30 text-purple-300 hover:bg-purple-600/10"
                        >
                          <FiSearch className="w-3.5 h-3.5 mr-1.5" /> Start Analysis
                        </Button>
                      </CardContent>
                    </Card>
                  ) : hasResults ? (
                    <>
                      {/* Best Posting Time */}
                      <Card className="bg-gradient-to-br from-[#16161f] to-[#111118] border-[#2a2a3a]">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center shrink-0 border border-cyan-500/20">
                              <FiClock className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Best Posting Time</p>
                              <p className="text-lg font-semibold text-gray-100">{strategy?.best_posting_time ?? 'N/A'}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Hashtags */}
                      <Card className="bg-[#16161f] border-[#2a2a3a]">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <FiHash className="w-4 h-4 text-pink-400" />
                            Recommended Hashtags
                          </CardTitle>
                          <CardDescription className="text-gray-400 text-xs">Click to copy</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {hashtags.length > 0 ? hashtags.map((tag, i) => (
                              <button
                                key={i}
                                onClick={() => handleCopyHashtag(tag)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-300 hover:border-purple-400/40 hover:from-purple-500/20 hover:to-pink-500/20 transition-all"
                              >
                                <FiHash className="w-3 h-3" />
                                {tag.replace('#', '')}
                                {copiedHashtag === tag && <FiCheck className="w-3 h-3 text-emerald-400 ml-0.5" />}
                              </button>
                            )) : (
                              <span className="text-sm text-gray-500">No hashtags available</span>
                            )}
                          </div>
                          {hashtags.length > 0 && (
                            <Button
                              onClick={() => handleCopy(hashtags.join(' '), 'all-hashtags')}
                              variant="ghost"
                              size="sm"
                              className="mt-3 text-xs text-gray-400 hover:text-purple-300 hover:bg-purple-500/10"
                            >
                              {copiedId === 'all-hashtags' ? <><FiCheck className="w-3 h-3 mr-1 text-emerald-400" /> Copied!</> : <><FiCopy className="w-3 h-3 mr-1" /> Copy all hashtags</>}
                            </Button>
                          )}
                        </CardContent>
                      </Card>

                      {/* Engagement Tips */}
                      <Card className="bg-[#16161f] border-[#2a2a3a]">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <HiOutlineLightBulb className="w-4 h-4 text-yellow-400" />
                            Engagement Tips
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {tips.length > 0 ? tips.map((tip, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] hover:border-yellow-500/20 transition-colors">
                                <div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                  <span className="text-xs font-semibold text-yellow-400">{i + 1}</span>
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed">{tip}</p>
                              </div>
                            )) : (
                              <p className="text-sm text-gray-500">No tips available</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* A/B Test Suggestions */}
                      <Card className="bg-[#16161f] border-[#2a2a3a]">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <FiBarChart2 className="w-4 h-4 text-emerald-400" />
                            A/B Test Suggestions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {abTests.length > 0 ? abTests.map((test, i) => (
                              <div key={i} className="p-4 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] hover:border-emerald-500/20 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-emerald-400">{String.fromCharCode(65 + i)}</span>
                                  </div>
                                  <span className="text-[11px] text-gray-500 uppercase tracking-wider">Test {i + 1}</span>
                                </div>
                                <p className="text-sm text-gray-300">{test}</p>
                              </div>
                            )) : (
                              <p className="text-sm text-gray-500">No A/B test suggestions available</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : null}

                  {loading && (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <Card key={i} className="bg-[#16161f] border-[#2a2a3a]">
                          <CardContent className="p-6 space-y-3">
                            <Skeleton className="h-5 w-32 bg-[#2a2a3a]" />
                            <Skeleton className="h-4 w-full bg-[#2a2a3a]" />
                            <Skeleton className="h-4 w-3/4 bg-[#2a2a3a]" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* === DASHBOARD TAB === */}
                <TabsContent value="dashboard" className="space-y-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-[#16161f] border-[#2a2a3a]">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400 uppercase tracking-wider">Analyses</span>
                          <FiBarChart2 className="w-4 h-4 text-purple-400" />
                        </div>
                        <p className="text-2xl font-bold text-gray-100">{totalAnalyses}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-[#16161f] border-[#2a2a3a]">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400 uppercase tracking-wider">Comments</span>
                          <FiMessageSquare className="w-4 h-4 text-pink-400" />
                        </div>
                        <p className="text-2xl font-bold text-gray-100">{totalComments}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-[#16161f] border-[#2a2a3a]">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400 uppercase tracking-wider">Viral Score</span>
                          <FiTrendingUp className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className={`text-2xl font-bold ${getViralScoreColor(avgViralScore)}`}>{avgViralScore || '-'}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-[#16161f] border-[#2a2a3a]">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400 uppercase tracking-wider">Saved</span>
                          <FiBookmark className="w-4 h-4 text-cyan-400" />
                        </div>
                        <p className="text-2xl font-bold text-gray-100">{savedCount}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Analyses */}
                  <Card className="bg-[#16161f] border-[#2a2a3a]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FiClock className="w-4 h-4 text-gray-400" />
                        Recent Analyses
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analysisHistory.length > 0 ? (
                        <ScrollArea className="max-h-[320px]">
                          <div className="space-y-2">
                            {analysisHistory.map(entry => (
                              <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] hover:border-purple-500/20 transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${entry.platform === 'youtube' ? 'bg-red-500/10' : entry.platform === 'tiktok' ? 'bg-gray-500/10' : 'bg-purple-500/10'}`}>
                                    {entry.platform === 'youtube' ? <RiYoutubeLine className="w-4 h-4 text-red-400" /> : entry.platform === 'tiktok' ? <RiTiktokLine className="w-4 h-4 text-gray-400" /> : <FiPlay className="w-3.5 h-3.5 text-purple-400" />}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm text-gray-200 truncate">{entry.topic}</p>
                                    <p className="text-xs text-gray-500">{entry.timestamp} {entry.brandName !== 'N/A' ? `- ${entry.brandName}` : ''}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                  <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getViralScoreColor(entry.viralScore)} bg-white/5`}>
                                    {entry.viralScore}/10
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="text-center py-8">
                          <FiClock className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                          <p className="text-sm text-gray-500">No analyses yet. Run your first analysis!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Saved Comments */}
                  <Card className="bg-[#16161f] border-[#2a2a3a]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FiBookmark className="w-4 h-4 text-purple-400" />
                        Saved Comments ({savedComments.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {savedComments.length > 0 ? (
                        <ScrollArea className="max-h-[320px]">
                          <div className="space-y-2">
                            {savedComments.map(sc => (
                              <div key={sc.id} className="flex items-start gap-3 p-3 rounded-lg bg-[#0a0a0f] border border-[#2a2a3a] group">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge className={`text-[10px] border ${getStyleColor(sc.style)}`}>{sc.style}</Badge>
                                    <span className="text-[10px] text-gray-500">{sc.savedAt}</span>
                                  </div>
                                  <p className="text-sm text-gray-300 line-clamp-2">&ldquo;{sc.text}&rdquo;</p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleCopy(sc.text, `saved-${sc.id}`)}
                                    className="p-1.5 rounded hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                                  >
                                    {copiedId === `saved-${sc.id}` ? <FiCheck className="w-3.5 h-3.5 text-emerald-400" /> : <FiCopy className="w-3.5 h-3.5" />}
                                  </button>
                                  <button
                                    onClick={() => handleRemoveSaved(sc.id)}
                                    className="p-1.5 rounded hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                                  >
                                    <FiTrash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="text-center py-8">
                          <FiBookmark className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                          <p className="text-sm text-gray-500">Save comments from your analyses to find them here</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="bg-[#16161f] border-[#2a2a3a]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FiZap className="w-4 h-4 text-yellow-400" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Button
                          onClick={() => setActiveTab('analyze')}
                          variant="outline"
                          className="h-auto py-4 flex flex-col items-center gap-2 border-[#2a2a3a] bg-[#0a0a0f] hover:border-purple-500/30 hover:bg-purple-500/5 text-gray-300"
                        >
                          <FiSearch className="w-5 h-5 text-purple-400" />
                          <span className="text-xs">New Analysis</span>
                        </Button>
                        <Button
                          onClick={() => setActiveTab('comments')}
                          variant="outline"
                          className="h-auto py-4 flex flex-col items-center gap-2 border-[#2a2a3a] bg-[#0a0a0f] hover:border-pink-500/30 hover:bg-pink-500/5 text-gray-300"
                        >
                          <FiMessageSquare className="w-5 h-5 text-pink-400" />
                          <span className="text-xs">View Comments</span>
                        </Button>
                        <Button
                          onClick={() => setActiveTab('strategy')}
                          variant="outline"
                          className="h-auto py-4 flex flex-col items-center gap-2 border-[#2a2a3a] bg-[#0a0a0f] hover:border-cyan-500/30 hover:bg-cyan-500/5 text-gray-300"
                        >
                          <FiTarget className="w-5 h-5 text-cyan-400" />
                          <span className="text-xs">View Strategy</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <aside className={`w-72 shrink-0 space-y-4 ${showSidebar ? 'fixed inset-y-0 right-0 z-50 bg-[#0a0a0f] p-4 pt-20 border-l border-[#2a2a3a] overflow-y-auto' : 'hidden lg:block'}`}>
              {showSidebar && (
                <button
                  onClick={() => setShowSidebar(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 text-gray-400"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}

              {/* Saved Comments Sidebar */}
              <Card className="bg-[#16161f] border-[#2a2a3a]">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <FiBookmark className="w-3.5 h-3.5 text-purple-400" />
                    Saved ({savedComments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  {savedComments.length > 0 ? (
                    <ScrollArea className="max-h-[200px]">
                      <div className="space-y-2">
                        {savedComments.slice(0, 5).map(sc => (
                          <div key={sc.id} className="p-2 rounded bg-[#0a0a0f] border border-[#2a2a3a]">
                            <p className="text-[11px] text-gray-400 line-clamp-2">&ldquo;{sc.text}&rdquo;</p>
                            <div className="flex items-center justify-between mt-1">
                              <Badge className={`text-[9px] border ${getStyleColor(sc.style)}`}>{sc.style}</Badge>
                              <button
                                onClick={() => handleCopy(sc.text, `side-${sc.id}`)}
                                className="p-1 rounded hover:bg-white/5 text-gray-500"
                              >
                                {copiedId === `side-${sc.id}` ? <FiCheck className="w-3 h-3 text-emerald-400" /> : <FiCopy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-3">No saved comments yet</p>
                  )}
                </CardContent>
              </Card>

              {/* History Sidebar */}
              <Card className="bg-[#16161f] border-[#2a2a3a]">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <FiClock className="w-3.5 h-3.5 text-gray-400" />
                    History ({analysisHistory.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  {analysisHistory.length > 0 ? (
                    <ScrollArea className="max-h-[200px]">
                      <div className="space-y-2">
                        {analysisHistory.slice(0, 5).map(entry => (
                          <div key={entry.id} className="p-2 rounded bg-[#0a0a0f] border border-[#2a2a3a]">
                            <p className="text-[11px] text-gray-300 truncate">{entry.topic}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[10px] text-gray-500">{entry.timestamp}</span>
                              <span className={`text-[10px] font-medium ${getViralScoreColor(entry.viralScore)}`}>{entry.viralScore}/10</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-3">No history yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Agent Status */}
              <Card className="bg-[#16161f] border-[#2a2a3a]">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <FiSettings className="w-3.5 h-3.5 text-gray-400" />
                    Agent
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${activeAgentId ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-300 truncate">{AGENT_NAME}</p>
                      <p className="text-[10px] text-gray-500 font-mono truncate">{AGENT_ID}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-[10px] text-gray-500">Status:</span>
                    <span className={`text-[10px] font-medium ${activeAgentId ? 'text-emerald-400' : 'text-gray-400'}`}>
                      {activeAgentId ? 'Processing...' : 'Idle'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#2a2a3a] mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <FiZap className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs text-gray-500">RUMORA AI Viral Marketing Intelligence</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${activeAgentId ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
                  <span className="text-[11px] text-gray-500">{activeAgentId ? 'Agent Active' : 'Agent Ready'}</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}
