import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../theme/ThemeProvider';

type Props = {
  size?: number;
  uri?: string;
  name?: string;
  showBorder?: boolean;
  borderColor?: string;
};

export default function Avatar({ size = 48, uri, name, showBorder = false, borderColor }: Props) {
  const colors = useThemeColors();
  const initial = (name ?? '?').charAt(0).toUpperCase();
  const borderClr = borderColor ?? colors.border;
  const innerSize = showBorder ? size - 4 : size;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {showBorder && (
        <View style={[styles.border, { width: size, height: size, borderRadius: size / 2, borderColor: borderClr }]} />
      )}
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            { width: innerSize, height: innerSize, borderRadius: innerSize / 2 },
            showBorder && styles.imageWithBorder,
          ]}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
              backgroundColor: colors.otherBubble,
            },
            showBorder && styles.imageWithBorder,
          ]}
        >
          <Text style={[styles.initial, { fontSize: innerSize * 0.4, color: colors.primaryText }]}>{initial}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    backgroundColor: '#E9ECEF',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontWeight: '700',
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderWidth: 2,
  },
  imageWithBorder: {
    margin: 2,
  },
});

