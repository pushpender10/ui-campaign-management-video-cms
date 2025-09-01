import { db } from "@/lib/server/database";

export async function GET(_: Request, { params }: any) {
  const encoder = new TextEncoder();
  let isClosed = false;
  const stream = new ReadableStream<Uint8Array>({
    start: async (controller) => {
      async function send() {
        if (isClosed) return;
        const v = await db.video.findById(params.id);
        if (!v) {
          controller.enqueue(encoder.encode(`event: end\ndata: {"error":"not_found"}\n\n`));
          controller.close();
          return;
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: v.status, progressPercent: v.progressPercent })}\n\n`));
        if (v.status === "READY" || v.status === "FAILED") {
          controller.close();
          return;
        }
        setTimeout(send, 1500);
      }
      await send();
    },
    cancel: () => { isClosed = true; },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}


