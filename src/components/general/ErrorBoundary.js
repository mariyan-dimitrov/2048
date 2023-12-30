import { Component, useEffect, useState, useRef } from 'react';
import { useStoreMe } from 'store-me';

import getSearchQueryFromObject from '../../utils/getSearchQueryFromObject';
import getObjFromSearchQuery from '../../utils/getObjFromSearchQuery';
import log from '../../utils/log';

const ErrorBoundary = ({ children, renderError, onDidCatch, placeContext = 'Unknown', hideErrorComponent }) => {
  const { pathname } = useStoreMe('pathname');
  const [shouldReset, setShouldReset] = useState(false);
  const [hasError, setHasError] = useState(false);
  const lastPathnameErrorRef = useRef();

  useEffect(() => {
    if (hasError && lastPathnameErrorRef.current !== pathname) {
      setShouldReset(Date.now());
      setHasError(false);

      lastPathnameErrorRef.current = undefined;
    }
  }, [pathname, hasError]);

  return (
    <ErrorBoundaryClass
      renderError={renderError}
      placeContext={placeContext}
      hideErrorComponent={hideErrorComponent}
      onDidCatch={(error, errorInfo) => {
        setHasError(true);

        lastPathnameErrorRef.current = pathname;

        onDidCatch && onDidCatch(error, errorInfo);
      }}
      key={shouldReset}
    >
      {children}
    </ErrorBoundaryClass>
  );
};

class ErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorInfo: false,
      hasError: false,
      error: null,
    };
  }

  componentDidMount() {
    const query = getObjFromSearchQuery(window.location.search);

    if (query['cache-clear']) {
      delete query['cache-clear'];

      const newQuery = getSearchQueryFromObject(query);

      window.history.replaceState(null, null, `${window.location.pathname}${newQuery}`);
    }
  }

  componentDidCatch(error, errorInfo) {
    log.error('[error-boundary] - ', error, errorInfo);

    this.setState({
      errorInfo: errorInfo,
      hasError: true,
      error: error,
    });

    this.props.onDidCatch && this.props.onDidCatch(error, errorInfo);

    if (String(error).includes('ChunkLoadError')) {
      window.location = `${window.location.href}?cache-clear=${Date.now()}`;
    }
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return 'Error has occurred';
    } else {
      return children || null;
    }
  }
}

export default ErrorBoundary;
