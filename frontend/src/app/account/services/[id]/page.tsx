import { ServiceEditor } from "@/components/service-editor";
import { services } from '@/lib/api';
export function generateStaticParams() { return [{id:'new'}, ...services.filter(service => service.ownerId === 'me').map(service => ({id:service.id}))]; }
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ServiceEditor id={(await params).id} />;
}
