import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radii, spacing, typography } from '../lib/theme';
import { useApp } from '../lib/AppContext';
import { OnboardingFlow } from '../screens/onboarding/OnboardingFlow';
import { HomeScreen } from '../screens/main/HomeScreen';
import { TasksScreen } from '../screens/main/TasksScreen';
import { CoachScreen } from '../screens/main/CoachScreen';
import { MealsScreen } from '../screens/main/MealsScreen';
import { WorkoutsScreen } from '../screens/main/WorkoutsScreen';
import { SpermTestScreen } from '../screens/main/SpermTestScreen';
import { SettingsScreen } from '../screens/main/SettingsScreen';
import { PartnerHomeScreen } from '../screens/partner/PartnerHomeScreen';
import { PartnerMealsScreen } from '../screens/partner/PartnerMealsScreen';
import { PartnerSupportScreen } from '../screens/partner/PartnerSupportScreen';

type MainTab = 'home' | 'tasks' | 'coach' | 'tests' | 'profile';
type PartnerTab = 'progress' | 'meals' | 'support' | 'settings';
type RouteState =
  | { kind: 'main'; tab: MainTab }
  | { kind: 'partner'; tab: PartnerTab }
  | { kind: 'detail'; screen: 'meals' | 'workouts' | 'tests' };

export function RootNavigator() {
  const { loading, profile, onboarding, pendingRoute, setPendingRoute } = useApp();
  const [view, setView] = useState<RouteState>({ kind: 'main', tab: 'home' });
  const [partnerView, setPartnerView] = useState<'man' | 'partner'>('partner');

  // Notification taps: jump to Coach or Tests.
  useEffect(() => {
    if (!pendingRoute) return;
    if (pendingRoute.kind === 'coach') {
      setPartnerView('man');
      setView({ kind: 'main', tab: 'coach' });
    } else if (pendingRoute.kind === 'tests') {
      setPartnerView('man');
      setView({ kind: 'main', tab: 'tests' });
    }
    // CoachScreen will read pendingRoute.autoSpeakSlot and clear it.
    if (pendingRoute.kind !== 'coach') setPendingRoute(null);
  }, [pendingRoute, setPendingRoute]);

  if (loading) {
    return <View style={styles.loading} />;
  }

  if (!profile || !onboarding.completed) {
    return <OnboardingFlow />;
  }

  const isGift = profile.mode === 'gift';

  // In Gift mode the woman starts on Partner Dashboard; she can flip to "his" view.
  const showPartner = isGift && partnerView === 'partner';

  if (showPartner) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.root}>
        <PartnerScreens view={view} />
        <PartnerTabBar
          current={view.kind === 'partner' ? view.tab : 'progress'}
          onChange={(tab) => setView({ kind: 'partner', tab })}
          onSwitchToMan={() => {
            setPartnerView('man');
            setView({ kind: 'main', tab: 'home' });
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.root}>
      <MainScreens view={view} setView={setView} />
      <MainTabBar
        current={view.kind === 'detail' ? 'tasks' : view.kind === 'main' ? view.tab : 'home'}
        onChange={(tab) => setView({ kind: 'main', tab })}
        onSwitchToPartner={
          isGift
            ? () => {
                setPartnerView('partner');
                setView({ kind: 'partner', tab: 'progress' });
              }
            : undefined
        }
      />
    </SafeAreaView>
  );
}

function MainScreens({ view, setView }: { view: RouteState; setView: (v: RouteState) => void }) {
  if (view.kind === 'detail') {
    if (view.screen === 'meals') return <MealsScreen />;
    if (view.screen === 'workouts') return <WorkoutsScreen />;
    return <SpermTestScreen />;
  }
  if (view.kind === 'main') {
    switch (view.tab) {
      case 'home':
        return (
          <HomeScreen
            onOpenCoach={() => setView({ kind: 'main', tab: 'coach' })}
            onOpenTasks={() => setView({ kind: 'main', tab: 'tasks' })}
            onOpenMeals={() => setView({ kind: 'detail', screen: 'meals' })}
            onOpenTests={() => setView({ kind: 'main', tab: 'tests' })}
          />
        );
      case 'tasks':
        return <TasksScreen />;
      case 'coach':
        return <CoachScreen />;
      case 'tests':
        return <SpermTestScreen />;
      case 'profile':
        return <SettingsScreen />;
    }
  }
  return null;
}

function PartnerScreens({ view }: { view: RouteState }) {
  if (view.kind !== 'partner') return <PartnerHomeScreen />;
  switch (view.tab) {
    case 'progress':
      return <PartnerHomeScreen />;
    case 'meals':
      return <PartnerMealsScreen />;
    case 'support':
      return <PartnerSupportScreen />;
    case 'settings':
      return <SettingsScreen />;
  }
}

function MainTabBar({
  current,
  onChange,
  onSwitchToPartner,
}: {
  current: MainTab;
  onChange: (t: MainTab) => void;
  onSwitchToPartner?: () => void;
}) {
  const tabs: { key: MainTab; label: string; icon: string }[] = [
    { key: 'home', label: 'Today', icon: '◐' },
    { key: 'tasks', label: 'Tasks', icon: '◇' },
    { key: 'coach', label: 'Coach', icon: '●' },
    { key: 'tests', label: 'Tests', icon: '◎' },
    { key: 'profile', label: 'Profile', icon: '☰' },
  ];
  return (
    <View style={styles.tabBar}>
      {tabs.map((t) => {
        const active = current === t.key;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            style={styles.tabItem}
          >
            <Text style={[styles.tabIcon, active && { color: colors.gold }]}>
              {t.icon}
            </Text>
            <Text style={[styles.tabLabel, active && { color: colors.gold }]}>
              {t.label}
            </Text>
          </Pressable>
        );
      })}
      {onSwitchToPartner ? (
        <Pressable style={styles.switchBtn} onPress={onSwitchToPartner}>
          <Text style={styles.switchText}>Her view</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function PartnerTabBar({
  current,
  onChange,
  onSwitchToMan,
}: {
  current: PartnerTab;
  onChange: (t: PartnerTab) => void;
  onSwitchToMan: () => void;
}) {
  const tabs: { key: PartnerTab; label: string; icon: string }[] = [
    { key: 'progress', label: 'Progress', icon: '◐' },
    { key: 'meals', label: 'Meals', icon: '◇' },
    { key: 'support', label: 'Support', icon: '♡' },
    { key: 'settings', label: 'Settings', icon: '☰' },
  ];
  return (
    <View style={styles.tabBar}>
      {tabs.map((t) => {
        const active = current === t.key;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            style={styles.tabItem}
          >
            <Text style={[styles.tabIcon, active && { color: colors.gold }]}>
              {t.icon}
            </Text>
            <Text style={[styles.tabLabel, active && { color: colors.gold }]}>
              {t.label}
            </Text>
          </Pressable>
        );
      })}
      <Pressable style={styles.switchBtn} onPress={onSwitchToMan}>
        <Text style={styles.switchText}>His view</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  loading: { flex: 1, backgroundColor: colors.bg },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
    gap: 2,
  },
  tabIcon: { fontSize: 18, color: colors.textMuted },
  tabLabel: { ...typography.micro, color: colors.textMuted },
  switchBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'center',
  },
  switchText: { ...typography.micro, color: colors.gold, letterSpacing: 1 },
});
