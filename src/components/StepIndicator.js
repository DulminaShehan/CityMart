import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

const STEPS = [
  { step: 1, title: 'Owner' },
  { step: 2, title: 'Shop' },
  { step: 3, title: 'Address' },
  { step: 4, title: 'Docs' },
  { step: 5, title: 'Review' },
];

export default function StepIndicator({ currentStep = 1 }) {
  return (
    <View style={styles.container}>
      {/* Progress percentage bar */}
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` },
          ]}
        />
      </View>

      {/* Step nodes with labels */}
      <View style={styles.nodesRow}>
        {STEPS.map((item) => {
          const isCompleted = item.step < currentStep;
          const isActive = item.step === currentStep;

          return (
            <View key={item.step} style={styles.nodeItem}>
              <View
                style={[
                  styles.nodeCircle,
                  isCompleted && styles.completedNode,
                  isActive && styles.activeNode,
                ]}
              >
                {isCompleted ? (
                  <Text style={styles.checkIcon}>✓</Text>
                ) : (
                  <Text
                    style={[
                      styles.nodeNumber,
                      isActive && styles.activeNodeNumber,
                    ]}
                  >
                    {item.step}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.nodeTitle,
                  isActive && styles.activeNodeTitle,
                  isCompleted && styles.completedNodeTitle,
                ]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  progressBarBackground: {
    height: 3,
    backgroundColor: colors.border,
    marginHorizontal: 28,
    borderRadius: 2,
    position: 'absolute',
    top: 29,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  nodesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  nodeItem: {
    alignItems: 'center',
    width: 56,
  },
  nodeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  activeNode: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  completedNode: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  nodeNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  activeNodeNumber: {
    color: colors.white,
  },
  checkIcon: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  nodeTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeNodeTitle: {
    color: colors.primary,
    fontWeight: '700',
  },
  completedNodeTitle: {
    color: colors.text,
  },
});
