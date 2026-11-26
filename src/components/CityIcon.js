import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

export default function CityIcon({ name, size = 18, color = '#64748B', style }) {
  if (name === 'apple') {
    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        {/* Leaf */}
        <View
          style={{
            position: 'absolute',
            top: size * 0.04,
            right: size * 0.28,
            width: size * 0.25,
            height: size * 0.28,
            backgroundColor: color,
            borderTopLeftRadius: size * 0.25,
            borderBottomRightRadius: size * 0.25,
            transform: [{ rotate: '35deg' }],
          }}
        />
        {/* Body */}
        <View
          style={{
            position: 'absolute',
            bottom: size * 0.06,
            width: size * 0.76,
            height: size * 0.72,
            backgroundColor: color,
            borderRadius: size * 0.28,
          }}
        />
        {/* Bite cutout */}
        <View
          style={{
            position: 'absolute',
            top: size * 0.32,
            right: size * 0.08,
            width: size * 0.28,
            height: size * 0.28,
            backgroundColor: '#FFFFFF',
            borderRadius: size * 0.14,
          }}
        />
      </View>
    );
  }

  if (name === 'google') {
    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        <Text style={[styles.glyph, { fontSize: size * 0.9, color: '#EA4335', fontWeight: '900' }]}>
          G
        </Text>
      </View>
    );
  }

  if (name === 'facebook') {
    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        <Text style={[styles.glyph, { fontSize: size * 0.95, color: '#1877F2', fontWeight: '900' }]}>
          f
        </Text>
      </View>
    );
  }

  const renderGlyph = () => {
    switch (name) {
      case 'mail':
        return '✉';
      case 'lock':
        return '🔒';
      case 'eye':
        return '👁';
      case 'eye-off':
        return '🙈';
      case 'alert-circle':
        return '⚠';
      default:
        return '•';
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Text
        style={[
          styles.glyph,
          {
            fontSize: size * 0.85,
            color: color,
            fontWeight: '600',
          },
        ]}
      >
        {renderGlyph()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glyph: {
    textAlign: 'center',
    includeFontPadding: false,
  },
});
