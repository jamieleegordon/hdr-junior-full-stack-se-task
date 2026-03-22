// src/app/home/page.tsx
import React from "react";
import Link from "next/link";

type Dataset = {
  id: string;
  metadata: {
    summary: {
      title: string;
      description: string;
    };
      accessibility: {
        access: {
        accessServiceCategory: string;
        accessRights: string;
      };
    }
  }
};

async function getDataset() {
  const res = await fetch(
    "https://raw.githubusercontent.com/HDRUK/hackathon-entity-linkage/refs/heads/dev/fe-implement/app/data/all_datasets.json",
    { cache: "force-cache" }
  )
  return res.json()
}

const PAGE_SIZE = 15;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(typeof pageParam === "string" ? pageParam : "1", 10) || 1);

  const dataset = await getDataset()

  // get the unique items in the dataset as there are some duplicates
  const unique: Dataset[] = Array.from(new Map((dataset as Dataset[]).map((item) => [item.id, item])).values())

  const totalPages = Math.ceil(unique.length / PAGE_SIZE);
  const pageItems = unique.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Health Data Research UK Dataset</h1>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr className="divide-x divide-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-600 w-48">Title</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Description</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 w-44">Access Category</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 w-44">Access Rights</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {pageItems.map((item: Dataset) => (
              <tr key={item.id} className="hover:bg-gray-50 divide-x divide-gray-100">
                <td className="px-4 py-3 font-medium text-gray-900 align-top">{item.metadata.summary.title}</td>
                <td className="px-4 py-3 text-gray-600 align-top">{item.metadata.summary.description}</td>
                <td className="px-4 py-3 text-gray-600 align-top">{item.metadata.accessibility.access.accessServiceCategory}</td>
                <td className="px-4 py-3 align-top">
                  <a href={item.metadata.accessibility.access.accessRights} className="text-blue-600 hover:underline break-all" target="_blank" rel="noreferrer">
                    {item.metadata.accessibility.access.accessRights}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, unique.length)} of {unique.length} datasets
        </span>
        <div className="flex gap-2">
          {page > 1 ? (
            <Link href={`?page=${page - 1}`} className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100">
              Previous
            </Link>
          ) : (
            <span className="px-3 py-1 rounded border border-gray-200 text-gray-300 cursor-not-allowed">Previous</span>
          )}
          {page < totalPages ? (
            <Link href={`?page=${page + 1}`} className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100">
              Next
            </Link>
          ) : (
            <span className="px-3 py-1 rounded border border-gray-200 text-gray-300 cursor-not-allowed">Next</span>
          )}
        </div>
      </div>
    </div>
  );
}
