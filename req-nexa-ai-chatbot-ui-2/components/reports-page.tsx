"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Download, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Report {
  id: string
  projectName: string
  type: "pdf" | "srs"
  generatedDate: string
  size: string
}

export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      projectName: "AI Customer Support",
      type: "pdf",
      generatedDate: "2024-01-15",
      size: "2.4 MB",
    },
    {
      id: "2",
      projectName: "Sales Assistant Bot",
      type: "srs",
      generatedDate: "2024-01-14",
      size: "1.2 MB",
    },
    {
      id: "3",
      projectName: "HR Chatbot",
      type: "pdf",
      generatedDate: "2024-01-13",
      size: "1.8 MB",
    },
  ])

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter((r) => r.id !== id))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold text-foreground">Reports</h2>
          <p className="mt-1 text-muted-foreground">View and download all generated project reports</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold text-foreground">{reports.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">PDF Reports</p>
                <p className="text-2xl font-bold text-foreground">{reports.filter((r) => r.type === "pdf").length}</p>
              </div>
              <Download className="h-8 w-8 text-cyan-500" />
            </div>
          </Card>
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">SRS Templates</p>
                <p className="text-2xl font-bold text-foreground">{reports.filter((r) => r.type === "srs").length}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </motion.div>

        {/* Reports List */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Generated Reports</h3>
          <div className="space-y-3">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="border-border bg-gradient-to-r from-slate-900/50 to-slate-800/50 hover:border-cyan-500/50 transition-all duration-300 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-3">
                        {report.type === "pdf" ? (
                          <Download className="h-6 w-6 text-blue-400" />
                        ) : (
                          <FileText className="h-6 w-6 text-purple-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{report.projectName}</h4>
                        <p className="text-xs text-muted-foreground">
                          {report.type.toUpperCase()} • {report.generatedDate} • {report.size}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 bg-transparent"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {reports.length === 0 && (
          <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No reports generated yet</p>
            <p className="text-sm text-muted-foreground">Generate your first report from the projects page</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
