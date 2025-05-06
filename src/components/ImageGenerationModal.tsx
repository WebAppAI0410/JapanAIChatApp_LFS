import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { 
  generateImage, 
  ImageGenerationOptions, 
  GeneratedImage,
  getAvailableImageModels,
  checkImageGenerationAvailability
} from '../services/imageGeneration';

interface ImageGenerationModalProps {
  visible: boolean;
  onClose: () => void;
  onImageGenerated: (imageUrl: string, prompt: string) => void;
}

export const ImageGenerationModal: React.FC<ImageGenerationModalProps> = ({
  visible,
  onClose,
  onImageGenerated
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [loadingModels, setLoadingModels] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      loadAvailableModels();
    } else {
      setPrompt('');
      setGeneratedImage(null);
      setError(null);
    }
  }, [visible]);

  const loadAvailableModels = async () => {
    setLoadingModels(true);
    try {
      const models = await getAvailableImageModels();
      setAvailableModels(models);
      if (models.length > 0) {
        setSelectedModel(models[0]);
      }
    } catch (error) {
      console.error('Error loading image models:', error);
      setError('画像生成モデルの読み込みに失敗しました。');
    } finally {
      setLoadingModels(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      Alert.alert('エラー', '画像の説明を入力してください。');
      return;
    }

    if (!selectedModel) {
      Alert.alert('エラー', '画像生成モデルを選択してください。');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const availability = await checkImageGenerationAvailability(selectedModel);
      if (!availability.available) {
        Alert.alert('エラー', availability.reason || '画像生成モデルが利用できません。');
        setLoading(false);
        return;
      }

      const options: ImageGenerationOptions = {
        prompt: prompt.trim(),
        model: selectedModel,
        size: '1024x1024',
        quality: 'standard',
      };

      const image = await generateImage(options);
      setGeneratedImage(image);
    } catch (error) {
      console.error('Error generating image:', error);
      setError('画像の生成に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleUseImage = () => {
    if (generatedImage) {
      onImageGenerated(generatedImage.url, generatedImage.prompt);
      onClose();
    }
  };

  const renderModelSelector = () => {
    if (loadingModels) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.loadingText}>モデルを読み込み中...</Text>
        </View>
      );
    }

    if (availableModels.length === 0) {
      return (
        <Text style={styles.errorText}>
          利用可能な画像生成モデルがありません。
        </Text>
      );
    }

    return (
      <View style={styles.modelSelectorContainer}>
        <Text style={styles.sectionTitle}>モデルを選択</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.modelList}
        >
          {availableModels.map((modelId) => (
            <TouchableOpacity
              key={modelId}
              style={[
                styles.modelItem,
                selectedModel === modelId && styles.selectedModelItem
              ]}
              onPress={() => setSelectedModel(modelId)}
            >
              <Text style={[
                styles.modelName,
                selectedModel === modelId && styles.selectedModelText
              ]}>
                {modelId.includes('dall-e') ? 'DALL-E 3' : 'Stable Diffusion XL'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>画像生成</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {renderModelSelector()}

            <View style={styles.inputContainer}>
              <Text style={styles.sectionTitle}>画像の説明</Text>
              <TextInput
                style={styles.input}
                value={prompt}
                onChangeText={setPrompt}
                placeholder="生成したい画像の詳細な説明を入力してください..."
                placeholderTextColor={theme.colors.placeholder}
                multiline
                numberOfLines={4}
                maxLength={1000}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.generateButton,
                (!prompt.trim() || loading) && styles.disabledButton
              ]}
              onPress={handleGenerateImage}
              disabled={!prompt.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.generateButtonText}>画像を生成</Text>
              )}
            </TouchableOpacity>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            {generatedImage && (
              <View style={styles.resultContainer}>
                <Text style={styles.sectionTitle}>生成された画像</Text>
                <Image
                  source={{ uri: generatedImage.url }}
                  style={styles.generatedImage}
                  resizeMode="contain"
                />
                <TouchableOpacity
                  style={styles.useImageButton}
                  onPress={handleUseImage}
                >
                  <Text style={styles.useImageButtonText}>この画像を使用</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
    height: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSizes.large,
    fontWeight: theme.fontWeights.bold as any,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  modelSelectorContainer: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.medium,
    fontWeight: theme.fontWeights.medium as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  modelList: {
    paddingVertical: theme.spacing.sm,
  },
  modelItem: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedModelItem: {
    backgroundColor: `${theme.colors.primary}20`,
    borderColor: theme.colors.primary,
  },
  modelName: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
  },
  selectedModelText: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.medium as any,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  generateButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  disabledButton: {
    backgroundColor: theme.colors.border,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: theme.fontSizes.medium,
    fontWeight: theme.fontWeights.medium as any,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.placeholder,
  },
  errorText: {
    color: 'red',
    marginVertical: theme.spacing.md,
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  generatedImage: {
    width: '100%',
    height: 300,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.card,
  },
  useImageButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
    width: '100%',
  },
  useImageButtonText: {
    color: '#FFFFFF',
    fontSize: theme.fontSizes.medium,
    fontWeight: theme.fontWeights.medium as any,
  },
});
