import ReactGA from "react-ga4";

type EventName =
  | 'test_started'
  | 'test_completed'
  | 'question_answered'
  | 'certificate_downloaded'
  | 'ai_report_generated'
  | 'score_shared'
  | 'mode_selected'
  | 'test_abandoned';

interface EventParams {
  mode?: string;
  question_number?: number;
  domain?: string;
  iq_score?: number;
  correct?: boolean;
  time_taken?: number;
  [key: string]: any;
}

export function trackEvent(
  eventName: EventName,
  params?: EventParams
) {
  if (import.meta.env.VITE_GA_ID && import.meta.env.PROD) {
    ReactGA.event(eventName, {
      ...params,
      timestamp: Date.now(),
    });
  }
}
