import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { MODEL_INFO, MODELS } from '../services/apiConfig';
import { checkModelAvailability, getAvailableModelsForUser } from '../services/openRouter';
import { UserAvatar } from './UserAvatar';

interface ModelSwitcherProps {
  currentModelId: string;
  onModelChange: (modelId: string) => void;
}

export const ModelSwitcher: React.FC<ModelSwitcherProps> = ({ 
  currentModelId, 
  onModelChange 
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const currentModel = MODEL_INFO[currentModelId] || { name: 'AI', avatar: undefined };
  
  const openModelSelector = async () => {
    setModalVisible(true);
    setLoading(true);
    
    try {
      const models = await getAvailableModelsForUser();
      setAvailableModels(models);
    } catch (error) {
      console.error('Error fetching available models:', error);
      Alert.alert('エラー', 'モデル一覧の取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  };
  
  const handleModelSelect = async (modelId: string) => {
    if (modelId === currentModelId) {
      setModalVisible(false);
      return;
    }
    
    setLoading(true);
    
    try {
      const { available, reason, fallbackModel } = await checkModelAvailability(modelId);
      
      if (available) {
        onModelChange(modelId);
        setModalVisible(false);
      } else {
        if (fallbackModel) {
          Alert.alert(
            'モデル利用制限',
            `${reason}\n\n代わりに${MODEL_INFO[fallbackModel].name}を使用しますか？`,
            [
              { text: 'キャンセル', style: 'cancel' },
              { 
                text: '使用する', 
                onPress: () => {
                  onModelChange(fallbackModel);
                  setModalVisible(false);
                }
              }
            ]
          );
        } else {
          Alert.alert('モデル利用制限', reason);
        }
      }
    } catch (error) {
      console.error('Error checking model availability:', error);
      Alert.alert('エラー', 'モデルの利用可否の確認に失敗しました。');
    } finally {
      setLoading(false);
    }
  };
  
  const renderModelItem = ({ item }: { item: string }) => {
    const modelInfo = MODEL_INFO[item];
    const isSelected = item === currentModelId;
    
    return (
      <TouchableOpacity
        style={[
          styles.modelItem,
          isSelected && styles.selectedModelItem
        ]}
        onPress={() => handleModelSelect(item)}
      >
        <UserAvatar
          name={modelInfo.name}
          imageUrl={modelInfo.avatar || undefined}
          size={40}
          backgroundColor={theme.colors.secondary}
        />
        
        <View style={styles.modelInfoContainer}>
          <Text style={[
            styles.modelName,
            isSelected && styles.selectedModelText
          ]}>
            {modelInfo.name}
          </Text>
          
          <Text style={[
            styles.modelDescription,
            isSelected && styles.selectedModelText
          ]}>
            {modelInfo.description || modelInfo.provider}
          </Text>
          
          <View style={styles.modelBadgeContainer}>
            {modelInfo.tier === 'lite' && (
              <View style={[styles.modelBadge, styles.liteBadge]}>
                <Text style={styles.modelBadgeText}>Lite</Text>
              </View>
            )}
            
            {modelInfo.tier === 'heavy' && (
              <View style={[styles.modelBadge, styles.heavyBadge]}>
                <Text style={styles.modelBadgeText}>Premium</Text>
              </View>
            )}
            
            {modelInfo.isLocal && (
              <View style={[styles.modelBadge, styles.localBadge]}>
                <Text style={styles.modelBadgeText}>ローカル</Text>
              </View>
            )}
          </View>
        </View>
        
        {isSelected && (
          <Ionicons 
            name="checkmark-circle" 
            size={24} 
            color={theme.colors.primary} 
          />
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.currentModelButton}
        onPress={openModelSelector}
      >
        <UserAvatar
          name={currentModel?.name || 'AI'}
          imageUrl={currentModel?.avatar || undefined}
          size={32}
          backgroundColor={theme.colors.secondary}
        />
        
        <Text style={styles.currentModelName}>
          {currentModel?.name || 'AI Model'}
        </Text>
        
        <Ionicons name="chevron-down" size={18} color={theme.colors.text} />
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>AIモデルを選択</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>モデル情報を読み込み中...</Text>
              </View>
            ) : (
              <FlatList
                data={availableModels}
                renderItem={renderModelItem}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.modelList}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  currentModelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  currentModelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentModelLabel: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.placeholder,
    marginRight: theme.spacing.xs,
  },
  currentModelName: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    fontWeight: theme.fontWeights.medium as any,
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
    paddingBottom: theme.spacing.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.fontSizes.large,
    fontWeight: theme.fontWeights.bold as any,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  loadingContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.placeholder,
  },
  modelList: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  modelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedModelItem: {
    backgroundColor: `${theme.colors.primary}10`,
  },
  modelInfoContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.md,
  },
  modelName: {
    fontSize: theme.fontSizes.medium,
    fontWeight: theme.fontWeights.medium as any,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  selectedModelText: {
    color: theme.colors.primary,
  },
  modelDescription: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.placeholder,
    marginBottom: theme.spacing.xs,
  },
  modelBadgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modelBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.small,
    marginRight: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  liteBadge: {
    backgroundColor: `${theme.colors.secondary}20`,
  },
  heavyBadge: {
    backgroundColor: `${theme.colors.premium}20`,
  },
  localBadge: {
    backgroundColor: '#E0E0E020',
  },
  modelBadgeText: {
    fontSize: theme.fontSizes.tiny,
    fontWeight: theme.fontWeights.medium as any,
    color: theme.colors.text,
  },
  modelInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  modelProvider: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.placeholder,
    marginTop: 2,
  },
  modelBadges: {
    marginRight: theme.spacing.md,
  },
  premiumBadge: {
    backgroundColor: theme.colors.premium,
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: theme.fontSizes.tiny,
    color: '#FFFFFF',
    fontWeight: theme.fontWeights.medium as any,
  },
});
