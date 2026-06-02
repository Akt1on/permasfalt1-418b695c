import { QueryClient } from "@tanstack/react-query";
import { STATIC_SERVICES, STATIC_PROJECTS, STATIC_REVIEWS, STATIC_SETTINGS, STATIC_POSTS } from "./lib/static-data";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes — avoid re-fetching on every navigation
        gcTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  // Pre-seed cache with static data — страница рендерится мгновенно без ожидания Supabase
  queryClient.setQueryData(["services"], STATIC_SERVICES);
  queryClient.setQueryData(["projects"], STATIC_PROJECTS);
  queryClient.setQueryData(["reviews"], STATIC_REVIEWS);
  queryClient.setQueryData(["settings"], STATIC_SETTINGS);
  queryClient.setQueryData(["posts"], STATIC_POSTS);

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent", // preload on hover/focus
    defaultPreloadStaleTime: 1000 * 60 * 5,
  });

  return router;
};
