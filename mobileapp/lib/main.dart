import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/router/app_router.dart';

void main() {
  runApp(const ProviderScope(child: TraceRootApp()));
}

class TraceRootApp extends ConsumerWidget {
  const TraceRootApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    const primaryColor = Color(0xFF16A34A); // Green-600

    return MaterialApp.router(
      title: 'TraceRoot',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: primaryColor),
        useMaterial3: true,
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          backgroundColor: primaryColor,
          foregroundColor: Colors.white,
        ),
      ),
      routerConfig: ref.watch(routerProvider),
    );
  }
}
