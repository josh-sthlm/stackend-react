export const EVENT_STACKEND_INITIALIZED: string = "stackend-initialized'";
export const EVENT_MODULES_ADDED: string = 'stackend-modules-added';
export const EVENT_NAVIGATE_TO_PAGE: string = 'stackend-navigate-to-page';

/**
 * Defines methods available as window.stackend to the browser.
 */
export type ClientSideApi = {
  /**
   * Tell stackend to render any modules recently added to the dom
   * @param elements optional list of module elements
   */
  handleModulesAdded: (elements?: Array<Element>) => void;

  /**
   * The redux store. Gives access to data.
   */
  reduxStore: any;

  /**
   * Utility function to load scripts and invoke a callback when done
   * @param document
   * @param scripts
   * @param onScriptsLoaded
   */
  loadScripts: (document: Document, scripts: Array<string>, onScriptsLoaded?: () => void) => void;
};

declare let window: {
  __stackend: ClientSideApi;
};

/**
 * Get the client side api
 */
export function getClientSideApi(): ClientSideApi | null {
  // @ts-ignore
  return window.__stackend;
}

export function initializeClientSideApi(api: ClientSideApi): ClientSideApi {
  window.__stackend = api;
  return api;
}

/**
 * Utility method to load a number of scripts and run the supplied function when loaded
 */
export async function loadScripts(
  document: Document,
  scripts: Array<string>,
  onScriptsLoaded?: () => void
): Promise<any> {
  await Promise.all(
    scripts.map(s => {
      return new Promise(resolve => {
        // Ignore if already present
        if (document.querySelector('script[src="' + s + '"]')) {
          resolve(s);
          return;
        }
        let script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', s);
        script.addEventListener('load', () => {
          resolve(s);
        });
        document.body.appendChild(script);
      });
    })
  );

  if (onScriptsLoaded) {
    onScriptsLoaded();
  }
}

/**
 * Dispatch a custom event
 * @param document
 * @param name
 * @param bubbles
 * @param cancelable
 * @param details
 */
export function dispatchCustomEvent(
  document: Document,
  name: string,
  bubbles: boolean,
  cancelable: boolean,
  details: any
): void {
  const e = document.createEvent('CustomEvent');
  const d = Object.assign({}, details, {
    stackend: getClientSideApi()
  });
  e.initCustomEvent(name, bubbles, cancelable, d);
  document.dispatchEvent(e);
}
