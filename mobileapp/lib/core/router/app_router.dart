import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobileapp/features/auth/presentation/login_screen.dart';
import 'package:mobileapp/features/batches/presentation/batches_list_screen.dart';
import 'package:mobileapp/features/batches/presentation/create_batch_screen.dart';
import 'package:mobileapp/features/batches/presentation/batch_detail_screen.dart';
import 'package:mobileapp/features/scanner/presentation/scanner_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/login',
    routes: [
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(
        path: '/batches',
        builder: (context, state) => const BatchesListScreen(),
        routes: [
          GoRoute(
            path: 'scan',
            builder: (context, state) => const ScannerScreen(),
          ),
          GoRoute(
            path: 'create',
            builder: (context, state) => const CreateBatchScreen(),
          ),
          GoRoute(
            path: ':id',
            builder: (context, state) =>
                BatchDetailScreen(batchId: state.pathParameters['id']!),
          ),
        ],
      ),
    ],
  );
});
