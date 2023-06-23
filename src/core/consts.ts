﻿import type { ListingType, SortType } from 'lemmy-js-client';
import type { IconSource } from 'react-native-paper/lib/typescript/src/components/Icon';

export const APP_NAME = 'Beyond';

export const SortTypes: SortType[] = [
  'Active',
  'Hot',
  'New',
  'Old',
  'TopDay',
  'TopWeek',
  'TopMonth',
  'TopYear',
  'TopAll',
  'MostComments',
  'NewComments',
];

export const SortTypesLabels: Record<SortType, string> = {
  Active: 'Active',
  Hot: 'Hot',
  New: 'New',
  Old: 'Old',
  TopDay: 'Top Day',
  TopWeek: 'Top Week',
  TopMonth: 'Top Month',
  TopYear: 'Top Year',
  TopAll: 'Top All',
  MostComments: 'Most Comments',
  NewComments: 'New Comments',
};

export const SortTypesIcons: Record<SortType, IconSource> = {
  Active: 'radioactive',
  Hot: 'fire',
  New: 'arrow-up-bold',
  Old: 'arrow-down-bold',
  TopDay: 'arrow-up-bold-outline',
  TopWeek: 'arrow-up-circle-outline',
  TopMonth: 'arrow-up-bold-box-outline',
  TopYear: 'arrow-up-bold-hexagon-outline',
  TopAll: 'stop-circle',
  MostComments: 'comment-multiple-outline',
  NewComments: 'comment-plus-outline',
};

export const ListingTypes: ListingType[] = ['Subscribed', 'Local', 'All'];
export const ListingTypesLabels: Record<ListingType, string> = {
  Subscribed: 'Subscribed',
  Local: 'Local',
  All: 'All',
};