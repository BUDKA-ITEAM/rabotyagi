import { ServiceEditor } from "@/components/service-editor";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ServiceEditor id={(await params).id} />;
}
