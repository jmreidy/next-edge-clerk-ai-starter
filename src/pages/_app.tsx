import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};
export default trpc.withTRPC(MyApp);
