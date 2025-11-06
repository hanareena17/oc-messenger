import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { usersById } from '../data/users';
import { useThemeColors } from '../theme/ThemeProvider';
import { ThemeColors } from '../theme/colors';
import Avatar from '../components/Avatar';
import { SIZES } from '../theme/constants';

type Props = {
  userId: string;
  onBack?: () => void;
};

export default function UserProfileScreen({ userId, onBack }: Props) {
  const colors = useThemeColors();
  const user = usersById[userId];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={[styles.navBar, { borderBottomColor: colors.border }]}> 
        <Pressable style={styles.navBack} onPress={onBack}><Text style={styles.navIcon}>‹</Text></Pressable>
        <Text style={[styles.navTitle, { color: colors.primaryText }]}>Profile</Text>
        <View style={styles.navBack} />
      </View>

      <View style={styles.header}> 
        <Avatar size={SIZES.avatar.xlarge} uri={user?.avatarUrl} name={user?.name} />
        <Text style={[styles.name, { color: colors.primaryText }]}>{user?.name}</Text>
        {!!user?.signature && <Text style={[styles.signature, { color: colors.secondaryText }]}>{user.signature}</Text>}
      </View>

      {userId === 'me' && (
        <View style={styles.infoSection}>
          <InfoRow label="Name" value={user?.name ?? ''} colors={colors} />
          {user?.email && <InfoRow label="Email" value={user.email} colors={colors} />}
          {user?.about && <InfoRow label="About" value={user.about} colors={colors} />}
        </View>
      )}

    </SafeAreaView>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
  colors: ThemeColors;
};

function InfoRow({ label, value, colors }: InfoRowProps) {
  return (
    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
      <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.primaryText }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1 },
  navBack: { width: 40, height: 32, alignItems: 'center', justifyContent: 'center' },
  navIcon: { fontSize: 22 },
  navTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700' },
  header: { alignItems: 'center', paddingTop: SIZES.spacing.xxl, paddingBottom: SIZES.spacing.md },
  name: { marginTop: SIZES.spacing.md, fontSize: SIZES.fontSize.xl, fontWeight: '700' },
  signature: { marginTop: 4, fontSize: 14 },
  infoSection: { paddingTop: 8 },
  infoRow: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 6,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
  },
  section: { paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: { fontSize: 12, textTransform: 'uppercase', marginBottom: 8 },
});


