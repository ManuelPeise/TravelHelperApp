import React from 'react';
import { Linking } from 'react-native';
import { CONTACT_EMAIL } from '@env';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ReportBugResult = { success: true } | { success: false; errorKey: string };

export const useBugReporting = () => {
  const [isBugReported, setIsBugReported] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const reportBug = React.useCallback(
    async (
      subject: string,
      content: string,
      email: string,
    ): Promise<ReportBugResult> => {
      try {
        setIsLoading(true);

        if (!subject.trim() || !content.trim() || !email.trim()) {
          return { success: false, errorKey: 'errorBugReportFieldsRequired' };
        }

        if (!EMAIL_REGEX.test(email.trim())) {
          return { success: false, errorKey: 'errorInvalidEmail' };
        }

        const body = `${content}\n\nFrom: ${email}`;
        const mailtoUri = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
          subject,
        )}&body=${encodeURIComponent(body)}`;

        await Linking.openURL(mailtoUri);
        setIsBugReported(true);
        return { success: true };
      } catch (error) {
        console.error('Error reporting bug:', error);
        return { success: false, errorKey: 'errorEmailClientNotAvailable' };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const reportBugBySystem = React.useCallback(async (error: Error) => {
    try {
      setIsLoading(true);

      if (!error.message.trim()) {
        return { success: false, errorKey: 'errorBugReportFieldsRequired' };
      }

      const subject = 'System Error Report';

      const body = `${error.message}\n\nFrom: System`;
      const mailtoUri = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;

      await Linking.openURL(mailtoUri);
      setIsBugReported(true);
      return { success: true };
    } catch (sendError) {
      console.error('Error reporting system bug:', sendError);
      return { success: false, errorKey: 'errorEmailClientNotAvailable' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isBugReported, isLoading, reportBug, reportBugBySystem };
};
