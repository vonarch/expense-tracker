declare module '@expo/vector-icons' {
  import { Component } from 'react';
  import { TextProps } from 'react-native';

  export class Ionicons extends Component<
    TextProps & { name: string; size?: number; color?: string }
  > {
    static glyphMap: Record<string, number>;
  }
}
