import type { LoaderFunctionArgs } from "react-router";
import { log } from "../server/debug.server.js";
import {
  closeGamepads,
  handleGamepadEvents,
} from "../server/gamepadEvent.server.js";
import type { GamepadData } from "../types/gamepad.js";

export async function loader({ request }: LoaderFunctionArgs) {
  log("debug", "gamepadEvents", "Client connected to gamepad event stream");

  // Create a readable stream for Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'));

      const sendEvent = (data: GamepadData) => {
        try {
          const eventData = JSON.stringify(data);
          controller.enqueue(encoder.encode(`data: ${eventData}\n\n`));
        } catch (error) {
          log("error", "gamepadEvents", "Error encoding gamepad event:", error);
        }
      };

      handleGamepadEvents(sendEvent);

      // Handle client disconnect
      const cleanup = () => {
        closeGamepads();
        log(
          "debug",
          "gamepadEvents",
          "Client disconnected from gamepad event stream",
        );
      };

      // Check for client disconnect
      request.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  });
}
