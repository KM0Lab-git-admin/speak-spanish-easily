/**
 * chatMachine — Máquina de estados del chat KM0.
 *
 * Estados:
 *   - idle / recording / sending / error
 *
 * El contexto guarda `lastResult` (cada respuesta exitosa) y
 * `lastError`. La UI hace `useSelector` sobre ellos y los materializa
 * en la lista de mensajes cuando cambian.
 */
import { assign, fromPromise, setup } from "xstate";
import { queryEvents, type Evento } from "@/services/eventQueryApi";

export interface ChatResult {
  /** id incremental para detectar cambios en la UI. */
  id: number;
  text: string;
  eventos: Evento[];
}

export interface ChatContext {
  draft: string;
  postalCode: string;
  lastResult: ChatResult | null;
  lastError: string | null;
  resultCounter: number;
}

export type ChatEvent =
  | { type: "SEND"; text: string }
  | { type: "START_RECORDING" }
  | { type: "CANCEL_RECORDING" }
  | { type: "TRANSCRIBED"; text: string }
  | { type: "RETRY" }
  | { type: "DISMISS_ERROR" };

export const chatMachine = setup({
  types: {
    context: {} as ChatContext,
    events: {} as ChatEvent,
    input: {} as { postalCode: string },
  },
  actors: {
    sendQuery: fromPromise<{ text: string; eventos: Evento[] }, { text: string; postalCode: string }>(
      async ({ input }) => {
        const data = await queryEvents(input.text, input.postalCode);
        return { text: data.respuesta_texto, eventos: data.eventos };
      },
    ),
  },
  guards: {
    hasText: ({ event }) => event.type === "SEND" && event.text.trim().length > 0,
  },
}).createMachine({
  id: "chat",
  initial: "idle",
  context: ({ input }) => ({
    draft: "",
    postalCode: input.postalCode,
    lastResult: null,
    lastError: null,
    resultCounter: 0,
  }),
  states: {
    idle: {
      on: {
        SEND: {
          target: "sending",
          guard: "hasText",
          actions: assign({
            draft: ({ event }) => (event.type === "SEND" ? event.text.trim() : ""),
            lastError: null,
          }),
        },
        START_RECORDING: "recording",
      },
    },
    recording: {
      on: {
        CANCEL_RECORDING: "idle",
        TRANSCRIBED: {
          target: "idle",
          actions: assign({
            draft: ({ event }) => (event.type === "TRANSCRIBED" ? event.text : ""),
          }),
        },
      },
    },
    sending: {
      invoke: {
        src: "sendQuery",
        input: ({ context }) => ({ text: context.draft, postalCode: context.postalCode }),
        onDone: {
          target: "idle",
          actions: assign(({ context, event }) => ({
            draft: "",
            resultCounter: context.resultCounter + 1,
            lastResult: {
              id: context.resultCounter + 1,
              text: event.output.text,
              eventos: event.output.eventos,
            },
          })),
        },
        onError: {
          target: "error",
          actions: assign({
            lastError: () =>
              "Lo siento, ha ocurrido un error al consultar los eventos. Inténtalo de nuevo.",
          }),
        },
      },
    },
    error: {
      on: {
        SEND: {
          target: "sending",
          guard: "hasText",
          actions: assign({
            draft: ({ event }) => (event.type === "SEND" ? event.text.trim() : ""),
            lastError: null,
          }),
        },
        RETRY: { target: "sending" },
        DISMISS_ERROR: { target: "idle", actions: assign({ lastError: null }) },
        START_RECORDING: "recording",
      },
    },
  },
});
