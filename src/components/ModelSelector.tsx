import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ImageStyle } from 'react-native';
import { theme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon?: string;
  isLocal?: boolean;
  isPremium?: boolean;
}

interface ModelSelectorProps {
  models: AIModel[];
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModelId,
  onSelectModel,
}) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AIモデルを選択</Text>
      {models.map((model) => (
        <TouchableOpacity
          key={model.id}
          style={[
            styles.modelItem,
            selectedModelId === model.id && styles.selectedModelItem,
          ]}
          onPress={() => onSelectModel(model.id)}
        >
          <View style={styles.modelIconContainer}>
            {model.icon ? (
              <Image source={{ uri: model.icon }} style={styles.modelIcon as ImageStyle} />
            ) : (
              <View style={styles.defaultModelIcon}>
                <Ionicons name="cube-outline" size={24} color="#FFFFFF" />
              </View>
            )}
          </View>
          <View style={styles.modelInfo}>
            <View style={styles.modelHeader}>
              <Text style={styles.modelName}>{model.name}</Text>
              {model.isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>Premium</Text>
                </View>
              )}
              {model.isLocal && (
                <View style={styles.localBadge}>
                  <Text style={styles.localText}>ローカル</Text>
                </View>
              )}
            </View>
            <Text style={styles.modelProvider}>{model.provider}</Text>
            <Text style={styles.modelDescription}>{model.description}</Text>
          </View>
          {selectedModelId === model.id && (
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSizes.large,
    fontWeight: theme.fontWeights.bold as any,
    color: theme.colors.text,
    padding: theme.spacing.md,
  },
  modelItem: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
  },
  selectedModelItem: {
    backgroundColor: 'rgba(6, 199, 85, 0.1)',
  },
  modelIconContainer: {
    marginRight: theme.spacing.md,
  },
  modelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  defaultModelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelInfo: {
    flex: 1,
  },
  modelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  modelName: {
    fontSize: theme.fontSizes.medium,
    fontWeight: theme.fontWeights.bold as any,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  modelProvider: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.placeholder,
    marginBottom: theme.spacing.xs,
  },
  modelDescription: {
    fontSize: theme.fontSizes.regular,
    color: theme.colors.text,
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    marginRight: theme.spacing.sm,
  },
  premiumText: {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontWeights.bold as any,
    color: '#000000',
  },
  localBadge: {
    backgroundColor: '#4A90E2',
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  localText: {
    fontSize: theme.fontSizes.small,
    fontWeight: theme.fontWeights.bold as any,
    color: '#FFFFFF',
  },
});
