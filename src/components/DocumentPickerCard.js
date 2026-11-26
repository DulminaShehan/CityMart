import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import colors from '../theme/colors';

export default function DocumentPickerCard({
  title,
  description,
  type = 'image', // 'image' or 'document'
  file,
  onPickSample,
  onRemove,
  isRequired = true,
}) {
  const handlePick = () => {
    Alert.alert(
      `Upload ${title}`,
      `Choose how you would like to attach your ${type === 'image' ? 'photo' : 'document'}:`,
      [
        {
          text: 'Select Sample / Demo',
          onPress: onPickSample,
        },
        {
          text: 'Choose from Device',
          onPress: onPickSample, // Hooks directly into picker or sample in sandbox
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            {isRequired ? (
              <Text style={styles.requiredBadge}>* Required</Text>
            ) : (
              <Text style={styles.optionalBadge}>Optional</Text>
            )}
          </View>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>

      {file ? (
        <View style={styles.uploadedContainer}>
          {type === 'image' && file.uri ? (
            <Image
              source={{ uri: file.uri }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.documentPreviewBox}>
              <Text style={styles.docIcon}>📄</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.docFileName} numberOfLines={1}>
                  {file.name || 'document_upload.pdf'}
                </Text>
                <Text style={styles.docFileSize}>{file.size || '1.8 MB'}</Text>
              </View>
            </View>
          )}

          <View style={styles.statusRow}>
            <View style={styles.verifiedChip}>
              <Text style={styles.verifiedText}>✓ Attached & Ready</Text>
            </View>
            <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePick}
          style={styles.uploadPlaceholder}
        >
          <Text style={styles.uploadIcon}>{type === 'image' ? '📷' : '📁'}</Text>
          <Text style={styles.uploadPrompt}>
            Tap to upload {type === 'image' ? 'photo' : 'document'}
          </Text>
          <Text style={styles.uploadSubPrompt}>
            {type === 'image' ? 'PNG, JPG up to 5MB' : 'PDF, JPG up to 10MB'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.2,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  requiredBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.error,
  },
  optionalBadge: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  uploadPlaceholder: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  uploadIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  uploadPrompt: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  uploadSubPrompt: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  uploadedContainer: {
    marginTop: 4,
  },
  imagePreview: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  documentPreviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  docIcon: {
    fontSize: 24,
  },
  docFileName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  docFileSize: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifiedChip: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  removeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.error,
  },
});
