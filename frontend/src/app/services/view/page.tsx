"use client";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ServiceDetail } from '@/components/service-detail';
function Content() { return <ServiceDetail id={useSearchParams().get('id') || ''}/>; }
export default function Page() { return <Suspense fallback={<p>Загружаем услугу…</p>}><Content/></Suspense>; }
