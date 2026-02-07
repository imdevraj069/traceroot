import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobileapp/features/batches/data/batches_repository.dart';
import 'package:mobileapp/features/batches/domain/batch.dart';

final batchesListProvider = FutureProvider.autoDispose<List<Batch>>((
  ref,
) async {
  final repository = ref.watch(batchesRepositoryProvider);
  return repository.getBatches();
});

class BatchesController extends StateNotifier<AsyncValue<void>> {
  final BatchesRepository _repository;

  BatchesController(this._repository) : super(const AsyncValue.data(null));

  Future<void> createBatch(Map<String, dynamic> data) async {
    state = const AsyncValue.loading();
    try {
      await _repository.createBatch(data);
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final batchesControllerProvider =
    StateNotifierProvider<BatchesController, AsyncValue<void>>((ref) {
      return BatchesController(ref.read(batchesRepositoryProvider));
    });
