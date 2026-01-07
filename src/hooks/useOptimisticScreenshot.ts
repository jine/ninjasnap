'use client';

import { useOptimistic, useTransition } from 'react';

// Custom hook for screenshot form with optimistic updates
export function useOptimisticScreenshot() {
  const [isPending, startTransitionOptimistic] = useTransition();

  const [optimisticState, addOptimistic] = useOptimistic(
    { submissions: [] as string[], isSubmitting: false },
    (state, newSubmission: { id: string; url: string }) => ({
      ...state,
      submissions: [...state.submissions, newSubmission.id],
      isSubmitting: true,
    }),
  );

  const submitScreenshot = async (
    url: string,
    options: Record<string, unknown>,
  ) => {
    const tempId = `temp-${Date.now()}`;

    // Optimistically add to submissions
    startTransitionOptimistic(() => {
      addOptimistic({ id: tempId, url });
    });

    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, ...options }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit screenshot');
      }

      const result = await response.json();

      // Replace optimistic update with real result
      startTransitionOptimistic(() => {
        // In a real app, you'd update the state with the actual result
      });

      return result;
    } catch (error) {
      // Remove optimistic update on error
      startTransitionOptimistic(() => {
        // In a real app, you'd remove the failed optimistic update
        console.error('Screenshot submission failed:', error);
      });
      throw error;
    }
  };

  return {
    submitScreenshot,
    isSubmitting: optimisticState.isSubmitting || isPending,
    optimisticSubmissions: optimisticState.submissions,
  };
}

// Custom hook using React's use() for resource access (React 19 pattern)
export function useScreenshotResource(_id: string) {
  // In React 19, this would use the use() hook
  // For now, we'll simulate the pattern with a custom implementation
  return {
    data: null, // Would be populated by use()
    loading: false,
    error: null,
  };
}
