import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  ScrollView,
  Alert
} from 'react-native';
import { theme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

interface SettingsItemProps {
  title: string;
  description?: string;
  icon?: any; // Using any for Ionicons name type
  rightElement?: React.ReactNode;
  onPress?: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ 
  title, 
  description, 
  icon, 
  rightElement,
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={styles.item}
      onPress={onPress}
      disabled={!onPress}
    >
      {icon && (
        <View style={styles.itemIcon}>
          <Ionicons name={icon} size={24} color={theme.colors.primary} />
        </View>
      )}
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        {description && (
          <Text style={styles.itemDescription}>{description}</Text>
        )}
      </View>
      {rightElement && (
        <View style={styles.itemRight}>
          {rightElement}
        </View>
      )}
    </TouchableOpacity>
  );
};

const SettingsScreen: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleOfflineMode = () => setOfflineMode(!offlineMode);
  const toggleNotifications = () => setNotifications(!notifications);

  const handleSubscription = () => {
    Alert.alert(
      'サブスクリプション',
      'サブスクリプションプランを選択してください',
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: '無料プラン', onPress: () => console.log('Free plan selected') },
        { text: 'ベーシック (¥480/月)', onPress: () => console.log('Basic plan selected') },
        { text: 'プレミアム (¥980/月)', onPress: () => console.log('Premium plan selected') },
      ]
    );
  };

  const handleDownloadModel = () => {
    Alert.alert(
      'ローカルモデルのダウンロード',
      'Qwen3:4Bモデル (約1.2GB) をダウンロードしますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: 'ダウンロード', onPress: () => console.log('Downloading model...') },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'アプリについて',
      'Japan AI Chat App\nバージョン 1.0.0\n\n日本人向けAIチャットアプリ',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <SettingsSection title="アカウント">
        <SettingsItem
          title="匿名ユーザー"
          description="ログインすると会話履歴が保存されます"
          icon="person-outline"
          rightElement={<Ionicons name="chevron-forward" size={20} color={theme.colors.placeholder} />}
          onPress={() => console.log('Login pressed')}
        />
        <SettingsItem
          title="サブスクリプション"
          description="現在のプラン: 無料"
          icon="card-outline"
          rightElement={<Ionicons name="chevron-forward" size={20} color={theme.colors.placeholder} />}
          onPress={handleSubscription}
        />
      </SettingsSection>

      <SettingsSection title="アプリ設定">
        <SettingsItem
          title="ダークモード"
          icon="moon-outline"
          rightElement={<Switch 
            value={darkMode} 
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#767577', true: theme.colors.primary }}
            thumbColor="#f4f3f4"
          />}
        />
        <SettingsItem
          title="オフラインモード"
          description="ローカルモデルのみを使用します"
          icon="cloud-offline-outline"
          rightElement={<Switch 
            value={offlineMode} 
            onValueChange={toggleOfflineMode}
            trackColor={{ false: '#767577', true: theme.colors.primary }}
            thumbColor="#f4f3f4"
          />}
        />
        <SettingsItem
          title="通知"
          icon="notifications-outline"
          rightElement={<Switch 
            value={notifications} 
            onValueChange={toggleNotifications}
            trackColor={{ false: '#767577', true: theme.colors.primary }}
            thumbColor="#f4f3f4"
          />}
        />
      </SettingsSection>

      <SettingsSection title="AIモデル">
        <SettingsItem
          title="ローカルモデルをダウンロード"
          description="Qwen3:4B (1.2GB)"
          icon="cloud-download-outline"
          rightElement={<Ionicons name="chevron-forward" size={20} color={theme.colors.placeholder} />}
          onPress={handleDownloadModel}
        />
        <SettingsItem
          title="モデル設定"
          description="APIキーと使用制限の設定"
          icon="construct-outline"
          rightElement={<Ionicons name="chevron-forward" size={20} color={theme.colors.placeholder} />}
          onPress={() => console.log('Model settings pressed')}
        />
      </SettingsSection>

      <SettingsSection title="その他">
        <SettingsItem
          title="アプリについて"
          icon="information-circle-outline"
          rightElement={<Ionicons name="chevron-forward" size={20} color={theme.colors.placeholder} />}
          onPress={handleAbout}
        />
        <SettingsItem
          title="プライバシーポリシー"
          icon="shield-outline"
          rightElement={<Ionicons name="chevron-forward" size={20} color={theme.colors.placeholder} />}
          onPress={() => console.log('Privacy policy pressed')}
        />
        <SettingsItem
          title="お問い合わせ"
          icon="mail-outline"
          rightElement={<Ionicons name="chevron-forward" size={20} color={theme.colors.placeholder} />}
          onPress={() => console.log('Contact pressed')}
        />
      </SettingsSection>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.medium,
    fontWeight: theme.fontWeights.bold as any,
    color: theme.colors.primary,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  itemIcon: {
    marginRight: theme.spacing.md,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.placeholder,
  },
  itemRight: {
    marginLeft: theme.spacing.sm,
  },
});

export default SettingsScreen;
