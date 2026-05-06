"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AlertState {
  type: "kamus" | "standar" | "scenario" | null;
  message: string;
}

export default function MasterDataSetupPage() {
  const [alert, setAlert] = useState<AlertState>({ type: null, message: "" });
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubmitKamus = async () => {
    setLoading("kamus");
    setAlert({ type: null, message: "" });
    try {
      const res = await fetch("/api/kamus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Kamus-${Date.now()}`,
          template: "default",
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit kamus");
      }
      setAlert({ type: "kamus", message: "Kamus Submitted Successfully" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit kamus";
      setAlert({ type: null, message: message });
    } finally {
      setLoading(null);
    }
  };

  const handleSubmitStandar = async () => {
    setLoading("standar");
    setAlert({ type: null, message: "" });
    try {
      const res = await fetch("/api/standar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Standar-${Date.now()}`,
          content: "default",
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit standar");
      }
      setAlert({ type: "standar", message: "Standar Submitted Successfully" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit standar";
      setAlert({ type: null, message: message });
    } finally {
      setLoading(null);
    }
  };

  const handleSubmitScenario = async () => {
    setLoading("scenario");
    setAlert({ type: null, message: "" });
    try {
      const res = await fetch("/api/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Scenario-${Date.now()}`,
          content: "default",
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit scenario");
      }
      setAlert({ type: "scenario", message: "Scenario Submitted Successfully" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit scenario";
      setAlert({ type: null, message: message });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 data-testid="master-data-page-nav" className="text-2xl font-bold text-foreground">
            Master Data Setup
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage foundational data structures including dictionaries, job standards, and scenarios.
          </p>
        </div>
      </div>
      <Separator />

      {alert.type === "kamus" && (
        <Alert data-testid="kamus-submitted-alert">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {alert.type === "standar" && (
        <Alert data-testid="standar-submitted-alert">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {alert.type === "scenario" && (
        <Alert data-testid="scenario-submitted-alert">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Kamus</CardTitle>
            <CardDescription>
              Submit dictionary configurations using a template.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              data-testid="submit-kamus-btn"
              onClick={handleSubmitKamus}
              disabled={loading === "kamus"}
            >
              {loading === "kamus" ? "Submitting..." : "Submit Kamus"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Standar</CardTitle>
            <CardDescription>
              Submit organizational job standards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              data-testid="submit-standar-btn"
              onClick={handleSubmitStandar}
              disabled={loading === "standar"}
            >
              {loading === "standar" ? "Submitting..." : "Submit Standar"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scenario</CardTitle>
            <CardDescription>
              Submit scenarios for execution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              data-testid="submit-scenario-btn"
              onClick={handleSubmitScenario}
              disabled={loading === "scenario"}
            >
              {loading === "scenario" ? "Submitting..." : "Submit Scenario"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
