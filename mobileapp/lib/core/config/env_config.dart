class EnvConfig {
  static const String authUrl = String.fromEnvironment(
    'AUTH_URL',
    defaultValue: 'http://10.0.2.2:8001/api/auth',
  );
  static const String traceUrl = String.fromEnvironment(
    'TRACE_URL',
    defaultValue: 'http://10.0.2.2:8002/api',
  );
}
