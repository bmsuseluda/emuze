import type { LoaderFunctionArgs } from "react-router";
import { log } from "../server/debug.server.js";
import { registerGamepadNavigationEvents } from "../server/gamepadNavigation.server.js";
import type { GamepadData } from "../types/gamepad.js";

export async function loader({ request }: LoaderFunctionArgs) {
  log("debug", "gamepadEvents", "Client connected to gamepad event stream");

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'));

      const sendEvent = (data: GamepadData) => {
        try {
          const eventData = JSON.stringify(data);
          log("debug", "gamepadEvents", eventData, controller.desiredSize);
          controller.enqueue(encoder.encode(`data: ${eventData}\n\n`));
        } catch (error) {
          log("error", "gamepadEvents", "Error encoding gamepad event:", error);
        }
      };

      registerGamepadNavigationEvents(sendEvent);
      const onDisconnect = () => {
        log(
          "debug",
          "gamepadEvents",
          "Client disconnected from gamepad event stream",
        );
      };

      request.signal.addEventListener("abort", onDisconnect);
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
