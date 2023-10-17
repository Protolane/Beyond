import { Animated, SafeAreaView, StyleSheet } from 'react-native';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { NavigationList } from '../ui/NavigationList';
import type { FormSchemaEntry } from '../core/form/components/Form';
import { FieldTypes, Form } from '../core/form/components/Form';
import ScrollView = Animated.ScrollView;
import { Languages } from '../models/Languages';
import { useFiltersStore } from '../stores/FiltersStore';
import type { PostFilter } from '../models/PostFilter';
import { useRefreshPostsCache } from '../api/lemmy';

export function CreateEditFilterScreen({ navigation }: DrawerScreenProps<NavigationList, 'CreateEditFilterScreen'>) {
  const { addFilter } = useFiltersStore(state => ({
    addFilter: state.addFilter,
  }));

  const { refresh: refreshPosts } = useRefreshPostsCache();

  function saveFilter(values: any) {
    const filter: PostFilter = {
      postFilterName: values.postFilterName,
      filterText: !!values.filterText,
      filterLink: !!values.filterLink,
      filterImage: !!values.filterImage,
      filterGIF: !!values.filterGIF,
      filterVideo: !!values.filterVideo,
      applyOnlyToNSFW: !!values.applyOnlyToNSFW,
      titleKeyWordsExclude: values.titleKeyWordsExclude?.split(','),
      titleKeyWordsContains: values.titleKeyWordsContains?.split(','),
      titleRegexExclude: values.titleRegexExclude,
      titleRegexContains: values.titleRegexContains,
      excludeCommunities: values.excludeCommunities?.split(','),
      excludeUsers: values.excludeUsers?.split(','),
      excludeDomains: values.excludeDomains?.split(','),
      containDomains: values.containDomains?.split(','),
      minVote: values.minVote < 0 ? undefined : values.minVote,
      maxVote: values.maxVote < 0 ? undefined : values.maxVote,
      minComment: values.minComment < 0 ? undefined : values.minComment,
      maxComment: values.maxComment < 0 ? undefined : values.maxComment,
      languages: values.languages?.map(l => l.value),
    };

    addFilter(filter);
    refreshPosts();
    navigation.navigate('PostFilterSettingsScreen');
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Form<PostFilter> schema={postFilterFormSchema} onSubmit={saveFilter} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

const postFilterFormSchema: FormSchemaEntry<FieldTypes, PostFilter>[] = [
  {
    name: 'postFilterName',
    label: 'Post Filter Name',
    type: FieldTypes.Text,
    rules: {
      required: true,
    },
  },
  {
    name: 'filterText',
    label: 'Text',
    type: FieldTypes.Checkbox,
    defaultValue: true,
  },
  {
    name: 'filterLink',
    label: 'Link',
    type: FieldTypes.Checkbox,
    defaultValue: true,
  },
  {
    name: 'filterImage',
    label: 'Image',
    type: FieldTypes.Checkbox,
    defaultValue: true,
  },
  {
    name: 'filterGIF',
    label: 'GIF',
    type: FieldTypes.Checkbox,
    defaultValue: true,
  },
  {
    name: 'filterVideo',
    label: 'Video',
    type: FieldTypes.Checkbox,
    defaultValue: true,
  },
  {
    name: 'applyOnlyToNSFW',
    label: 'Only NSFW',
    type: FieldTypes.Switch, // should be a switch instead
  },
  {
    name: 'titleKeyWordsExclude',
    label: 'Title: exclude keywords (key1,key2)',
    type: FieldTypes.Text,
  },
  {
    name: 'titleKeyWordsContains',
    label: 'Title: contains keywords (key1,key2)',
    type: FieldTypes.Text,
  },
  {
    name: 'titleRegexExclude',
    label: 'Title: exclude regex',
    type: FieldTypes.Text,
  },
  {
    name: 'titleRegexContains',
    label: 'Title: contains regex',
    type: FieldTypes.Text,
  },
  {
    name: 'excludeCommunities',
    label: 'Exclude communities (programming@beehaw.org,asklemmy@lemmy.ml)',
    type: FieldTypes.Text,
  },
  {
    name: 'excludeUsers',
    label: 'Exclude users (brunofin@lemm.ee,random@beehaw.org)',
    type: FieldTypes.Text,
  },
  {
    name: 'excludeDomains',
    label: 'Exclude domains (youtube.com,reddit.com)',
    type: FieldTypes.Text,
  },
  {
    name: 'containDomains',
    label: 'Contain domains (google.com,lemmy.world)',
    type: FieldTypes.Text,
  },
  {
    name: 'minVote',
    label: 'Min votes (-1: no restriction)',
    type: FieldTypes.Number,
    defaultValue: -1,
  },
  {
    name: 'maxVote',
    label: 'Max votes (-1: no restriction)',
    type: FieldTypes.Number,
    defaultValue: -1,
  },
  {
    name: 'minComment',
    label: 'Min comments (-1: no restriction)',
    type: FieldTypes.Number,
    defaultValue: -1,
  },
  {
    name: 'maxComment',
    label: 'Max comments (-1: no restriction)',
    type: FieldTypes.Number,
    defaultValue: -1,
  },
  {
    name: 'languages',
    label: 'Allowed languages',
    type: FieldTypes.Select,
    props: {
      options: Languages,
    },
  },
];
