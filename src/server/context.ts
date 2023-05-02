import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";
import { IncomingMessage } from "http";
import { Clerk } from "@clerk/nextjs/dist/api";
import type { Session } from "@clerk/nextjs/dist/api";
import ws from "ws";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";

interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {
  session: Session | null;
}
/**
 * Inner context. Will always be available in your procedures, in contrast to the outer context.
 *
 * Also useful for:
 * - testing, so you don't have to mock Next.js' `req`/`res`
 * - tRPC's `createServerSideHelpers` where we don't have `req`/`res`
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function createContextInner(opts?: CreateInnerContextOptions) {
  return {
    //session: opts?.session,
  };
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (
  opts:
    | trpcNext.CreateNextContextOptions
    | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
) => {
  let session = null;
  try {
    const clerk = Clerk({ secretKey: process.env["CLERK_SECRET_KEY"] });
    session = (await clerk.sessions.getSessionList()).find(
      (ses: Session) => ses.status === "active"
    );
  } catch (err) {
    console.log(err);
  }
  return {
    session: session || null,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
