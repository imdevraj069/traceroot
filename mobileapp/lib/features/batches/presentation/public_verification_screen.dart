import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobileapp/features/batches/data/batches_repository.dart';
import 'package:mobileapp/features/batches/domain/batch.dart';

final publicBatchProvider = FutureProvider.autoDispose.family<Batch, String>((
  ref,
  id,
) async {
  final repository = ref.watch(batchesRepositoryProvider);
  return repository.getPublicBatchById(id);
});

class PublicVerificationScreen extends ConsumerWidget {
  final String batchId;

  const PublicVerificationScreen({super.key, required this.batchId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final batchAsync = ref.watch(publicBatchProvider(batchId));

    return Scaffold(
      appBar: AppBar(title: const Text('Verify Product')),
      body: batchAsync.when(
        data: (batch) => SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Center(
                child: Icon(Icons.verified_user, size: 64, color: Colors.green),
              ),
              const SizedBox(height: 16),
              const Center(
                child: Text(
                  'Authentic Product',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              _buildDetailCard(batch),
              const SizedBox(height: 24),
              const Text(
                'Journey',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              if (batch.history.isEmpty)
                const Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text(
                    'No journey info available.',
                    style: TextStyle(fontStyle: FontStyle.italic),
                  ),
                )
              else
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: batch.history.length,
                  itemBuilder: (context, index) {
                    final item = batch.history[index];
                    return TimelineTile(
                      item: item,
                      isLast: index == batch.history.length - 1,
                    );
                  },
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
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text(
              batch.productName,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const Divider(),
            _buildRow('Batch Number', batch.batchNumber),
            _buildRow('Origin', batch.origin),
            _buildRow('Quantity', '${batch.quantity} ${batch.unit}'),
          ],
        ),
      ),
    );
  }

  Widget _buildRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

class TimelineTile extends StatelessWidget {
  final BatchHistoryItem item;
  final bool isLast;

  const TimelineTile({super.key, required this.item, required this.isLast});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            const Icon(Icons.circle, size: 16, color: Colors.indigo),
            if (!isLast)
              Container(
                width: 2,
                height: 50,
                color: Colors.indigo.withOpacity(0.3),
              ),
          ],
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(bottom: 24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.status,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 4),
                Text(item.location, style: const TextStyle(color: Colors.grey)),
                Text(
                  item.timestamp,
                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
