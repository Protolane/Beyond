import React from 'react';
import type { ScaledSize } from 'react-native';
import { Dimensions } from 'react-native';

export function useDimensions() {
  const [dimensions, setDimensions] = React.useState<ScaledSize>(Dimensions.get('window'));

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions(Dimensions.get('window'));
    };

    const sub = Dimensions.addEventListener('change', handleResize);
    return () => sub.remove();
  }, []);

  return dimensions;
}
