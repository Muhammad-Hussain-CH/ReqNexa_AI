"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Zap,
  Brain,
  Lock,
  Mail,
  Linkedin,
  Twitter,
  ArrowRight,
  Sparkles,
  MessageCircle,
  ChevronDown,
  Users,
  TrendingUp,
  Shield,
  Rocket,
} from "lucide-react"

export default function Home() {
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  }

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  }

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
    },
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <header className="sticky top-0 z-50 border-b border-slate-800/30 bg-slate-950/80 backdrop-blur-xl px-4 py-4 md:px-6 md:py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold text-lg shadow-lg shadow-blue-500/50"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              R
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              ReqNexa
            </span>
          </motion.div>
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="outline"
              onClick={() => setIsSigningUp(false)}
              className="text-sm border-slate-700 hover:bg-slate-800/50 hover:border-blue-500/50 transition"
            >
              Sign In
            </Button>
            <Button
              onClick={() => setIsSigningUp(true)}
              className="text-sm bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/50"
            >
              Get Started
            </Button>
          </motion.div>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center px-4 py-20 md:py-32 relative">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"
            animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          className="mx-auto w-full max-w-4xl text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="mb-6 inline-flex items-center rounded-full border border-blue-500/50 bg-blue-500/10 px-4 py-2 backdrop-blur-md"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              className="mr-2 flex h-2 w-2 rounded-full bg-blue-400"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Powered by Advanced AI
            </span>
          </motion.div>

          <motion.h1
            className="mb-6 text-5xl md:text-7xl font-bold tracking-tight text-white text-balance leading-tight"
            variants={itemVariants}
          >
            Chat with Intelligent
            <motion.span
              className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            >
              AI Instantly
            </motion.span>
          </motion.h1>

          <motion.p
            className="mb-10 text-lg md:text-xl text-slate-300 text-balance max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Experience cutting-edge conversational AI. Get instant answers, creative solutions, and intelligent insights
            tailored to your unique needs.
          </motion.p>

          <motion.div
            className="mx-auto max-w-md rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-xl p-8 shadow-2xl"
            variants={itemVariants}
            whileHover={{ borderColor: "rgba(59, 130, 246, 0.3)" }}
          >
            {isSigningUp ? (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-400" />
                    Create Account
                  </h2>
                  <p className="text-sm text-slate-400 mt-2">Join thousands using ReqNexa</p>
                </div>

                <motion.input
                  type="email"
                  placeholder="Email address"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition"
                  whileFocus={{ scale: 1.02 }}
                />

                <motion.input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition"
                  whileFocus={{ scale: 1.02 }}
                />

                <Link href="/dashboard" className="block">
                  <motion.button
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create Account & Continue
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </Link>

                <motion.button
                  onClick={() => setIsSigningUp(false)}
                  className="w-full text-sm text-blue-400 hover:text-blue-300 transition font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  Already have an account? Sign in
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-cyan-400" />
                    Welcome Back
                  </h2>
                  <p className="text-sm text-slate-400 mt-2">Sign in to your ReqNexa account</p>
                </div>

                <motion.input
                  type="email"
                  placeholder="Email address"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition"
                  whileFocus={{ scale: 1.02 }}
                />

                <motion.input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition"
                  whileFocus={{ scale: 1.02 }}
                />

                <Link href="/dashboard" className="block">
                  <motion.button
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In & Continue
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </Link>

                <motion.button
                  onClick={() => setIsSigningUp(true)}
                  className="w-full text-sm text-blue-400 hover:text-blue-300 transition font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  Don't have an account? Sign up
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          <motion.div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3" variants={containerVariants}>
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Get instant responses with zero latency", color: "blue" },
              { icon: Brain, title: "Intelligent AI", desc: "Powered by advanced deep learning models", color: "cyan" },
              { icon: Lock, title: "Secure & Private", desc: "End-to-end encrypted conversations", color: "green" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="rounded-xl border border-slate-700/50 bg-slate-900/20 backdrop-blur-sm p-6 hover:border-blue-500/30 transition group"
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  borderColor: "rgba(59, 130, 246, 0.3)",
                  backgroundColor: "rgba(15, 23, 42, 0.4)",
                }}
              >
                <motion.div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${
                    feature.color === "blue"
                      ? "from-blue-500/20 to-blue-600/20"
                      : feature.color === "cyan"
                        ? "from-cyan-500/20 to-cyan-600/20"
                        : "from-green-500/20 to-green-600/20"
                  }`}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <feature.icon
                    className={`h-7 w-7 ${
                      feature.color === "blue"
                        ? "text-blue-400"
                        : feature.color === "cyan"
                          ? "text-cyan-400"
                          : "text-green-400"
                    }`}
                  />
                </motion.div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="relative py-20 md:py-32 px-4 bg-slate-900/50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        <div className="mx-auto max-w-7xl relative z-10">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 className="text-4xl md:text-5xl font-bold text-white mb-4" variants={itemVariants}>
              Trusted by Thousands Worldwide
            </motion.h2>
            <motion.p className="text-lg text-slate-300 max-w-2xl mx-auto" variants={itemVariants}>
              Join businesses and individuals transforming their workflow with ReqNexa
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { number: "50K+", label: "Active Users", icon: Users },
              { number: "10M+", label: "Messages Daily", icon: MessageCircle },
              { number: "99.9%", label: "Uptime", icon: Shield },
              { number: "200ms", label: "Avg Response Time", icon: TrendingUp },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm p-8 text-center"
                variants={statVariants}
                whileHover={{
                  y: -10,
                  borderColor: "rgba(59, 130, 246, 0.3)",
                  backgroundColor: "rgba(30, 41, 59, 0.5)",
                }}
              >
                <motion.div className="flex justify-center mb-4" whileHover={{ scale: 1.1, rotate: 10 }}>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                    <stat.icon className="h-8 w-8 text-blue-400" />
                  </div>
                </motion.div>
                <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
                  {stat.number}
                </h3>
                <p className="text-slate-300">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="relative py-20 md:py-32 px-4">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-20"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 className="text-4xl md:text-5xl font-bold text-white mb-4" variants={itemVariants}>
              How ReqNexa Works
            </motion.h2>
            <motion.p className="text-lg text-slate-300 max-w-2xl mx-auto" variants={itemVariants}>
              Three simple steps to harness the power of advanced AI
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                step: 1,
                title: "Sign Up in Seconds",
                desc: "Create your account with just your email. Get instant access to powerful AI features.",
                icon: Sparkles,
              },
              {
                step: 2,
                title: "Start Chatting",
                desc: "Begin conversations with our intelligent AI. Get instant answers to your questions.",
                icon: MessageCircle,
              },
              {
                step: 3,
                title: "Get Results",
                desc: "Receive accurate, helpful, and personalized responses. Save time and boost productivity.",
                icon: Zap,
              },
            ].map((item, idx) => (
              <motion.div key={idx} className="relative" variants={itemVariants}>
                <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm p-8 h-full">
                  <motion.div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold text-2xl mb-6 shadow-lg shadow-blue-500/50"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                  >
                    {item.step}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{item.desc}</p>
                </div>

                {idx < 2 && (
                  <motion.div
                    className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <ArrowRight className="h-8 w-8 text-blue-400" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* USE CASES SECTION */}
      <section className="relative py-20 md:py-32 px-4 bg-slate-900/50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        <div className="mx-auto max-w-7xl relative z-10">
          <motion.div
            className="text-center mb-20"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 className="text-4xl md:text-5xl font-bold text-white mb-4" variants={itemVariants}>
              Use Cases for Every Need
            </motion.h2>
            <motion.p className="text-lg text-slate-300 max-w-2xl mx-auto" variants={itemVariants}>
              Discover how ReqNexa transforms work across industries
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { title: "Content Creation", desc: "Generate engaging copy, articles, and creative content in minutes" },
              { title: "Learning & Research", desc: "Quickly research topics and get comprehensive explanations" },
              { title: "Code Assistance", desc: "Debug code, get suggestions, and accelerate development" },
              { title: "Business Analysis", desc: "Analyze data and generate actionable business insights" },
              { title: "Customer Support", desc: "Provide instant support with intelligent responses" },
              { title: "Personal Productivity", desc: "Organize tasks, plan projects, and boost efficiency" },
            ].map((useCase, idx) => (
              <motion.div
                key={idx}
                className="rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm p-6 hover:border-blue-500/30 transition group"
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  borderColor: "rgba(59, 130, 246, 0.3)",
                  backgroundColor: "rgba(30, 41, 59, 0.4)",
                }}
              >
                <motion.div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <Rocket className="h-6 w-6 text-blue-400" />
                </motion.div>
                <h3 className="font-semibold text-white mb-2 text-lg">{useCase.title}</h3>
                <p className="text-sm text-slate-400">{useCase.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="relative py-20 md:py-32 px-4">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-20"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 className="text-4xl md:text-5xl font-bold text-white mb-4" variants={itemVariants}>
              What Users Say
            </motion.h2>
            <motion.p className="text-lg text-slate-300 max-w-2xl mx-auto" variants={itemVariants}>
              Real stories from people transforming their work
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                name: "Sarah Johnson",
                role: "Content Creator",
                content:
                  "ReqNexa has cut my content creation time by 60%. The quality is exceptional and the responses are incredibly helpful.",
                avatar: "SJ",
              },
              {
                name: "Alex Chen",
                role: "Software Developer",
                content:
                  "The code suggestions are spot on. It's like having an expert developer sitting next to me. Absolutely game-changing.",
                avatar: "AC",
              },
              {
                name: "Emma Davis",
                role: "Business Analyst",
                content:
                  "The insights provided are comprehensive and actionable. It's transformed how our team approaches data analysis.",
                avatar: "ED",
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm p-8"
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  borderColor: "rgba(59, 130, 246, 0.3)",
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold"
                    whileHover={{ scale: 1.1 }}
                  >
                    {testimonial.avatar}
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="text-yellow-400"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      ★
                    </motion.div>
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed">{testimonial.content}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="relative py-20 md:py-32 px-4 bg-slate-900/50">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-20"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 className="text-4xl md:text-5xl font-bold text-white mb-4" variants={itemVariants}>
              Frequently Asked Questions
            </motion.h2>
            <motion.p className="text-lg text-slate-300" variants={itemVariants}>
              Have questions? We have answers
            </motion.p>
          </motion.div>

          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                q: "Is my data secure with ReqNexa?",
                a: "Yes, we use enterprise-grade encryption and follow industry-leading security standards. Your data is protected and never shared with third parties.",
              },
              {
                q: "Can I use ReqNexa offline?",
                a: "ReqNexa requires an internet connection to function. However, we're working on offline capabilities for future releases.",
              },
              {
                q: "What's the difference between plans?",
                a: "Free plan includes basic features, Pro plan adds advanced capabilities, and Enterprise offers custom solutions with dedicated support.",
              },
              {
                q: "How accurate is the AI?",
                a: "Our AI is trained on vast amounts of data and provides highly accurate responses. However, for critical decisions, always verify with official sources.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel your subscription at any time without penalties or questions asked.",
              },
              {
                q: "Is there an API available?",
                a: "Yes, ReqNexa offers a comprehensive API for developers. Check our documentation for integration details.",
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                className="rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm overflow-hidden"
                variants={itemVariants}
              >
                <motion.button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full px-8 py-5 flex items-center justify-between hover:bg-slate-700/20 transition"
                  whileHover={{ backgroundColor: "rgba(71, 85, 105, 0.1)" }}
                >
                  <span className="text-left font-semibold text-white text-lg">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === idx ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="h-5 w-5 text-blue-400" />
                  </motion.div>
                </motion.button>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: openFaq === idx ? "auto" : 0,
                    opacity: openFaq === idx ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-8 py-5 border-t border-slate-700/30 bg-slate-900/30">
                    <p className="text-slate-300 leading-relaxed">{faq.a}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-slate-800/50 bg-slate-950 px-4 py-16 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 mb-12">
            <motion.div
              className="md:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold shadow-lg shadow-blue-500/50">
                  R
                </div>
                <span className="text-lg font-bold text-white">ReqNexa</span>
              </div>
              <p className="text-sm text-slate-400">Experience the future of AI conversations today.</p>
            </motion.div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Security", "API Docs"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Cookie Policy", "License"],
              },
            ].map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold text-white mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <motion.a
                        href="#"
                        className="text-slate-400 hover:text-blue-400 transition text-sm"
                        whileHover={{ x: 5 }}
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-slate-800/50 my-8" />

          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-slate-500">© 2025 ReqNexa. All rights reserved.</p>

            <div className="flex items-center gap-4">
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Mail, label: "Email" },
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  className="text-slate-400 hover:text-blue-400 transition"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </footer>
    </main>
  )
}
