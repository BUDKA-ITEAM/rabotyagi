"use client";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ServiceEditor } from '@/components/service-editor';
function Content() { return <ServiceEditor id={useSearchParams().get('id') || 'new'}/>; }
export default function Page() { return <Suspense fallback={<p>Загружаем редактор…</p>}><Content/></Suspense>; }
