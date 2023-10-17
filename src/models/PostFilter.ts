export interface PostFilter {
  postFilterName: string;
  filterText?: boolean;
  filterLink?: boolean;
  filterImage?: boolean;
  filterGIF?: boolean;
  filterVideo?: boolean;
  applyOnlyToNSFW?: boolean;
  titleKeyWordsExclude?: string[];
  titleKeyWordsContains?: string[];
  titleRegexExclude?: string;
  titleRegexContains?: string;
  excludeCommunities?: string[];
  excludeUsers?: string[];
  excludeDomains?: string[];
  containDomains?: string[];
  minVote?: number;
  maxVote?: number;
  minComment?: number;
  maxComment?: number;
  languages?: string[];
}
