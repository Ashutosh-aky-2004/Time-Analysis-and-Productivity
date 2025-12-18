import React from "react";
import { ShimmerBase } from "../shimmer/Shimmer";

export default function ProfileShimmer() {
  return (
    <>
      <div className="min-h-[85vh] bg-[#f0f5fa] dark:bg-[#1B1A19] flex items-center justify-center p-4">
        <div className="w-full max-w-6xl space-y-4 sm:space-y-6">
          {/* Page Header */}
          <div className="mb-6 text-center sm:text-left space-y-2">
            <div className="flex justify-center sm:justify-start">
              <ShimmerBase className="h-8 w-48" />
            </div>
            <div className="flex justify-center sm:justify-start">
              <ShimmerBase className="h-4 w-64" />
            </div>
          </div>

          {/* Profile Header */}
          <div className="rounded-2xl bg-white dark:bg-[#323232] border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              <ShimmerBase className="w-20 h-20 sm:w-24 sm:h-24 md:w-24 md:h-24 rounded-full" />
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full space-y-3 text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start space-y-2">
                <ShimmerBase className="h-6 w-48 sm:w-64" />
                <ShimmerBase className="h-4 w-40 sm:w-56" />
              </div>

              <div className="flex gap-2 justify-center sm:justify-start mt-2">
                <ShimmerBase className="h-9 w-28 rounded-lg" />
                <ShimmerBase className="h-9 w-24 rounded-lg" />
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
              <ShimmerBase className="h-4 w-32" />
              <ShimmerBase className="h-4 w-40" />
            </div>
          </div>

          {/* Tabs */}
          <div className="rounded-2xl bg-white dark:bg-[#323232] border border-gray-100 dark:border-gray-700 p-1 shadow-sm">
            <div className="flex gap-2">
              <ShimmerBase className="h-10 flex-1 rounded-xl" />
              <ShimmerBase className="h-10 flex-1 rounded-xl" />
            </div>
          </div>

          {/* Content Area */}
          <div className="rounded-2xl bg-white dark:bg-[#323232] border border-gray-100 dark:border-gray-700 p-4 sm:p-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <ShimmerBase className="h-6 w-32" />
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <ShimmerBase className="h-4 w-20" />
                    <ShimmerBase className="h-12 w-full rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <ShimmerBase className="h-4 w-20" />
                    <ShimmerBase className="h-12 w-full rounded-lg" />
                  </div>
                </div>
                <div className="space-y-2">
                  <ShimmerBase className="h-4 w-16" />
                  <ShimmerBase className="h-12 w-full rounded-lg" />
                </div>
                <div className="space-y-2">
                  <ShimmerBase className="h-4 w-12" />
                  <ShimmerBase className="h-32 w-full rounded-lg" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <ShimmerBase className="h-4 w-16" />
                  <ShimmerBase className="h-12 w-full rounded-lg" />
                </div>
                <div className="space-y-2">
                  <ShimmerBase className="h-4 w-16" />
                  <ShimmerBase className="h-12 w-full rounded-lg" />
                </div>
                <div className="space-y-2">
                  <ShimmerBase className="h-4 w-24" />
                  <ShimmerBase className="h-12 w-full rounded-lg" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center sm:justify-end gap-3 mt-6">
              <ShimmerBase className="h-10 w-24 rounded-lg" />
              <ShimmerBase className="h-10 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
