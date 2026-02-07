import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobileapp/features/batches/data/batches_repository.dart';
import 'package:mobileapp/features/batches/domain/batch.dart';

final batchesListProvider = FutureProvider.autoDispose<List<Batch>>((
  ref,
) async {
  final repository = ref.watch(batchesRepositoryProvider);
  return repository.getBatches();
});
