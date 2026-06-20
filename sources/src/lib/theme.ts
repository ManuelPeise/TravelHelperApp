export type AppTheme = {
  background: {
    primary: string;
    secondary: string;
    accent: string;
    disabled: string;
  };
  card: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  border: string;
  success: string;
};

export const lightTheme: AppTheme = {
  background: {
    primary: '#FFFFFF',
    secondary: '#F0F0F0',
    accent: '#ffffff',
    disabled: '#E0E0E0',
  },
  card: '#F5F5F5',
  text: {
    primary: '#000000',
    secondary: '#555555',
    disabled: '#AAAAAA',
  },
  border: '#E5E5E5',
  success: '#4CAF50',
};

export const darkTheme: AppTheme = {
  background: {
    primary: '#121212',
    secondary: '#1E1E1E',
    accent: '#007AFF',
    disabled: '#555555',
  },
  card: '#1E1E1E',
  text: {
    primary: '#FFFFFF',
    secondary: '#AAAAAA',
    disabled: '#555555',
  },
  border: '#333333',
  success: '#4CAF50',
};
