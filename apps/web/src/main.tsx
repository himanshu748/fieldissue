import { AppUpdateNotice } from "@/components/field/app-update-notice";
import { clearCaptureDrafts } from "@/hooks/use-capture-draft";
import { clearWalk } from "@/lib/walk";
import { lazy, StrictMode, Suspense, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Link, Outlet, RouterProvider, ScrollRestoration } from "react-router";
import { MotionConfig } from "motion/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicLayout } from "@/components/layout/public-layout";
import { LandingPage } from "@/pages/landing";
import "./index.css";

function page<K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) {
  const Component = lazy<ComponentType>(() => load().then((m) => ({ default: m[name] as ComponentType })));
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-4" aria-busy="true">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-64" />
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}

function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-start justify-center gap-6 px-4 py-20">
      <p className="eyebrow text-muted-foreground">404</p>
      <h1 className="text-4xl font-bold uppercase">Nothing recorded at this address</h1>
      <p className="text-muted-foreground">The page or issue you followed does not exist on this deployment.</p>
      <Button asChild>
        <Link to="/app/explore">Explore issues</Link>
      </Button>
    </div>
  );
}

function Root() {
  return (
    <MotionConfig reducedMotion="user">
      <AppUpdateNotice />
      <ScrollRestoration />
      <Outlet />
    </MotionConfig>
  );
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: "/", element: <LandingPage /> },
      {
        element: <PublicLayout />,
        children: [
          { path: "/about", element: page(() => import("@/pages/info"), "AboutPage") },
          { path: "/methodology", element: page(() => import("@/pages/info"), "MethodologyPage") },
          { path: "/privacy", element: page(() => import("@/pages/info"), "PrivacyPage") },
        ],
      },
      {
        path: "/app",
        element: page(() => import("@/components/layout/app-shell"), "AppShell"),
        children: [
          { index: true, element: page(() => import("@/pages/explore"), "ExplorePage") },
          { path: "explore", element: page(() => import("@/pages/explore"), "ExplorePage") },
          { path: "report", element: page(() => import("@/pages/report"), "ReportPage") },
          { path: "report/review", element: page(() => import("@/pages/report-review"), "ReportReviewPage") },
          { path: "issues/:id", element: page(() => import("@/pages/issue-detail"), "IssueDetailPage") },
          { path: "issues/:id/revisit", element: page(() => import("@/pages/revisit"), "RevisitPage") },
          { path: "issues/:id/evidence", element: page(() => import("@/pages/evidence-walkthrough"), "EvidenceWalkthroughPage") },
          { path: "issues/:id/compare", element: page(() => import("@/pages/compare"), "ComparePage") },
          { path: "issues/:id/resolve", element: page(() => import("@/pages/resolve"), "ResolvePage") },
          { path: "walk", element: page(() => import("@/pages/walk"), "WalkPage") },
          { path: "offline", element: page(() => import("@/pages/offline"), "OfflinePage") },
          { path: "community", element: page(() => import("@/pages/community"), "CommunityPage") },
          { path: "lab", element: page(() => import("@/pages/lab"), "LabPage") },
          { path: "*", element: <NotFound /> },
        ],
      },
      { element: <PublicLayout />, children: [{ path: "*", element: <NotFound /> }] },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);



window.addEventListener("storage",event=>{if(event.key==="fieldissue-account-changed"){clearCaptureDrafts();clearWalk();window.location.reload();}});
