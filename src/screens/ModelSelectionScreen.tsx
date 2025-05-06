import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { theme } from '../styles/theme';
import { ModelSelector, AIModel } from '../components/ModelSelector';
import { Ionicons } from '@expo/vector-icons';

const mockModels: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'ChatGPT-4',
    provider: 'OpenAI',
    description: '最新のGPT-4モデル。高度な理解力と生成能力を持つAIです。',
    isPremium: true,
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    provider: 'Anthropic',
    description: '自然な会話と長文の理解に優れたAIアシスタント。',
    isPremium: true,
  },
  {
    id: 'deepseek',
    name: 'Deepseek',
    provider: 'Deepseek AI',
    description: '高度な知識と推論能力を持つ最新のAIモデル。',
    isPremium: false,
  },
  {
    id: 'qwen3-4b',
    name: 'Qwen3:4B',
    provider: 'Alibaba',
    description: 'オフラインでも使用可能な軽量AIモデル。プライバシーを重視する方に最適。',
    isLocal: true,
    isPremium: false,
  },
];

interface ModelSelectionScreenProps {
  route: any;
  navigation: any;
}

const ModelSelectionScreen: React.FC<ModelSelectionScreenProps> = ({ route, navigation }) => {
  const { currentModelId } = route.params || {};
  const [selectedModelId, setSelectedModelId] = useState(currentModelId || mockModels[0].id);

  React.useEffect(() => {
    navigation.setOptions({
      title: 'AIモデル選択',
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: '#FFFFFF',
    });
  }, [navigation]);

  const handleSelectModel = (modelId: string) => {
    setSelectedModelId(modelId);
  };

  const handleConfirm = () => {
    navigation.navigate('Chat', { modelId: selectedModelId });
  };

  return (
    <View style={styles.container}>
      <ModelSelector
        models={mockModels}
        selectedModelId={selectedModelId}
        onSelectModel={handleSelectModel}
      />
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>選択したモデルで会話を開始</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: theme.fontSizes.medium,
    fontWeight: theme.fontWeights.bold as any,
    marginRight: theme.spacing.sm,
  },
});

export default ModelSelectionScreen;
