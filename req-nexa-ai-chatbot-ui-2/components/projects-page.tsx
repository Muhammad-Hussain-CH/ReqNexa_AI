"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Zap, BarChart3, Users, Trash2, Edit2, ExternalLink, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ReportGenerator } from "./report-generator"

interface Project {
  id: string
  name: string
  description: string
  created: string
  status: "active" | "archived"
  messages: number
  users: number
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "AI Customer Support",
      description: "AI-powered chatbot for customer service inquiries",
      created: "2024-01-15",
      status: "active",
      messages: 1234,
      users: 45,
    },
    {
      id: "2",
      name: "Sales Assistant Bot",
      description: "Conversational AI for sales and lead generation",
      created: "2024-01-10",
      status: "active",
      messages: 892,
      users: 32,
    },
    {
      id: "3",
      name: "HR Chatbot",
      description: "HR support and employee onboarding bot",
      created: "2023-12-20",
      status: "archived",
      messages: 456,
      users: 20,
    },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [newProject, setNewProject] = useState({ name: "", description: "" })

  const handleCreateProject = () => {
    if (newProject.name.trim()) {
      setProjects([
        ...projects,
        {
          id: Date.now().toString(),
          name: newProject.name,
          description: newProject.description,
          created: new Date().toISOString().split("T")[0],
          status: "active",
          messages: 0,
          users: 0,
        },
      ])
      setNewProject({ name: "", description: "" })
      setIsOpen(false)
    }
  }

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id))
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
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Projects</h2>
            <p className="mt-1 text-muted-foreground">Manage and organize your AI chatbot projects</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Project Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter project name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="border-border bg-input text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter project description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="border-border bg-input text-foreground"
                  />
                </div>
                <Button onClick={handleCreateProject} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500">
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold text-foreground">{projects.length}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold text-foreground">
                  {projects.reduce((sum, p) => sum + p.messages, 0).toLocaleString()}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-cyan-500" />
            </div>
          </Card>
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-foreground">
                  {projects.reduce((sum, p) => sum + p.users, 0).toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </motion.div>

        {/* Projects Grid */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Your Projects</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="group border-border bg-gradient-to-br from-slate-900 to-slate-800 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    {/* Project Header */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-foreground">{project.name}</h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              project.status === "active"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="mb-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-blue-500/10 p-3">
                        <p className="text-xs text-muted-foreground">Messages</p>
                        <p className="text-lg font-bold text-blue-400">{project.messages.toLocaleString()}</p>
                      </div>
                      <div className="rounded-lg bg-purple-500/10 p-3">
                        <p className="text-xs text-muted-foreground">Users</p>
                        <p className="text-lg font-bold text-purple-400">{project.users}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Created {project.created}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <ReportGenerator
                        projectName={project.name}
                        projectDescription={project.description}
                        messageCount={project.messages}
                        userCount={project.users}
                        onClose={() => {}}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/10 bg-transparent"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                        onClick={() => handleDeleteProject(project.id)}
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

        {projects.length === 0 && (
          <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-16">
            <Folder className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No projects yet</p>
            <p className="text-sm text-muted-foreground">Create your first project to get started</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
