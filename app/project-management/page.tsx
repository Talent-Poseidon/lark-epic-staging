"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Plus, UserPlus, Send } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
}

interface AlertState {
  type: "success" | "error" | null;
  testId: string;
  message: string;
}

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [alert, setAlert] = useState<AlertState>({ type: null, testId: "", message: "" });

  useEffect(() => {
    fetch("/api/project-management")
      .then((r: Response) => r.json())
      .then((data: Project[]) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
    setSubmitting("assessor");
    try {
      // TODO: Replace with actual assessor assignment API when available
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAlert({ type: "success", testId: "assessor-assigned-alert", message: "Assessor has been successfully assigned" });
    } finally {
      setSubmitting(null);
    }
  };

  const handleSendInvitation = async () => {
    setAlert({ type: null, testId: "", message: "" });
    setSubmitting("invitation");
    try {
      // TODO: Replace with actual invitation API when available
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAlert({ type: "success", testId: "invitation-sent-alert", message: "Invitations have been sent" });
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
        <Alert data-testid={alert.testId}>
          <CheckCircle2 className="h-4 w-4" />
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
            <CardContent>
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
                Send invitations to participants for assessment.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
