
'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
  getDocs,
} from 'firebase/firestore';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

type UseCollectionOptions = {
  realtime?: boolean;
};

/* Internal implementation of Query:
  https://github.com/firebase/firebase-js-sdk/blob/c5f08a9bc5da0d2b0207802c972d53724ccef055/packages/firestore/src/lite-api/reference.ts#L143
*/
export interface InternalQuery extends Query<DocumentData> {
  _query: {
    path: {
      canonicalString(): string;
      toString(): string;
    }
  }
}

const collectionCache = new Map<string, unknown>();
const collectionPendingRequests = new Map<string, Promise<unknown>>();

const getCollectionCacheKey = (
  targetRefOrQuery: CollectionReference<DocumentData> | Query<DocumentData>
) => {
  if ('path' in targetRefOrQuery && typeof targetRefOrQuery.path === 'string') {
    return targetRefOrQuery.path;
  }

  return (targetRefOrQuery as InternalQuery)._query.path.canonicalString();
};

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 * Handles nullable references/queries.
 * 
 *
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedTargetRefOrQuery or BAD THINGS WILL HAPPEN
 * use useMemo to memoize it per React guidence.  Also make sure that it's dependencies are stable
 * references
 *  
 * @template T Optional type for document data. Defaults to any.
 * @param {CollectionReference<DocumentData> | Query<DocumentData> | null | undefined} targetRefOrQuery -
 * The Firestore CollectionReference or Query. Waits if null/undefined.
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & {__memo?: boolean})  | null | undefined,
    options?: UseCollectionOptions,
): UseCollectionResult<T> {
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;
  const realtime = options?.realtime ?? true;
  const cacheKey = memoizedTargetRefOrQuery ? getCollectionCacheKey(memoizedTargetRefOrQuery) : null;

  const [data, setData] = useState<StateDataType>(() =>
    !realtime && cacheKey && collectionCache.has(cacheKey)
      ? (collectionCache.get(cacheKey) as StateDataType)
      : null
  );
  const [isLoading, setIsLoading] = useState<boolean>(() =>
    !!memoizedTargetRefOrQuery && !(!realtime && cacheKey && collectionCache.has(cacheKey))
  );
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!memoizedTargetRefOrQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (!realtime) {
      if (cacheKey && collectionCache.has(cacheKey)) {
        setData(collectionCache.get(cacheKey) as StateDataType);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      let pendingRequest = cacheKey
        ? (collectionPendingRequests.get(cacheKey) as Promise<StateDataType> | undefined)
        : undefined;

      if (!pendingRequest) {
        pendingRequest = getDocs(memoizedTargetRefOrQuery).then((snapshot) =>
          snapshot.docs.map((doc) => ({ ...(doc.data() as T), id: doc.id } as ResultItemType))
        );

        if (cacheKey) {
          collectionPendingRequests.set(cacheKey, pendingRequest);
        }
      }

      let isCancelled = false;

      pendingRequest
        .then((results) => {
          if (cacheKey) {
            collectionCache.set(cacheKey, results);
            collectionPendingRequests.delete(cacheKey);
          }

          if (isCancelled) {
            return;
          }

          setData(results);
          setError(null);
          setIsLoading(false);
        })
        .catch((requestError) => {
          if (cacheKey) {
            collectionPendingRequests.delete(cacheKey);
          }

          if (isCancelled) {
            return;
          }

          setError(requestError instanceof Error ? requestError : new Error('Koleksiyon yuklenemedi.'));
          setData(null);
          setIsLoading(false);
        });

      return () => {
        isCancelled = true;
      };
    }

    setIsLoading(true);
    setError(null);

    // Directly use memoizedTargetRefOrQuery as it's assumed to be the final query
    const unsubscribe = onSnapshot(
      memoizedTargetRefOrQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: ResultItemType[] = [];
        for (const doc of snapshot.docs) {
          results.push({ ...(doc.data() as T), id: doc.id });
        }
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        console.error("useCollection error:", error);
        setError(error);
        setData(null);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [cacheKey, memoizedTargetRefOrQuery, realtime]); // Re-run if the target query/reference changes.
  if(memoizedTargetRefOrQuery && !memoizedTargetRefOrQuery.__memo) {
    throw new Error('useCollection query was not properly memoized using useMemoFirebase');
  }
  return { data, isLoading, error };
}

    
