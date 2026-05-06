"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Plus, UserPlus, Send, AlertCircle } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
}

interface UserOption {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
}

interface AlertState {
  type: "success" | "error" | null;
  testId: string;
  message: string;
}

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedAssessorId, setSelectedAssessorId] = useState<string>("");
  const [invitationEmail, setInvitationEmail] = useState<string>("");
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [alert, setAlert] = useState<AlertState>({ type: null, testId: "", message: "" });

  useEffect(() => {
    Promise.all([
      fetch("/api/project-management").then((r: Response) => r.json()),
      fetch("/api/users").then((r: Response) => r.json()),
    ])
      .then(([projectData, userData]: [Project[], UserOption[]]) => {
        setProjects(projectData);
        setUsers(userData);
        if (projectData.length > 0) {
          setSelectedProjectId(projectData[0].id);
        }
        if (userData.length > 0) {
          setSelectedAssessorId(userData[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert({ type: null, testId: "", message: "" });

    if (!projectName.trim()) {
      setAlert({ type: "error", testId: "project-error-alert", message: "Project name is required" });
      return;
    }

    if (projectName.length > 100) {
      setAlert({ type: "error", testId: "project-error-alert", message: "Project name must be 100 characters or less" });
      return;
    }

    setSubmitting("create");
    try {
      const res = await fetch("/api/project-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName, description: projectDescription }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create project");
      }
      const created: Project = await res.json();
      setProjects((prev: Project[]) => [created, ...prev]);
      if (!selectedProjectId) {
        setSelectedProjectId(created.id);
      }
      setAlert({ type: "success", testId: "project-created-alert", message: "Project created successfully" });
      setProjectName("");
      setProjectDescription("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create project";
      setAlert({ type: "error", testId: "project-error-alert", message });
    } finally {
      setSubmitting(null);
    }
  };

  const handleAssignAssessor = async () => {
    setAlert({ type: null, testId: "", message: "" });

    const projectId = selectedProjectId || (projects.length > 0 ? projects[0].id : "");
    const assessorId = selectedAssessorId || (users.length > 0 ? users[0].id : "");

    if (!projectId) {
      setAlert({ type: "error", testId: "project-error-alert", message: "No project available to assign" });
      return;
    }

    if (!assessorId) {
      setAlert({ type: "error", testId: "project-error-alert", message: "No assessor available to assign" });
      return;
    }

    setSubmitting("assessor");
    try {
      const res = await fetch("/api/project-management/assessor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, assessorId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to assign assessor");
      }
      setAlert({ type: "success", testId: "assessor-assigned-alert", message: "Assessor has been successfully assigned" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to assign assessor";
      setAlert({ type: "error", testId: "project-error-alert", message });
    } finally {
      setSubmitting(null);
    }
  };

  const handleSendInvitation = async () => {
    setAlert({ type: null, testId: "", message: "" });

    const projectId = selectedProjectId || (projects.length > 0 ? projects[0].id : "");
    const email = invitationEmail.trim() || "participant@example.com";

    if (!projectId) {
      setAlert({ type: "error", testId: "project-error-alert", message: "No project available" });
      return;
    }

    setSubmitting("invitation");
    try {
      const res = await fetch("/api/project-management/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, emails: [email] }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send invitations");
      }
      setAlert({ type: "success", testId: "invitation-sent-alert", message: "Invitations have been sent" });
      setInvitationEmail("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send invitations";
      setAlert({ type: "error", testId: "project-error-alert", message });
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 data-testid="project-management-page-nav" className="text-2xl font-bold text-foreground">
            Project Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage assessment projects, assign assessors, and send invitations.
          </p>
        </div>
      </div>
      <Separator />

      {alert.type && (
        <Alert data-testid={alert.testId} variant={alert.type === "error" ? "destructive" : "default"}>
          {alert.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Project</CardTitle>
            <CardDescription>
              Fill in the details below to create a new assessment project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form data-testid="project-form" onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="project-name" className="text-sm font-medium">
                  Project Name
                </label>
                <Input
                  id="project-name"
                  data-testid="project-name-input"
                  name="projectName"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="project-description" className="text-sm font-medium">
                  Project Description
                </label>
                <Input
                  id="project-description"
                  data-testid="project-description-input"
                  name="projectDescription"
                  placeholder="Enter project description (optional)"
                  value={projectDescription}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectDescription(e.target.value)}
                  maxLength={500}
                />
              </div>
              <Button
                type="submit"
                data-testid="create-project-btn"
                disabled={submitting === "create"}
              >
                <Plus className="mr-2 h-4 w-4" />
                {submitting === "create" ? "Creating..." : "Create Project"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assign Assessor</CardTitle>
              <CardDescription>
                Assign an assessor to an existing project.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project</label>
                  <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project: Project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {users.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assessor</label>
                  <Select value={selectedAssessorId} onValueChange={setSelectedAssessorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an assessor" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user: UserOption) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name || user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button
                data-testid="assign-assessor-btn"
                onClick={handleAssignAssessor}
                disabled={submitting === "assessor"}
                variant="outline"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {submitting === "assessor" ? "Assigning..." : "Assign Assessor"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Send Invitation</CardTitle>
              <CardDescription>
                Send invitations to participants for assessment. Invitations expire in 7 days.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Participant Email</label>
                <Input
                  data-testid="invitation-email-input"
                  name="invitationEmail"
                  type="email"
                  placeholder="participant@example.com"
                  value={invitationEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInvitationEmail(e.target.value)}
                />
              </div>
              <Button
                data-testid="send-invitation-btn"
                onClick={handleSendInvitation}
                disabled={submitting === "invitation"}
                variant="outline"
              >
                <Send className="mr-2 h-4 w-4" />
                {submitting === "invitation" ? "Sending..." : "Send Invitation"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project List</CardTitle>
          <CardDescription>All created projects.</CardDescription>
        </CardHeader>
        <CardContent>
          <div data-testid="project-list-container">
            {loading ? (
              <p data-testid="project-list-loading" className="text-sm text-muted-foreground">
                Loading...
              </p>
            ) : projects.length > 0 ? (
              <ul data-testid="project-list" className="space-y-2">
                {projects.map((project: Project) => (
                  <li
                    key={project.id}
                    data-testid={`project-item-${project.id}`}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <p className="font-medium">{project.name}</p>
                      {project.description && (
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p data-testid="project-list-empty" className="text-sm text-muted-foreground">
                No projects yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
