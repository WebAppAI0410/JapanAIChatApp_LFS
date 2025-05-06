import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  imageUrl,
  size = 40,
  backgroundColor = theme.colors.primary,
  textColor = '#FFFFFF',
}) => {
  const getInitials = (name: string): string => {
    if (!name) return '';
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (
      nameParts[0].charAt(0).toUpperCase() + 
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  const initials = getInitials(name);
  const fontSize = size * 0.4;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: imageUrl ? 'transparent' : backgroundColor,
        },
      ]}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={[
            styles.image,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      ) : (
        <Text style={[styles.initials, { fontSize, color: textColor }]}>
          {initials}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontWeight: theme.fontWeights.bold as any,
  },
});
