export type InternalRouteAccessResult =
  | {
      ok: true;
      headerName: string;
    }
  | {
      ok: false;
      status: 404 | 401;
      reason: "disabled" | "missing-secret" | "token-mismatch";
      error: string;
    };

export type InternalRouteAccessConfig = {
  routeLabel: string;
  headerName: string;
  isEnabled: () => boolean;
  getExpectedSecret: () => string | null;
};

export function evaluateInternalRouteAccess(
  request: Request,
  config: InternalRouteAccessConfig,
): InternalRouteAccessResult {
  if (!config.isEnabled()) {
    return {
      ok: false,
      status: 404,
      reason: "disabled",
      error: `${config.routeLabel} is not enabled.`,
    };
  }

  const expectedSecret = config.getExpectedSecret();

  if (!expectedSecret) {
    return {
      ok: false,
      status: 401,
      reason: "missing-secret",
      error: `${config.routeLabel} token is not configured.`,
    };
  }

  const providedSecret = request.headers.get(config.headerName);

  if (providedSecret !== expectedSecret) {
    return {
      ok: false,
      status: 401,
      reason: "token-mismatch",
      error: `Unauthorized ${config.routeLabel.toLowerCase().replace(/ route$/, "")} request.`,
    };
  }

  return {
    ok: true,
    headerName: config.headerName,
  };
}
