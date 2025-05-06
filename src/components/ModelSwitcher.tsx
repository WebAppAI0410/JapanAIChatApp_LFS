import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { MODEL_INFO } from '../services/apiConfig';
import { UserAvatar } from './UserAvatar';

interface ModelSwitcherProps {
  currentModelId: string;
  onModelChange: (modelId: string) => void;
}

export const ModelSwitcher: React.FC<ModelSwitcherProps> = ({
  currentModelId,
  onModelChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const currentModel = MODEL_INFO[currentModelId];
  
  const handleSelectModel = (modelId: string) => {
    onModelChange(modelId);
    setModalVisible(false);
  };
  
  const renderModelItem = ({ item }: { item: [string, any] }) => {
    const [modelId, modelInfo] = item;
    const isSelected = modelId === currentModelId;
    
    return (
      <TouchableOpacity
        style={[
          styles.modelItem,
          isSelected && styles.selectedModelItem,
        ]}
        onPress={() => handleSelectModel(modelId)}
      >
        <UserAvatar
          name={modelInfo.name}
          imageUrl={modelInfo.avatar}
          size={40}
          backgroundColor={theme.colors.secondary}
        />
        
        <View style={styles.modelInfo}>
          <Text style={styles.modelName}>{modelInfo.name}</Text>
          <Text style={styles.modelProvider}>{modelInfo.provider}</Text>
        </View>
        
        <View style={styles.modelBadges}>
          {modelInfo.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.badgeText}>Premium</Text>
            </View>
          )}
          
          {modelInfo.isLocal && (
            <View style={[styles.localBadge, modelInfo.isPremium && { marginTop: 4 }]}>
              <Text style={styles.badgeText}>ローカル</Text>
            </View>
          )}
        </View>
        
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <View>
      <TouchableOpacity
        style={styles.currentModel}
        onPress={() => setModalVisible(true)}
      >
        <UserAvatar
          name={currentModel?.name || 'AI'}
          imageUrl={currentModel?.avatar}
          size={32}
          backgroundColor={theme.colors.secondary}
        />
        
        <Text style={styles.currentModelName}>
          {currentModel?.name || 'AI Model'}
        </Text>
        
        <Ionicons name="chevron-down" size={16} color={theme.colors.text} />
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
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={Object.entries(MODEL_INFO)}
              renderItem={renderModelItem}
              keyExtractor={([modelId]) => modelId}
              contentContainerStyle={styles.modelList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  currentModel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  currentModelName: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.fontSizes.large,
    fontWeight: theme.fontWeights.bold as any,
    color: theme.colors.text,
  },
  modelList: {
    padding: theme.spacing.md,
  },
  modelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedModelItem: {
    backgroundColor: `${theme.colors.primary}10`,
  },
  modelInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  modelName: {
    fontSize: theme.fontSizes.medium,
    fontWeight: theme.fontWeights.medium as any,
    color: theme.colors.text,
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
  localBadge: {
    backgroundColor: theme.colors.secondary,
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
