import React from "react";
import { notFound } from "next/navigation";
import { getProviderBySlug, getUserByNationalId } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { ProviderDetailView } from "@/components/provider/ProviderDetailView";

interface ProviderDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ProviderDetailPage({ params }: ProviderDetailPageProps) {
  const { locale, slug } = await params;
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    notFound();
  }

  const session = await getCurrentUser();
  const currentUser = session ? await getUserByNationalId(session.nationalId) : null;

  return (
    <ProviderDetailView
      provider={provider}
      locale={locale}
      currentUser={currentUser}
    />
  );
}
