import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can send notifications" }, { status: 403 });
    }

    const { message } = await request.json();
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Get all users in the organization except the sender
    const users = await prisma.user.findMany({
      where: {
        organizationId: session.user.organizationId,
        id: { not: session.user.id }
      },
      select: { id: true },
    });

    // Create notifications for all users
    const notifications = users.map((user) => ({
      message: message.trim(),
      senderId: session.user.id!,
      recipientId: user.id,
      organizationId: session.user.organizationId!,
    }));

    await prisma.notification.createMany({
      data: notifications,
    });

    return NextResponse.json({ success: true, message: "Notifications sent successfully" });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
