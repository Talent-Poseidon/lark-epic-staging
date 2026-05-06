import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const assignments = await prisma.assessorAssignment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        project: true,
        assessor: { select: { id: true, name: true, email: true } },
      },
    });
    return NextResponse.json(assignments);
  } catch (error) {
    console.error("[API] GET /api/project-management/assessor failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch assessor assignments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, assessorId } = body;

    if (!projectId || !assessorId) {
      return NextResponse.json(
        { error: "Missing required fields: projectId and assessorId" },
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

    const assessor = await prisma.user.findUnique({
      where: { id: assessorId },
    });
    if (!assessor) {
      return NextResponse.json(
        { error: "Assessor user not found" },
        { status: 400 }
      );
    }

    const assignment = await prisma.assessorAssignment.upsert({
      where: {
        projectId_assessorId: { projectId, assessorId },
      },
      update: {},
      create: { projectId, assessorId },
    });

    // Create notification for the assessor
    await prisma.notification.create({
      data: {
        userId: assessorId,
        type: "assessor_assigned",
        message: `You have been assigned as assessor for project "${project.name}"`,
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/project-management/assessor failed:", error);
    return NextResponse.json(
      { error: "Failed to assign assessor" },
      { status: 500 }
    );
  }
}
