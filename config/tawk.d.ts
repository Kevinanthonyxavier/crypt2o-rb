// tawk-messenger-react.d.ts
declare module '@tawk.to/tawk-messenger-react' {
  import { FC } from 'react';

  interface TawkMessengerProps {
    propertyId: string;
    widgetId: string;
    // Add other props if needed
  }
  declare var Tawk_API: {
    maximize: () => void;
    // Add other methods you might use from the Tawk API
  };
  const TawkMessengerReact: FC<TawkMessengerProps>;

  export default TawkMessengerReact;
}
// tawk.d.ts
declare var Tawk_API: {
  maximize: () => void;
  minimize: () => void;
  // Add other methods you might use from the Tawk API
  // For example:
  setAttributes: (attributes: Record<string, any>) => void;
  // Add more methods as needed
};