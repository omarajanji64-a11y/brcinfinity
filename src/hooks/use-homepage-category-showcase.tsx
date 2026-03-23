'use client';

import { useEffect, useMemo, useState } from 'react';
import { doc, getDoc, type DocumentData, type DocumentReference, type FirestoreError } from 'firebase/firestore';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase/client-provider';
import {
  HOMEPAGE_SETTINGS_COLLECTION,
  HOMEPAGE_SETTINGS_DOC,
  mergeHomepageCategoryShowcaseImages,
} from '@/lib/homepage';
import type { CategoryImage } from '@/lib/site-config';

type HomepageSettingsDocument = {
  categoryShowcaseImages?: unknown;
};

type HomepageSettingsSnapshot = HomepageSettingsDocument & {
  id: string;
};

type UseHomepageCategoryShowcaseOptions = {
  realtime?: boolean;
};

let cachedHomepageSettings: HomepageSettingsSnapshot | null = null;
let cachedHomepageSettingsPath: string | null = null;
let cachedHomepageSettingsRequest: Promise<HomepageSettingsSnapshot | null> | null = null;

const readHomepageSettingsOnce = async (
  homepageSettingsDoc: DocumentReference<DocumentData>
) => {
  const documentPath = homepageSettingsDoc.path;

  if (cachedHomepageSettings && cachedHomepageSettingsPath === documentPath) {
    return cachedHomepageSettings;
  }

  if (cachedHomepageSettingsRequest && cachedHomepageSettingsPath === documentPath) {
    return cachedHomepageSettingsRequest;
  }

  cachedHomepageSettingsPath = documentPath;
  cachedHomepageSettingsRequest = getDoc(homepageSettingsDoc)
    .then((snapshot) => {
      if (!snapshot.exists()) {
        cachedHomepageSettings = null;
        return null;
      }

      const nextValue = { ...(snapshot.data() as HomepageSettingsDocument), id: snapshot.id };
      cachedHomepageSettings = nextValue;
      return nextValue;
    })
    .finally(() => {
      cachedHomepageSettingsRequest = null;
    });

  return cachedHomepageSettingsRequest;
};

export const invalidateHomepageCategoryShowcaseCache = () => {
  cachedHomepageSettings = null;
  cachedHomepageSettingsPath = null;
  cachedHomepageSettingsRequest = null;
};

export function useHomepageCategoryShowcase(_options?: UseHomepageCategoryShowcaseOptions) {
  const realtime = _options?.realtime ?? true;
  const firestore = useFirestore();
  const homepageSettingsDoc = useMemoFirebase(
    () => doc(firestore, HOMEPAGE_SETTINGS_COLLECTION, HOMEPAGE_SETTINGS_DOC),
    [firestore]
  );
  const liveResult = useDoc<HomepageSettingsDocument>(realtime ? homepageSettingsDoc : null);
  const [data, setData] = useState<HomepageSettingsSnapshot | null>(() => (realtime ? null : cachedHomepageSettings));
  const [isLoading, setIsLoading] = useState<boolean>(() => !realtime && !cachedHomepageSettings);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (realtime) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (cachedHomepageSettings) {
      setData(cachedHomepageSettings);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    readHomepageSettingsOnce(homepageSettingsDoc)
      .then((homepageSettings) => {
        if (isCancelled) {
          return;
        }

        setData(homepageSettings);
        setIsLoading(false);
      })
      .catch((loadError: FirestoreError | Error) => {
        if (isCancelled) {
          return;
        }

        setError(loadError);
        setData(null);
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [homepageSettingsDoc, realtime]);

  const sourceData = realtime ? liveResult.data : data;
  const sourceIsLoading = realtime ? liveResult.isLoading : isLoading;
  const sourceError = realtime ? liveResult.error : error;

  const categoryShowcaseImages = useMemo<CategoryImage[]>(
    () => mergeHomepageCategoryShowcaseImages(sourceData?.categoryShowcaseImages),
    [sourceData]
  );

  return {
    categoryShowcaseImages,
    isLoading: sourceIsLoading,
    error: sourceError,
  };
}
