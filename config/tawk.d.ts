// src/tawk.d.ts
declare module '@tawk.to/tawk-messenger-react' {
    import * as React from 'react';
  
    interface TawkMessengerProps {
      propertyId: string;
      widgetId: string;
    }
  
    const TawkMessengerReact: React.FC<TawkMessengerProps>;
    export default TawkMessengerReact;
  }