// custom.d.ts
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

type ElectronUpdaterEvent =
  | {
      event: 'checking-for-update';
    }
  | {
      event: 'update-available' | 'update-not-available' | 'update-downloaded';
      version?: string;
    }
  | {
      event: 'download-progress';
      percent?: number;
      transferred?: number;
      total?: number;
    }
  | {
      event: 'error';
      message?: string;
    };

interface Window {
  electronApp?: {
    getVersion: () => Promise<string>;
    checkForUpdates: () => Promise<{ enabled: boolean; reason?: string }>;
    quitAndInstall: () => Promise<{ installed: boolean; reason?: string }>;
    onUpdaterEvent: (callback: (payload: ElectronUpdaterEvent) => void) => () => void;
  };
}
