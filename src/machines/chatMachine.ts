/**
 * chatMachine — Máquina de estados del chat KM0.
 *
 * Estados:
 *   - idle:        compositor visible, esperando input.
 *   - recording:   `VoiceRecorder` activo (Web Speech API).
 *   - sending:     petición al backend en vuelo (queryEvents).
 *   - error:       último envío falló; vuelve a `idle` al siguiente evento.
 *
 * El `context` guarda el texto pendiente y el último error legible.
 * La pantalla envía eventos (`SEND`, `START_RECORDING`, …) y el
 * `actor` resuelve transiciones + invoca `queryEvents` desde el actor
 * `sendQuery`. Las respuestas las recoge `Chat.tsx` vía `useSelector`
 * y se materializan en la lista de mensajes.
 */
import { assign, fromPromise, setup } from "xstate";
import { queryEvents, type Evento } from "@/services/eventQueryApi";

export interface ChatResult {
  text: string;
  eventos: Evento[];
}

export interface ChatContext {
  draft: string;
  postalCode: string;
  errorMessage: string | null;
}

export type ChatEvent =
  | { type: "SEND"; text: string }
  | { type: "START_RECORDING" }
  | { type: "CANCEL_RECORDING" }
  | { type: "TRANSCRIBED"; text: string }
  | { type: "RETRY" }
  | { type: "DISMISS_ERROR" };

export type ChatEmitted =
  | { type: "result"; result: ChatResult }
  | { type: "failed"; message: string };

export const chatMachine = setup({
  types: {
    context: {} as ChatContext,
    events: {} as ChatEvent,
    input: {} as { postalCode: string },
    emitted: {} as ChatEmitted,
  },
  actors: {
    sendQuery: fromPromise<ChatResult, { text: string; postalCode: string }>(
      async ({ input }) => {
        const data = await queryEvents(input.text, input.postalCode);
        return { text: data.respuesta_texto, eventos: data.eventos };
      },
    ),
  },
}).createMachine({
  id: "chat",
  initial: "idle",
  context: ({ input }) => ({
    draft: "",
    postalCode: input.postalCode,
    errorMessage: null,
  }),
  states: {
    idle: {
      on: {
        SEND: {
          target: "sending",
          guard: ({ event }) => event.text.trim().length > 0,
          actions: assign({ draft: ({ event }) => event.text.trim(), errorMessage: null }),
        },
        START_RECORDING: "recording",
      },
    },
    recording: {
      on: {
        CANCEL_RECORDING: "idle",
        TRANSCRIBED: {
          target: "idle",
          actions: assign({ draft: ({ event }) => event.text }),
        },
      },
    },
    sending: {
      invoke: {
        src: "sendQuery",
        input: ({ context }) => ({ text: context.draft, postalCode: context.postalCode }),
        onDone: {
          target: "idle",
          actions: [
            assign({ draft: "" }),
            ({ event, self }) => self.send({ type: "__noop" } as never) || undefined,
            // emite el resultado para que la UI lo añada a la lista
            ({ event }) => event,
            { type: "emitResult", params: ({ event }) => event.output } as never,
          ],
        },
        onError: {
          target: "error",
          actions: assign({
            errorMessage: () => "Lo siento, ha ocurrido un error al consultar los eventos. Inténtalo de nuevo.",
          }),
        },
      },
    },
    error: {
      on: {
        SEND: {
          target: "sending",
          guard: ({ event }) => event.text.trim().length > 0,
          actions: assign({ draft: ({ event }) => event.text.trim(), errorMessage: null }),
        },
        RETRY: { target: "sending" },
        DISMISS_ERROR: { target: "idle", actions: assign({ errorMessage: null }) },
        START_RECORDING: "recording",
      },
    },
  },
});
