import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const invitations = await prisma.invitation.findMany({
      orderBy: { createdAt: "desc" },
      include: { project: true },
    });
    return NextResponse.json(invitations);
  } catch (error) {
    console.error("[API] GET /api/project-management/invitations failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, emails } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing required field: projectId" },
        { status: 400 }
      );
    }

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: "At least one email is required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 400 }
      );
    }

    // 7-day expiration policy
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitations = await Promise.all(
      emails.map((email: string) =>
        prisma.invitation.create({
          data: {
            projectId,
            email: email.trim(),
            expiresAt,
          },
        })
      )
    );

    return NextResponse.json(
      { invitations, expiresAt: expiresAt.toISOString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] POST /api/project-management/invitations failed:", error);
    return NextResponse.json(
      { error: "Failed to send invitations" },
      { status: 500 }
    );
  }
}
