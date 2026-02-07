import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobileapp/features/batches/data/batches_repository.dart';
import 'package:mobileapp/features/batches/domain/batch.dart';

final batchDetailProvider = FutureProvider.autoDispose.family<Batch, String>((
  ref,
  id,
) async {
  final repository = ref.watch(batchesRepositoryProvider);
  return repository.getBatchById(id);
});

class BatchDetailScreen extends ConsumerWidget {
  final String batchId;

  const BatchDetailScreen({super.key, required this.batchId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final batchAsync = ref.watch(batchDetailProvider(batchId));

    return Scaffold(
      appBar: AppBar(title: const Text('Batch Details')),
      body: batchAsync.when(
        data: (batch) => SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildDetailCard(batch),
              const SizedBox(height: 16),
              const Text(
                'Timeline',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              // TODO: Implement Timeline Widget
              const Card(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text('Timeline placeholder'),
                ),
              ),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(child: Text('Error: $error')),
      ),
    );
  }

  Widget _buildDetailCard(Batch batch) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              batch.productName,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            _buildRow('Batch #', batch.batchNumber),
            _buildRow('Status', batch.status),
            _buildRow('Quantity', '${batch.quantity} ${batch.unit}'),
            _buildRow('Origin', batch.origin),
          ],
        ),
      ),
    );
  }

  Widget _buildRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}
