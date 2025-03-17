// Componente para capturar e exibir erros

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Componente para capturar e exibir erros de forma amigável na aplicação
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Atualiza o estado para exibir o fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log do erro para rastreamento
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Exibe o fallback personalizado se disponível, ou o fallback padrão
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Ionicons name="alert-circle-outline" size={64} color="#ff4500" />
          <Text style={styles.title}>Ops! Algo deu errado.</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'Ocorreu um erro inesperado.'}
          </Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={this.resetError}
          >
            <Text style={styles.buttonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8
  },
  message: {
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 24
  },
  button: {
    backgroundColor: '#ff4500',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold'
  }
});