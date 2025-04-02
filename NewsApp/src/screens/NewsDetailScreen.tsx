import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation';
import { colors, spacing, fontSize } from '../utils/theme';

type NewsDetailScreenRouteProp = RouteProp<RootStackParamList, 'NewsDetail'>;

const NewsDetailScreen: React.FC = () => {
  const route = useRoute<NewsDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { articleUrl, title } = route.params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleOpenInBrowser = async () => {
    try {
      const supported = await Linking.canOpenURL(articleUrl);

      if (supported) {
        await Linking.openURL(articleUrl);
      } else {
        Alert.alert('Error', 'Cannot open this URL in browser');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link');
      console.error(error);
    }
  };

  const renderRightHeader = () => {
    return (
      <TouchableOpacity
        style={styles.headerButton}
        onPress={handleOpenInBrowser}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Ionicons name="open-outline" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  // Set header right button
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderRightHeader,
    });
  }, [navigation]);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading article...</Text>
        </View>
      )}

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={colors.error} />
          <Text style={styles.errorTitle}>Failed to load article</Text>
          <Text style={styles.errorMessage}>
            There was a problem loading this article. Please try opening it in your browser.
          </Text>
          <TouchableOpacity
            style={styles.openBrowserButton}
            onPress={handleOpenInBrowser}
          >
            <Text style={styles.openBrowserButtonText}>Open in Browser</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          source={{ uri: articleUrl }}
          style={styles.webview}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          startInLoadingState={true}
          renderLoading={() => null}
          allowsBackForwardNavigationGestures
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    zIndex: 1,
  },
  loadingText: {
    marginTop: spacing.m,
    fontSize: fontSize.m,
    color: colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.m,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: fontSize.m,
    color: colors.textSecondary,
    marginTop: spacing.m,
    textAlign: 'center',
    marginBottom: spacing.l,
  },
  openBrowserButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
  },
  openBrowserButtonText: {
    color: 'white',
    fontSize: fontSize.m,
    fontWeight: '600',
  },
  headerButton: {
    padding: spacing.xs,
  },
});

export default NewsDetailScreen;
