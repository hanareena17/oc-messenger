import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useThemeColors } from '../theme/ThemeProvider';

type Props = {
  visible: boolean;
  onClose: () => void;
  onNewChat?: () => void;
  onNewContact?: () => void;
  onNewCommunity?: () => void;
};

export default function NewChatModal({ visible, onClose, onNewChat, onNewContact, onNewCommunity }: Props) {
  const colors = useThemeColors();

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.modal, { backgroundColor: colors.surface }]}>
          <OptionItem
            icon="message-circle"
            title="New Chat"
            description="Send a message to your contact"
            onPress={() => {
              onNewChat?.();
              onClose();
            }}
            colors={colors}
          />
          
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          
          <OptionItem
            icon="user-plus"
            title="New Contact"
            description="Add a contact to be able to send messages"
            onPress={() => {
              onNewContact?.();
              onClose();
            }}
            colors={colors}
          />
          
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          
          <OptionItem
            icon="users"
            title="New Community"
            description="Join the community around you"
            onPress={() => {
              onNewCommunity?.();
              onClose();
            }}
            colors={colors}
          />
          
          <Pressable style={[styles.cancelBtn, { backgroundColor: colors.otherBubble }]} onPress={onClose}>
            <Text style={[styles.cancelText, { color: colors.primaryText }]}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

type OptionItemProps = {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  colors: ReturnType<typeof useThemeColors>;
};

function OptionItem({ icon, title, description, onPress, colors }: OptionItemProps) {
  return (
    <Pressable style={styles.option} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: colors.otherBubble }]}>
        <Feather name={icon as any} size={24} color={colors.primaryText} />
      </View>
      <View style={styles.optionText}>
        <Text style={[styles.optionTitle, { color: colors.primaryText }]}>{title}</Text>
        <Text style={[styles.optionDescription, { color: colors.secondaryText }]}>{description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 0,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  separator: {
    height: 1,
    marginHorizontal: 20,
  },
  cancelBtn: {
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

