import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation';
import { useAuth } from '../contexts/AuthContext';
import { verifyCaptcha, validateCaptchaToken } from '../utils/captcha';
import Input from '../components/Input';
import Button from '../components/Button';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { signIn, googleSignIn } = useAuth();

  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validateInputs = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);

      // With mock implementation, we skip the actual captcha verification
      // since it will always return true

      // Sign in with email and password
      const { error } = await signIn(email, password);

      if (error) {
        Alert.alert('Error', error.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to login. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await googleSignIn();
    } catch (error) {
      Alert.alert('Error', 'Failed to login with Google. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Daily News</Text>
          </View>

          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <View style={styles.demoCredentialsContainer}>
            <Text style={styles.demoCredentialsTitle}>Demo Credentials</Text>
            <Text style={styles.demoCredentialsText}>
              Email: user@example.com
            </Text>
            <Text style={styles.demoCredentialsText}>
              Password: password123
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="example@email.com"
              keyboardType="email-address"
              error={errors.email}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              error={errors.password}
            />

            <TouchableOpacity
              onPress={() => {
                // Handle forgot password here
                Alert.alert('Reset Password', 'This feature is coming soon.');
              }}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              style={styles.button}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              title="Sign In with Google"
              onPress={handleGoogleLogin}
              variant="outline"
              fullWidth
              style={styles.button}
              loading={loading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.footerLinkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    marginTop: spacing.m,
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
  },
  welcomeText: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.m,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: spacing.m,
  },
  forgotPasswordText: {
    color: colors.secondary,
    fontSize: fontSize.s,
  },
  button: {
    marginTop: spacing.m,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.l,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.m,
    color: colors.textSecondary,
    fontSize: fontSize.s,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: fontSize.s,
  },
  footerLinkText: {
    color: colors.secondary,
    fontSize: fontSize.s,
    fontWeight: '600',
  },
  demoCredentialsContainer: {
    backgroundColor: colors.primary + '20', // Using a semi-transparent version of primary color
    padding: spacing.m,
    borderRadius: borderRadius.m,
    marginBottom: spacing.l,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  demoCredentialsTitle: {
    fontWeight: '700',
    color: colors.primary,
    fontSize: fontSize.m,
    marginBottom: spacing.s,
  },
  demoCredentialsText: {
    color: colors.text,
    fontSize: fontSize.s,
  },
});

export default LoginScreen;
