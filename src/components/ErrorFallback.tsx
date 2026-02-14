import React from 'react';
import { Text, View } from 'react-native';
import RNRestart from 'react-native-restart';
import { StyleSheet } from 'react-native-unistyles';

import Button from '@/components/Button';
import { TextStyles } from '@/theme';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const handleRestart = () => {
    resetError();
    RNRestart.restart();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={[TextStyles.h2, styles.title]}>Oops! Something went wrong.</Text>
        <Text style={[TextStyles.body, styles.subtitle]}>
          We apologize for the inconvenience. Please try again or restart the app.
        </Text>
        <Text style={[TextStyles.bodySmall, styles.errorText]}>{error.toString()}</Text>
        <Button
          style={styles.button}
          testID="try-again-button"
          title="Try Again"
          onPress={handleRestart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.margins.xl,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    gap: theme.margins.lg,
  },
  title: {
    color: theme.colors.typography,
    marginBottom: theme.margins.md,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.textGray,
    textAlign: 'center',
    marginBottom: theme.margins.lg,
  },
  errorText: {
    color: theme.colors.danger,
    textAlign: 'center',
    marginBottom: theme.margins.xl,
    padding: theme.margins.md,
    backgroundColor: theme.colors.fadedWhite,
    borderRadius: 8,
    width: '100%',
  },
  button: {
    width: '100%',
  },
}));

export default ErrorFallback;
