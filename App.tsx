import { StatusBar } from 'expo-status-bar';
import { StatusBar as RNStatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import ChatListScreen from './src/screens/ChatListScreen';
import ChatRoomScreen from './src/screens/ChatRoomScreen';
import ChatSettingsScreen from './src/screens/ChatSettingsScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import BottomNavBar from './src/components/BottomNavBar';
import NewChatModal from './src/components/NewChatModal';
import { ThemeProvider, useThemeColors } from './src/theme/ThemeProvider';

type Route =
  | { name: 'list' }
  | { name: 'chat'; id: string; title: string }
  | { name: 'chatSettings'; id: string; title: string }
  | { name: 'profile'; userId: string };

function Root() {
  const colors = useThemeColors();
  const scheme = useColorScheme();
  const [route, setRoute] = React.useState<Route>({ name: 'list' });
  const [showNewChatModal, setShowNewChatModal] = React.useState(false);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <RNStatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.content}>
        {route.name === 'list' && (
          <ChatListScreen onOpenChat={({ id, title }) => setRoute({ name: 'chat', id, title })} />
        )}
        {route.name === 'chat' && (
          <ChatRoomScreen
            conversationId={route.id}
            title={route.title}
            onBack={() => setRoute({ name: 'list' })}
            onOpenSettings={() => setRoute({ name: 'chatSettings', id: route.id, title: route.title })}
            onOpenProfile={(userId) => setRoute({ name: 'profile', userId })}
          />
        )}
        {route.name === 'chatSettings' && (
          <ChatSettingsScreen
            conversationId={route.id}
            conversationTitle={route.title}
            onBack={() => setRoute({ name: 'chat', id: route.id, title: route.title })}
          />
        )}
        {route.name === 'profile' && (
          <UserProfileScreen userId={route.userId} onBack={() => setRoute({ name: 'list' })} />
        )}
      </View>
      {route.name === 'list' && (
        <BottomNavBar
          onHome={() => setRoute({ name: 'list' })}
          onNewChat={() => setShowNewChatModal(true)}
          onProfile={() => setRoute({ name: 'profile', userId: 'me' })}
        />
      )}
      <NewChatModal
        visible={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onNewChat={() => {
          // TODO: Open new chat screen/dialog
        }}
        onNewContact={() => {
          // TODO: Open add contact screen
        }}
        onNewCommunity={() => {
          // TODO: Open new community screen
        }}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});
