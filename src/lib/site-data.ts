import { supabase } from "@/integrations/supabase/client";
import {
  STATIC_SERVICES,
  STATIC_PROJECTS,
  STATIC_REVIEWS,
  STATIC_SETTINGS,
  STATIC_POSTS,
} from "./static-data";

export type Service = {
  id: string; slug: string; title: string; short_description: string | null;
  description: string | null; image_url: string | null; icon: string | null;
  price_from: number | null; price_unit: string | null; sort_order: number; is_active: boolean;
  keywords?: string | null;
};
export type Project = {
  id: string; slug: string; title: string; category: string | null;
  description: string | null; cover_image: string | null; location: string | null;
  completed_at: string | null; sort_order: number; is_active: boolean;
};
export type ProjectPhoto = { id: string; project_id: string; image_url: string; caption: string | null; sort_order: number };
export type SiteSettings = Record<string, any>;
export type Review = {
  id: string; author_name: string; author_role: string | null;
  content: string; rating: number; photo_url: string | null;
  is_active: boolean; sort_order: number;
};
export type Post = {
  id: string; slug: string; title: string; excerpt: string | null;
  content: string | null; cover_image: string | null; keywords: string | null;
  read_minutes: number; is_published: boolean; published_at: string | null;
  sort_order: number; created_at: string; updated_at: string;
};

const TIMEOUT_MS = 4000;

async function withTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), TIMEOUT_MS)),
  ]);
}

export async function fetchServices(): Promise<Service[]> {
  try {
    const result = await withTimeout(
      supabase
        .from("services")
        .select("id,slug,title,short_description,description,image_url,icon,price_from,price_unit,sort_order,is_active,keywords")
        .eq("is_active", true)
        .order("sort_order")
        .then(({ data }) => (data ?? []) as Service[]),
      STATIC_SERVICES
    );
    return result.length > 0 ? result : STATIC_SERVICES;
  } catch {
    return STATIC_SERVICES;
  }
}

export async function fetchAllServices(): Promise<Service[]> {
  try {
    const result = await withTimeout(
      supabase.from("services").select("*").order("sort_order")
        .then(({ data }) => (data ?? []) as Service[]),
      STATIC_SERVICES
    );
    return result.length > 0 ? result : STATIC_SERVICES;
  } catch {
    return STATIC_SERVICES;
  }
}

export async function fetchService(slug: string): Promise<Service | null> {
  try {
    const result = await withTimeout(
      supabase.from("services").select("*").eq("slug", slug).maybeSingle()
        .then(({ data }) => (data as Service) ?? null),
      STATIC_SERVICES.find((s) => s.slug === slug) ?? null
    );
    return result ?? STATIC_SERVICES.find((s) => s.slug === slug) ?? null;
  } catch {
    return STATIC_SERVICES.find((s) => s.slug === slug) ?? null;
  }
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const result = await withTimeout(
      supabase.from("projects").select("*").eq("is_active", true).order("sort_order")
        .then(({ data }) => (data ?? []) as Project[]),
      STATIC_PROJECTS
    );
    return result.length > 0 ? result : STATIC_PROJECTS;
  } catch {
    return STATIC_PROJECTS;
  }
}

export async function fetchAllProjects(): Promise<Project[]> {
  try {
    const result = await withTimeout(
      supabase.from("projects").select("*").order("sort_order")
        .then(({ data }) => (data ?? []) as Project[]),
      STATIC_PROJECTS
    );
    return result.length > 0 ? result : STATIC_PROJECTS;
  } catch {
    return STATIC_PROJECTS;
  }
}

export async function fetchProject(slug: string): Promise<Project | null> {
  try {
    const result = await withTimeout(
      supabase.from("projects").select("*").eq("slug", slug).maybeSingle()
        .then(({ data }) => (data as Project) ?? null),
      STATIC_PROJECTS.find((p) => p.slug === slug) ?? null
    );
    return result ?? STATIC_PROJECTS.find((p) => p.slug === slug) ?? null;
  } catch {
    return STATIC_PROJECTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function fetchProjectPhotos(projectId: string): Promise<ProjectPhoto[]> {
  try {
    const { data } = await supabase.from("project_photos").select("*").eq("project_id", projectId).order("sort_order");
    return (data ?? []) as ProjectPhoto[];
  } catch {
    return [];
  }
}

export async function fetchSettings(): Promise<SiteSettings> {
  try {
    const result = await withTimeout(
      supabase.from("site_settings").select("*").then(({ data }) => {
        const out: SiteSettings = {};
        for (const row of (data ?? []) as { key: string; value: any }[]) out[row.key] = row.value;
        return out;
      }),
      STATIC_SETTINGS
    );
    return Object.keys(result).length > 0 ? result : STATIC_SETTINGS;
  } catch {
    return STATIC_SETTINGS;
  }
}

export async function fetchPricing(serviceId: string) {
  try {
    const { data } = await supabase.from("pricing_items").select("*").eq("service_id", serviceId).order("sort_order");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function fetchReviews(): Promise<Review[]> {
  try {
    const result = await withTimeout(
      (supabase as any).from("reviews").select("*").eq("is_active", true).order("sort_order")
        .then(({ data }: any) => (data ?? []) as Review[]),
      STATIC_REVIEWS
    );
    return result.length > 0 ? result : STATIC_REVIEWS;
  } catch {
    return STATIC_REVIEWS;
  }
}

export async function fetchPosts(): Promise<Post[]> {
  try {
    const result = await withTimeout(
      (supabase as any).from("posts").select("*").eq("is_published", true).order("published_at", { ascending: false })
        .then(({ data }: any) => (data ?? []) as Post[]),
      STATIC_POSTS
    );
    return result;
  } catch {
    return STATIC_POSTS;
  }
}

export async function fetchAllPosts(): Promise<Post[]> {
  try {
    const result = await withTimeout(
      (supabase as any).from("posts").select("*").order("created_at", { ascending: false })
        .then(({ data }: any) => (data ?? []) as Post[]),
      STATIC_POSTS
    );
    return result;
  } catch {
    return STATIC_POSTS;
  }
}

export async function fetchPost(slug: string): Promise<Post | null> {
  try {
    const { data } = await (supabase as any).from("posts").select("*").eq("slug", slug).maybeSingle();
    return (data as Post) ?? null;
  } catch {
    return null;
  }
}

// ── Экспорт статических данных для initialData в useQuery ──
export { STATIC_SERVICES, STATIC_PROJECTS, STATIC_REVIEWS, STATIC_SETTINGS, STATIC_POSTS };
