import React from 'react';
import Markdown from '@ronradtke/react-native-markdown-display';
import { useTheme } from 'react-native-paper';

interface StyledMarkdownProps {
  children: string;
}

export function StyledMarkdown({ children }: StyledMarkdownProps) {
  const theme = useTheme();

  const style = {
    text: {
      color: theme.colors.onBackground,
    },
    body: {
      backgroundColor: 'transparent',
    },
    blockquote: {
      backgroundColor: 'transparent',
    },
    code_inline: {
      color: theme.colors.onBackground,
      backgroundColor: 'transparent',
    },
  };

  return <Markdown style={style}>{children}</Markdown>;
}
